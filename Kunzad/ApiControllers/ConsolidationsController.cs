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
using WebAPI.OutputCache;

namespace Kunzad.ApiControllers
{
    public class ConsolidationsController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private DbContextTransaction transaction;
        private Response response = new Response();
        private int pageSize = AppSettingsGet.PageSize;
        private int serviceCategoryId = 0;
        private int x = 0;
        private int[] shipmentType = { 1, 2, 6 }; //changeable
        private Boolean isConsolidated = false;
        private Boolean parent = true;
        private Boolean vanstuff = false;

        // GET: api/Consolidations
        [CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
        public IQueryable<Shipment> GetShipments()
        {
            return db.Shipments;
        }

        // GET: /api/Consolidations?firstShipmentId=1&newShipmentId=1
        [CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
        public IHttpActionResult GetShipment(int firstShipmentId, string newShipmentId)
        {
            Shipment[] shipment = new Shipment[0];
            int newId = Convert.ToInt32(newShipmentId);

            //first shipment's info in detail
            var firstShipment = db.Shipments
                                .Include(shipmentChild => shipmentChild.Service)
                                .Where(shipmentChild => shipmentChild.Id == firstShipmentId).FirstOrDefault();

            serviceCategoryId = this.getFirstShipmentInfo(firstShipment.Id, firstShipment.ServiceId);

            //for new shipment to be added in detail
            var newShipment = db.Shipments
                              .Include(s => s.Service)
                              .Where(s => s.Id == newId).AsNoTracking().ToArray();

            shipment = newShipment;

            if (this.checkShipment(shipment[0], "batch"))
                response.status = "SUCCESS";
            else
                response.status = "FAILURE";

            return Ok(response);
        }

        //  GET: api/Consolidations?parentShipmentId=1&page=1
        [CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
        public IHttpActionResult GetShipment(int parentShipmentId, int page) 
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
                .Include(v => v.Service.ServiceCategory)
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

        //for batching
        [HttpGet]
        //[CacheOutput(ClientTimeSpan = 6, ServerTimeSpan = 6)]
        [CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
        public IHttpActionResult GetShipment(string type, int param1, [FromUri]List<Shipment> shipment)
        {
            Shipment[] shipments = new Shipment[pageSize];

            this.filterRecord(param1, type, shipment.ElementAt(0), shipment.ElementAt(1), ref shipments);

            if (shipments != null)
                return Ok(shipments);
            else
                return Ok();
        }

        //for vanstuffing
        [HttpGet]
        [CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
        public IHttpActionResult GetShipment(string type, string source, int param1, [FromUri]List<Shipment> shipment)
        {
            Shipment[] shipments = new Shipment[pageSize];

            if (source.ToLower().Equals("sea"))
                serviceCategoryId = 7;

            this.filterRecord(param1, type, shipment.ElementAt(0), shipment.ElementAt(1), serviceCategoryId, ref shipments);

            if (shipments != null)
                return Ok(shipments);
            else
                return Ok();
        }

        //for master list
        [HttpGet]
        [CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
        //[CacheOutput(ClientTimeSpan = 6, ServerTimeSpan = 6)]
        public IHttpActionResult GetShipment(string type, int consolidationType, int param1, [FromUri]List<Shipment> shipment)
        {
            Shipment[] shipments = new Shipment[pageSize];

            this.filterRecord(param1, type, consolidationType, shipment.ElementAt(0), shipment.ElementAt(1), ref shipments);

            if (shipments != null)
                return Ok(shipments);
            else
                return Ok();
        }

        // PUT: api/Consolidations/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutShipment(int id, List<Shipment> shipment)
        {
            parent = true;
            vanstuff = false;
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
                transaction = db.Database.BeginTransaction();

                Consolidation consolidation = new Consolidation();
                foreach (Shipment s in shipment)
                {
                    if (parent == true)
                    {
                        s.LastUpdatedDate = DateTime.Now;

                        var shipmentCurrentHolder = db.Shipments.Find(s.Id);

                        db.Entry(shipmentCurrentHolder).CurrentValues.SetValues(s);
                        db.Entry(shipmentCurrentHolder).State = EntityState.Modified;

                        db.SaveChanges();

                        //assign parent shipmentId
                        parentShipmentId = s.Id;

                        //vanstuff
                        if (s.ConsolidationNo2 != null)
                            vanstuff = true;

                        parent = false;
                    }
                    else
                    {
                        var currentConsolidationDetails = db.Shipments.Where(currentDetails => currentDetails.ParentShipmentId == parentShipmentId);

                        foreach (Shipment s1 in currentConsolidationDetails)
                        {
                            flag = false;

                            if (s.Id == s1.Id)
                            {
                                flag = true;
                                break;
                            }
                        }
                        if (!flag)
                        {
                            var shipmentHolder = db.Shipments.Find(s.Id);

                            if (shipmentHolder.IsConsolidation == true)
                                isConsolidated = true;
                            else
                                s.IsConsolidation = true;

                            s.ParentShipmentId = parentShipmentId;

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
                        }

                        foreach (Shipment s2 in currentConsolidationDetails)
                        {
                            var shipmentCurrentHolder = db.Shipments.Find(s2.Id);

                            if (s2.Id != s.Id)
                            {
                                //Shipment that is removed in Consolidation Detail
                                var shipmentInConsolidationToBeRemoved = db.Consolidations.Where(c => c.ShipmentId == s2.Id && c.ParentShipmentId == s2.ParentShipmentId);
                                foreach (Consolidation shipmentConsolidation in shipmentInConsolidationToBeRemoved)
                                {
                                    db.Consolidations.Remove(shipmentConsolidation);
                                }

                                s2.ParentShipmentId = 0;
                                s2.IsConsolidation = false;
                                var shipmentToBeRemovedInConsolidationHolder = db.Shipments.Find(s2.Id);

                                db.Entry(shipmentCurrentHolder).CurrentValues.SetValues(shipmentToBeRemovedInConsolidationHolder);
                                db.Entry(shipmentCurrentHolder).State = EntityState.Modified;
                            }
                        }

                        db.SaveChanges();
                    }
                }

                transaction.Commit();

                response.status = "SUCCESS";
                response.objParam1 = shipment;
            }
            catch (System.Data.Entity.Validation.DbEntityValidationException dbEx)
            {
                transaction.Rollback();
                Exception raise = dbEx;
                foreach (var validationErrors in dbEx.EntityValidationErrors)
                {
                    foreach (var validationError in validationErrors.ValidationErrors)
                    {
                        string message = string.Format("{0}:{1}",
                            validationErrors.Entry.Entity.ToString(),
                            validationError.ErrorMessage);
                        // raise a new exception nesting
                        // the current instance as InnerException
                        raise = new InvalidOperationException(message, raise);
                    }
                }
                throw raise;
            }
            //catch (Exception e)
            //{
            //    response.message = e.InnerException.InnerException.Message.ToString();
            //}

            return Ok(response);
        }

        // POST: api/Consolidations
        [ResponseType(typeof(Shipment))]
        public IHttpActionResult PostShipment(List<Shipment> shipment)
        {
            parent = true;
            vanstuff = true;

            int parentShipmentId = 0;

            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad request.";
                return Ok(response);
            }
            try
            {
                transaction = db.Database.BeginTransaction();

                Consolidation consolidation = new Consolidation();
                foreach (Shipment s in shipment)
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
                        if (s.ConsolidationNo2 != null)
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
                        var shipmentHolder = db.Shipments.Find(s.Id);

                        if (shipmentHolder.IsConsolidation == true)
                            isConsolidated = true;
                        else
                            s.IsConsolidation = true;

                        s.ParentShipmentId = parentShipmentId;

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

                transaction.Commit();

                response.status = "SUCCESS";
                response.objParam1 = shipment;
            }
            catch (Exception e)
            {
                response.message = e.InnerException.InnerException.Message.ToString();
                transaction.Rollback();
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

        // DELETE: api/Consolidations/5
        [ResponseType(typeof(Shipment))]
        public IHttpActionResult DeleteShipment(int id)
        {
            Shipment shipment = db.Shipments.Find(id);
            Shipment shipmentEdited = db.Shipments.Find(id);

            response.status = "FAILURE";
            if (shipment == null)
            {
                response.message = "Shipment doesn't exist.";
                return Ok(response);
            }
            try
            {
                var currentShipmentsInConsolidationDetail = db.Shipments.Where(s => s.ParentShipmentId == id);
                //Shipments in consolidation detail
                foreach (Shipment s in currentShipmentsInConsolidationDetail)
                {
                    var currentConsolidationDetail = db.Consolidations.Where(c => c.ShipmentId == s.Id && c.ParentShipmentId == id);
                    foreach (Consolidation c in currentConsolidationDetail)
                    {
                        db.Consolidations.Remove(c);
                    }
                    /*check if the boolean isConsolidated is still false.
                    * isConsolidated is true when the shipment in added in the consolidation detail
                    * is also a master shipment(consolidation master data)
                    */
                    if (!isConsolidated)
                    {
                        s.IsConsolidation = false;
                    }

                    s.ParentShipmentId = 0;

                    Shipment shipmentDetailHolder = db.Shipments.Find(s.Id);

                    db.Entry(shipmentDetailHolder).CurrentValues.SetValues(s);
                    db.Entry(shipmentDetailHolder).State = EntityState.Modified;
                }

                //Master Shipment
                var currentConsolidationMaster = db.Consolidations.Where(c => c.ShipmentId == id);
                foreach (Consolidation c in currentConsolidationMaster)
                {
                    db.Consolidations.Remove(c);
                }

                shipmentEdited.TransportStatusId = (int)Status.TransportStatus.Cancel;
                shipmentEdited.TransportStatusRemarks = "This Shipment(Consolidation) is cancelled.";

                db.Entry(shipment).CurrentValues.SetValues(shipmentEdited);
                db.Entry(shipment).State = EntityState.Modified;

                db.SaveChanges();

                response.status = "SUCCESS";
                response.objParam1 = shipmentEdited;
            }
            catch (Exception e)
            {
                response.message = e.InnerException.InnerException.Message.ToString();
            }

            return Ok(response);
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

        //for batching
        public void filterRecord(int param1, string type, Shipment shipment, Shipment shipment1, ref Shipment[] shipments)
        {

            /*
             * If date is not nullable in table equate to "1/1/0001 12:00:00 AM" else null
             * If integer value is not nullable in table equate to 0 else null
             * Use modified date if filtered data type is date
             */
            DateTime defaultDate = new DateTime(0001, 01, 01, 00, 00, 00);
            TimeSpan defaultTime = new TimeSpan(23, 00, 00);
            int skip;

            if (type.Equals("paginate"))
            {
                if (param1 > 1)
                    skip = (param1 - 1) * AppSettingsGet.PageSize;
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
                .Include(s => s.Service.ServiceCategory)
                .Include(s => s.ShipmentType)
                .Include(s => s.Customer)
                .Include(s => s.Customer.CustomerAddresses)
                .Include(s => s.Customer.CustomerAddresses.Select(ca => ca.CityMunicipality))
                .Include(s => s.Customer.CustomerAddresses.Select(ca => ca.CityMunicipality.StateProvince))
                .Include(s => s.Customer.CustomerContacts)
                .Include(s => s.Customer.CustomerContacts.Select(cc => cc.Contact))
                .Include(s => s.Customer.CustomerContacts.Select(cc => cc.Contact.ContactPhones))
                .Where(s => s.ParentShipmentId == null || s.ParentShipmentId == 0)
                .Where(s => s.LastCheckInId == null ? true : (from ci in db.CheckIns where ci.Id == s.LastCheckInId select new { ci.CheckInBusinessUnitId }).FirstOrDefault().CheckInBusinessUnitId == s.BusinessUnitId)
                .Where(s => s.LoadingStatusId == (int)Status.LoadingStatus.Open)
                .Where(s => s.TransportStatusId != (int)Status.TransportStatus.Cancel && s.TransportStatusId != (int)Status.TransportStatus.Close)
                .Where(s => !shipmentType.Contains(s.ShipmentTypeId))
                .Where(s => shipment.Id == null || shipment.Id == 0 ? true : s.Id == shipment.Id)
                .Where(s => shipment.CreatedDate == null || shipment.CreatedDate == defaultDate ? true : s.CreatedDate >= shipment.CreatedDate && s.CreatedDate <= shipment1.CreatedDate)
                .Where(s => shipment.PickupDate == null || shipment.PickupDate == defaultDate ? true : s.PickupDate >= shipment.PickupDate && s.PickupDate <= shipment1.PickupDate)
                .Where(s => shipment.BusinessUnitId == null || shipment.BusinessUnitId == 0 ? true : s.BusinessUnitId == shipment.BusinessUnitId)
                .Where(s => shipment.CustomerId == null || shipment.CustomerId == 0 ? true : s.CustomerId == shipment.CustomerId)
                .Where(s => shipment.ServiceId == null || shipment.ServiceId == 0 ? true : s.ServiceId == shipment.ServiceId)
                .Where(s => shipment.ShipmentTypeId == null || shipment.ShipmentTypeId == 0 ? true : s.ShipmentTypeId == shipment.ShipmentTypeId)
                .Where(s => shipment.PickUpBussinessUnitId == null || shipment.PickUpBussinessUnitId == 0 ? true : s.PickUpBussinessUnitId == shipment.PickUpBussinessUnitId)
                .Where(s => shipment.PaymentMode == null ? true : s.PaymentMode.Equals(shipment.PaymentMode) == true)
                .OrderBy(s => s.Id)
                .Skip(skip).Take(AppSettingsGet.PageSize).AsNoTracking().ToArray();
            shipments = filteredShipments;
        }

        //for vanstuffing
        public void filterRecord(int param1, string type, Shipment shipment, Shipment shipment1, int serviceCategoryId, ref Shipment[] shipments)
        {

            Shipment[] shipmentArrTemp = new Shipment[0];
            Shipment[] shipmentArrFinal = new Shipment[0];
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
                .Include(s => s.Service.ServiceCategory)
                .Include(s => s.ShipmentType)
                .Include(s => s.Customer)
                .Include(s => s.Customer.CustomerAddresses)
                .Include(s => s.Customer.CustomerAddresses.Select(ca => ca.CityMunicipality))
                .Include(s => s.Customer.CustomerAddresses.Select(ca => ca.CityMunicipality.StateProvince))
                .Include(s => s.Customer.CustomerContacts)
                .Include(s => s.Customer.CustomerContacts.Select(cc => cc.Contact))
                .Include(s => s.Customer.CustomerContacts.Select(cc => cc.Contact.ContactPhones))
                .Where(s => s.ParentShipmentId == null || s.ParentShipmentId == 0)
                .Where(s => s.LastCheckInId == null ? true : (from ci in db.CheckIns where ci.Id == s.LastCheckInId select new { ci.CheckInBusinessUnitId }).FirstOrDefault().CheckInBusinessUnitId == s.BusinessUnitId)
                .Where(s => s.LoadingStatusId == (int)Status.LoadingStatus.Open)
                .Where(s => s.TransportStatusId != (int)Status.TransportStatus.Cancel && s.TransportStatusId != (int)Status.TransportStatus.Close)
                .Where(s => shipmentType.Contains(s.ShipmentTypeId))
                .Where(s => shipment.Id == null || shipment.Id == 0 ? true : s.Id == shipment.Id)
                .Where(s => shipment.CreatedDate == null || shipment.CreatedDate == defaultDate ? true : s.CreatedDate >= shipment.CreatedDate && s.CreatedDate <= shipment1.CreatedDate)
                .Where(s => shipment.PickupDate == null || shipment.PickupDate == defaultDate ? true : s.PickupDate >= shipment.PickupDate && s.PickupDate <= shipment1.PickupDate)
                .Where(s => shipment.BusinessUnitId == null || shipment.BusinessUnitId == 0 ? true : s.BusinessUnitId == shipment.BusinessUnitId)
                .Where(s => shipment.CustomerId == null || shipment.CustomerId == 0 ? true : s.CustomerId == shipment.CustomerId)
                .Where(s => shipment.ServiceId == null || shipment.ServiceId == 0 ? true : s.ServiceId == shipment.ServiceId)
                .Where(s => shipment.ShipmentTypeId == null || shipment.ShipmentTypeId == 0 ? true : s.ShipmentTypeId == shipment.ShipmentTypeId)
                .Where(s => shipment.PickUpBussinessUnitId == null || shipment.PickUpBussinessUnitId == 0 ? true : s.PickUpBussinessUnitId == shipment.PickUpBussinessUnitId)
                .Where(s => shipment.PaymentMode == null ? true : s.PaymentMode.Equals(shipment.PaymentMode) == true)
                .OrderBy(s => s.Id)
                .Skip(skip).Take(AppSettingsGet.PageSize).AsQueryable().AsNoTracking().ToArray();

            shipmentArrTemp = filteredShipments;

            for (var i = 0; i < shipmentArrTemp.Length; i++)
            {
                if (this.checkShipment(shipmentArrTemp[i], "vanstuff"))
                {
                    shipmentArrFinal = new Shipment[x + 1];
                    shipmentArrFinal[x] = shipmentArrTemp[i];
                    x++;
                }
            }


            shipments = shipmentArrFinal;
        }

        //for master list
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
                .Include(s => s.Service.ServiceCategory)
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
                                                          where c.ShipmentId == s.Id && c.ParentShipmentId == 0 && c.ConsolidationTypeId == consolidationType
                                                          select new { c.ShipmentId }).FirstOrDefault().ShipmentId == s.Id)
                .OrderBy(s => s.Id)
                .Skip(skip).Take(pageSize).AsNoTracking().ToArray();
            shipments = filteredShipments;
        }

        //this will check the validity of the shipments to be displayed and or be choosed return true/false
        public bool checkShipment(Shipment shipment, String dummy)
        {
            bool check = true;
            if (shipment.Service.ServiceCategoryId == serviceCategoryId)
                check = true;
            else if (shipment.ServiceId == 9)//Consolidation
            {
                var shipmentChildHolder = db.Shipments.Include(shipmentChild => shipmentChild.Service).Where(shipmentChild => shipmentChild.ParentShipmentId == shipment.Id);
                foreach (Shipment sChild in shipmentChildHolder)
                {
                    if (sChild.ServiceId == 9)//Consolidation
                        return this.checkShipment(sChild, "xXx");
                    else if (sChild.Service.ServiceCategoryId == serviceCategoryId)
                        continue;
                    else
                        check = false;
                }
            }
            else
                check = false;

            return check;
        }

        //this will get and check if the shipment is consolidated then return the serviceCategory Id
        public int getFirstShipmentInfo(int shipmentId, int serviceId)
        {
            int serviceCatId = 0;
            var service = db.Services.Find(serviceId);

            serviceCatId = service.ServiceCategoryId;

            if (serviceId == 9)//Consolidation
            {
                var shipmentChildHolder = db.Shipments
                                          .Include(shipmentChild => shipmentChild.Service)
                                          .Where(shipmentChild => shipmentChild.ParentShipmentId == shipmentId).FirstOrDefault();

                if (shipmentChildHolder.ServiceId == 9)
                    return this.getFirstShipmentInfo(shipmentChildHolder.Id, shipmentChildHolder.ServiceId);
                else
                    serviceCatId = shipmentChildHolder.Service.ServiceCategoryId;
            }

            return serviceCatId;

        }
    }

}