using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using Kunzad.Models;

namespace Kunzad.ApiControllers
{
    public class ConsolidationController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private Response response = new Response();
        private int pageSize = AppSettingsGet.PageSize;
        
        // GET: api/VanStuff
        public IQueryable<Shipment> GetShipments()
        {
            return db.Shipments;
        }

        // GET: api/VanStuff?parentShipmentId=1&page=1
        public IHttpActionResult GetSeaFreightShipments(int parentShipmentId, int page)
        {
            int skip;
            if (page > 1)
                skip = (page - 1) * pageSize;
            else
                skip = 0;

            var vanStuffing = db.Shipments
                .Include(v => v.Address.CityMunicipality.StateProvince)
                .Include(v => v.Address1)
                .Include(v => v.Address1.CityMunicipality.StateProvince)
                .Include(v => v.BusinessUnit)
                .Include(v => v.BusinessUnit1)
                .Include(v => v.Service)
                .Include(v => v.ShipmentType)
                .Include(v => v.Customer)
                .Include(v => v.Customer.CustomerAddresses)
                .Include(v => v.Customer.CustomerAddresses.Select(ca => ca.CityMunicipality))
                .Include(v => v.Customer.CustomerAddresses.Select(ca => ca.CityMunicipality.StateProvince))
                .Include(v => v.Customer.CustomerContacts)
                .Include(v => v.Customer.CustomerContacts.Select(cc => cc.Contact))
                .Include(v => v.Customer.CustomerContacts.Select(cc => cc.Contact.ContactPhones))
                .Where(v => v.ParentShipmentId == parentShipmentId)
                .OrderBy(v => v.Id)
                .Skip(skip).Take(pageSize).AsNoTracking().ToArray();

            return Ok(vanStuffing);
        }

        // GET: api/VanStuff/5
        [ResponseType(typeof(Shipment))]
        public IHttpActionResult GetShipment(int id)
        {
            Shipment shipment = db.Shipments.Find(id);
            if (shipment == null)
            {
                return NotFound();
            }

            return Ok(shipment);
        }

        [HttpGet]
        //[CacheOutput(ClientTimeSpan = 6, ServerTimeSpan = 6)]
        public IHttpActionResult GetShipment(string type,int consolidationType, int param1, [FromUri]List<Shipment> shipment)
        {
            Shipment[] shipments = new Shipment[pageSize];
            this.filterRecord(param1, type, consolidationType, shipment.ElementAt(0), shipment.ElementAt(1), ref shipments);

            if (shipments != null)
                return Ok(shipments);
            else
                return Ok();
        }

        // PUT: api/VanStuff/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutShipment(int id,List<Shipment> shipment)
        {
            Boolean parent = true;
            Boolean vanstuff = true;
            Boolean flag = true;

            int parentShipmentId = 0;

            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad request.";
                return Ok(response);
            }
            try
            {
                Consolidation consolidation = new Consolidation();
                foreach (Shipment s in shipment)
                {
                    if (parent == true)
                    {
                        s.LastUpdatedDate = DateTime.Now;
                        db.Entry(shipment).State = EntityState.Modified;

                        db.SaveChanges();

                        //assign parent shipmentId
                        parentShipmentId = s.Id;

                        //vanstuff
                        if (s.ConsolidationNo2 != null)
                             vanstuff = false;
                           
                        parent = false;
                    }
                    else
                    {
                        var currentConsolidationDetails = db.Shipments.Where(currentDetails => currentDetails.Id == s.Id);
                        
                        foreach (Shipment s1 in currentConsolidationDetails)
                        {
                            flag = false;
                            var shipmentCurrentHolder = db.Shipments.Find(s1.Id);
                            
                            if(s.Id == s1.Id)
                            {
                                flag = true;
                                break;
                            }
                            else
                            {
                                //Shipment that is removed in Consolidation Detail
                                var shipmentInConsolidationToBeRemoved = db.Consolidations.Where(c => c.ShipmentId == s1.Id && c.ParentShipmentId == s1.ParentShipmentId);
                                foreach (Consolidation shipmentConsolidation in shipmentInConsolidationToBeRemoved)
                                {
                                    db.Consolidations.Remove(shipmentConsolidation);
                                }

                                
                                s1.ParentShipmentId = 0;
                                s1.IsConsolidation = false;
                                var shipmentToBeRemovedInConsolidationHolder = db.Shipments.Find(s1.Id);

                                db.Entry(shipmentCurrentHolder).CurrentValues.SetValues(shipmentToBeRemovedInConsolidationHolder);
                                db.Entry(shipmentCurrentHolder).State = EntityState.Modified;

                                db.SaveChanges();
                            }

                        }
                        if (!flag)
                        {
                            s.ParentShipmentId = parentShipmentId;
                            s.IsConsolidation = true;

                            var shipmentHolder = db.Shipments.Find(s.Id);
                            db.Entry(shipmentHolder).CurrentValues.SetValues(s);
                            db.Entry(shipmentHolder).State = EntityState.Modified;

                            //consolidate detail
                            consolidation.ShipmentId = s.Id;
                            consolidation.ParentShipmentId = parentShipmentId;

                            //vanstuff
                            if (vanstuff)
                                consolidation.ConsolidationTypeId = 20;
                            //batch
                            else
                                consolidation.ConsolidationTypeId = 10;

                            consolidation.CreatedDate = DateTime.Now;
                            db.Consolidations.Add(consolidation);

                            db.SaveChanges();
                        }                       
                    }
                }

                response.status = "SUCCESS";
                response.objParam1 = shipment;
            }
            catch (Exception e)
            {
                response.message = e.InnerException.InnerException.Message.ToString();
            }

