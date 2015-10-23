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
    public class VanStuffController : ApiController
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
        public IHttpActionResult GetShipment(string type, int param1, [FromUri]List<Shipment> shipment)
        {
            Shipment[] shipments = new Shipment[pageSize];
            this.filterRecord(param1, type, shipment.ElementAt(0), shipment.ElementAt(1), ref shipments);

            if (shipments != null)
                return Ok(shipments);
            else
                return Ok();
        }

        // PUT: api/VanStuff/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutShipment(int id, Shipment shipment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != shipment.Id)
            {
                return BadRequest();
            }

            db.Entry(shipment).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ShipmentExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/VanStuff
        [ResponseType(typeof(Shipment))]
        public IHttpActionResult PostShipment(List<Shipment> shipment)
        {
            Boolean parent = true;
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

                        //db.Addresses.Add(s.Address);
                        //db.Addresses.Add(s.Address1);

                        db.Shipments.Add(s);

                        db.SaveChanges();

                        //assign parent shipmentId
                        parentShipmentId = s.Id;

                        if (parentShipmentId != 0)
                        {
                            //consolidate master       
                            consolidation.ShipmentId = parentShipmentId;
                            consolidation.ParentShipmentId = 0;
                            consolidation.ConsolidationTypeId = 20;


                            db.Consolidations.Add(consolidation);

                            db.SaveChanges();
                        }

                        parent = false;
                    }
                    else
                    {
                        s.ParentShipmentId = parentShipmentId;

                        var shipmentHolder = db.Shipments.Find(s.Id);
                        db.Entry(shipmentHolder).CurrentValues.SetValues(s);
                        db.Entry(shipmentHolder).State = EntityState.Modified;

                        //consolidate detail
                        consolidation.ShipmentId = s.Id;
                        consolidation.ParentShipmentId = parentShipmentId; // s1.ParentShipmentId;
                        consolidation.ConsolidationTypeId = 20;

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

        public void filterRecord(int param1, string type, Shipment shipment, Shipment shipment1, ref Shipment[] shipments)
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
                .Where(s => shipment.Id == null ? true : (from c in db.Consolidations where c.ShipmentId == s.Id select new { c.ShipmentId }).FirstOrDefault().ShipmentId == s.Id)
                .Where(s => shipment.ShipmentTypeId == null || shipment.ShipmentTypeId == 0 ? true : s.ShipmentTypeId == shipment.ShipmentTypeId)
                .Where(s => shipment.BusinessUnitId == null || shipment.BusinessUnitId == 0 ? true : s.BusinessUnitId == shipment.BusinessUnitId)
                .Where(s => shipment.ConsolidationNo1 == null || shipment.ConsolidationNo1 == 0 ? true : s.ConsolidationNo1 == shipment.ConsolidationNo1)
                .Where(s => shipment.ConsolidationNo2 == null || shipment.ConsolidationNo2 == 0 ? true : s.ConsolidationNo2 == shipment.ConsolidationNo2)
                .OrderBy(s => s.Id)
                .Skip(skip).Take(pageSize).AsNoTracking().ToArray();
            shipments = filteredShipments;
        }
    }

}