            return Ok(response);
        }

        // POST: api/VanStuff
        [ResponseType(typeof(Shipment))]
        public IHttpActionResult PostShipment(List<Shipment> shipment)
        {
            Boolean parent = true;
            Boolean vanstuff = true;

            int parentShipmentId = 0;
            
            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad request.";
                return Ok(response);
            }
            try
            {
                Consolidation consolidation = new Consolidation();
                foreach(Shipment s in shipment)
                {
                    if (parent == true)
                    {
                        s.CreatedDate = DateTime.Now;
                        s.TransportStatusId = (int)Status.TransportStatus.Open;
                        s.LoadingStatusId = (int)Status.LoadingStatus.Open;
                        s.TransportStatusRemarks = "For pickup from customer";
                        s.IsConsolidation = true;

                        db.Shipments.Add(s);

                        db.SaveChanges();

                        //assign parent shipmentId
                        parentShipmentId = s.Id;

                        //consolidate master       
                        consolidation.ShipmentId = parentShipmentId;
                        consolidation.ParentShipmentId = 0;

                        //vanstuff
                        if(s.ConsolidationNo2 != null)
                            consolidation.ConsolidationTypeId = 20;
                        //batch
                        else
                        {
                            consolidation.ConsolidationTypeId = 10;
                            vanstuff = false;
                        }

                        consolidation.CreatedDate = DateTime.Now;
                        db.Consolidations.Add(consolidation);

                        db.SaveChanges();

                        parent = false;
                    }
                    else
                    {
                        s.ParentShipmentId = parentShipmentId;
                        s.IsConsolidation = true;

                        var shipmentHolder = db.Shipments.Find(s.Id);
                        db.Entry(shipmentHolder).CurrentValues.SetValues(s);
                        db.Entry(shipmentHolder).State = EntityState.Modified;

                        //consolidate detail
                        consolidation.ShipmentId = s.Id;
                        consolidation.ParentShipmentId = parentShipmentId;
                        
                        //vanstuff
                        if (vanstuff)
                            consolidation.ConsolidationTypeId = 20;
                        //batch
                        else
                            consolidation.ConsolidationTypeId = 10;

                        consolidation.CreatedDate = DateTime.Now;
                        db.Consolidations.Add(consolidation);

                        db.SaveChanges();
                    }
                }

                response.status = "SUCCESS";
                response.objParam1 = shipment;
            }
            catch (Exception e)
            {
                response.message = e.InnerException.InnerException.Message.ToString();
             }
            //catch (System.Data.Entity.Validation.DbEntityValidationException dbEx)
            //{
            //    Exception raise = dbEx;
            //    foreach (var validationErrors in dbEx.EntityValidationErrors)
            //    {
            //        foreach (var validationError in validationErrors.ValidationErrors)
            //        {
            //            string message = string.Format("{0}:{1}",
            //                validationErrors.Entry.Entity.ToString(),
            //                validationError.ErrorMessage);
            //            // raise a new exception nesting
            //            // the current instance as InnerException
            //            raise = new InvalidOperationException(message, raise);
            //        }
            //    }
            //    throw raise;
            //}

            return Ok(response);
        }

        // DELETE: api/VanStuff/5
        [ResponseType(typeof(Shipment))]
        public IHttpActionResult DeleteShipment(int id)
        {
            //check if shipment in detail was replaced/removed
            //foreach (Shipment s1 in currentConsolidationDetails)
            //{
            //    flag = false;
            //    foreach (Shipment s2 in shipment)
            //    {
            //        if (s1.Id == s2.Id)
            //        {
            //            flag = true;
            //            break;
            //        }
            //    }
            //    //if replaced/removed then reset parentShipmentId to 0
            //    if (!flag)
            //    {
            //        var consolidationDetail = db.Shipments.Where(s3 => s3.Id == s1.Id);
            //        foreach (Shipment s4 in consolidationDetail)
            //        {
            //            var shipmentHolder = db.Shipments.Find(s4.Id);

            //            var consolidation1 = db.Consolidations.Where(c => c.ShipmentId == s4.Id && c.ParentShipmentId == parentShipmentId);
            //            foreach (Consolidation c in consolidation1)
            //            {
            //                db.Consolidations.Remove(c);
            //            }

            //            s4.ParentShipmentId = 0;
            //            db.Entry(shipmentHolder).CurrentValues.SetValues(s4);

            //        }
            //    }
            //}

            Shipment shipment = db.Shipments.Find(id);
            if (shipment == null)
            {
                return NotFound();
            }

            db.Shipments.Remove(shipment);
            db.SaveChanges();

            return Ok(shipment);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ShipmentExists(int id)
        {
            return db.Shipments.Count(e => e.Id == id) > 0;
        }

        public void filterRecord(int param1, string type, int consolidationType, Shipment shipment, Shipment shipment1, ref Shipment[] shipments)
        {

            /*
                * If date is not nullable in table equate to "1/1/0001 12:00:00 AM" else null
                * If integer value is not nullable in table equate to 0 else null
                * Use modified date if filtered data type is date
                */
            DateTime defaultDate = new DateTime(0001, 01, 01, 00, 00, 00);
            int skip;

            if (type.Equals("paginate"))
            {
                if (param1 > 1)
                    skip = (param1 - 1) * pageSize;
                else
                    skip = 0;
            }
            else
                skip = param1;

            var filteredShipments = db.Shipments
                .Include(s => s.Address.CityMunicipality.StateProvince)
                .Include(s => s.Address1)
                .Include(s => s.Address1.CityMunicipality.StateProvince)
                .Include(s => s.BusinessUnit)
                .Include(s => s.BusinessUnit1)
                .Include(s => s.Service)
                .Include(s => s.ShipmentType)
                .Include(s => s.Customer)
                .Include(s => s.Customer.CustomerAddresses)
                .Include(s => s.Customer.CustomerAddresses.Select(ca => ca.CityMunicipality))
                .Include(s => s.Customer.CustomerAddresses.Select(ca => ca.CityMunicipality.StateProvince))
                .Include(s => s.Customer.CustomerContacts)
                .Include(s => s.Customer.CustomerContacts.Select(cc => cc.Contact))
                .Include(s => s.Customer.CustomerContacts.Select(cc => cc.Contact.ContactPhones))
                .Where(s => shipment.Id == null || shipment.Id == 0 ? true : s.Id == shipment.Id)
                .Where(s => shipment.ShipmentTypeId == null || shipment.ShipmentTypeId == 0 ? true : s.ShipmentTypeId == shipment.ShipmentTypeId)
                .Where(s => shipment.BusinessUnitId == null || shipment.BusinessUnitId == 0 ? true : s.BusinessUnitId == shipment.BusinessUnitId)
                .Where(s => shipment.ConsolidationNo1 == null || shipment.ConsolidationNo1 == 0 ? true : s.ConsolidationNo1 == shipment.ConsolidationNo1)
                .Where(s => shipment.ConsolidationNo2 == null || shipment.ConsolidationNo2 == 0 ? true : s.ConsolidationNo2 == shipment.ConsolidationNo2)
                .Where(s => shipment.Id == null ? true : (from c in db.Consolidations
                                                          where c.ShipmentId == s.Id && c.ConsolidationTypeId == consolidationType
                                                          select new { c.ShipmentId }).FirstOrDefault().ShipmentId == s.Id)
                .OrderBy(s => s.Id)
                .Skip(skip).Take(pageSize).AsNoTracking().ToArray();
            shipments = filteredShipments;
        }
    }

}