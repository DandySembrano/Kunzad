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
    public class AirFreightsController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private Response response = new Response();
        private int pageSize = AppSettingsGet.PageSize;

        // GET: api/AirFreights
        public IQueryable<AirFreight> GetAirFreights()
        {
            return db.AirFreights
                .Include(a => a.AirLine)
                .Include(a => a.BusinessUnit1)
                .Include(a => a.BusinessUnit)
                .Include(a => a.AirFreightShipments).AsNoTracking();
        }

        [HttpGet]
        //[CacheOutput(ClientTimeSpan = 6, ServerTimeSpan = 6)]
        public IHttpActionResult GetAirFreight(string type, int param1, [FromUri]List<AirFreight> pAirFreight)
        {
            //AirFreight[] airfreight = new AirFreight[pageSize];

            ////this.filterRecord(param1, type, pAirFreight.ElementAt(0), pAirFreight.ElementAt(1), ref airfreight);
            //if (airfreight != null)
            //    return Ok(airfreight);
            //else
            //    return Ok();

            /*
                             return db.Customers
                    .Include(c => c.CustomerGroup)
                    .Include(c => c.Industry)
                    .Include(c => c.CustomerAddresses.Select(e => e.CityMunicipality.StateProvince.Country))
                    .Include(c => c.CustomerContacts.Select(d => d.Contact.ContactPhones))
                    .OrderBy(c => c.Name).Take(AppSettingsGet.PageSize).AsNoTracking();
             */

            return Ok(db.AirFreights
                .Include(a => a.AirLine)
                .Include(a => a.BusinessUnit1)
                .Include(a => a.BusinessUnit)
                .Include(a => a.AirFreightShipments.Select(e => e.Shipment.Customer)).AsNoTracking());
        }

        // GET: api/AirFreights/5
        [ResponseType(typeof(AirFreight))]
        public IHttpActionResult GetAirFreight(int id)
        {
            AirFreight airFreight = db.AirFreights.Find(id);
            if (airFreight == null)
            {
                return NotFound();
            }

            return Ok(airFreight);
        }

        // PUT: api/AirFreights/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutAirFreight(int id, AirFreight pAairFreight)
        {
            try
            {
                bool bolFound = false;
                var currentAirShipmentDtl = (from objAirFreight in db.AirFreightShipments where objAirFreight.AirFreightId == pAairFreight.Id select objAirFreight);

                //remove airFreightShipment
                foreach (AirFreightShipment aShipmentOnDb in currentAirShipmentDtl)
                {
                    bolFound = false;
                    foreach (AirFreightShipment airShipmentOnParam in pAairFreight.AirFreightShipments)
                    {
                        if (airShipmentOnParam.Id == aShipmentOnDb.Id)
                        {
                            bolFound = true;
                            break;
                        }
                        if (!bolFound)
                        {
                            db.AirFreightShipments.Remove(aShipmentOnDb);
                        }
                    }
                }

                //add update
                foreach (AirFreightShipment airShipmentOnParam in pAairFreight.AirFreightShipments)
                {
                    bolFound = false;
                    foreach (AirFreightShipment aShipmentOnDb in currentAirShipmentDtl)
                    {
                        if (airShipmentOnParam.Id == aShipmentOnDb.Id)
                        {
                            var airShip = db.AirFreightShipments.Find(airShipmentOnParam.Id);
                            db.Entry(airShip).CurrentValues.SetValues(airShipmentOnParam);
                            db.Entry(airShip).State = EntityState.Modified;
                            bolFound = true;
                            break;
                        }
                    }
                    if (bolFound == false)
                    {
                        airShipmentOnParam.AirFreightId = id;
                        db.AirFreightShipments.Add(airShipmentOnParam);
                    }
                }

                var airFreightMaster = db.AirFreights.Find(id);
                db.Entry(airFreightMaster).State = EntityState.Modified;
                db.Entry(airFreightMaster).CurrentValues.SetValues(pAairFreight);
                db.SaveChanges();

                return CreatedAtRoute("DefaultApi", new { id = pAairFreight.Id }, pAairFreight);

            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AirFreightExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", ex.Message);
            }
            return BadRequest(ModelState);
        }

        // POST: api/AirFreights
        [ResponseType(typeof(AirFreight))]
        public IHttpActionResult PostAirFreight(AirFreight pAirFreight)
        {
            response.status = "FAILURE";
            try
            {
                foreach (AirFreightShipment objAirShipmentDtl in pAirFreight.AirFreightShipments)
                {
                    objAirShipmentDtl.CreatedDate = DateTime.Now;
                    objAirShipmentDtl.AirFreightId = pAirFreight.Id;
                    db.AirFreightShipments.Add(objAirShipmentDtl);
                }
                pAirFreight.CreatedDate = DateTime.Now;
                db.AirFreights.Add(pAirFreight);
                db.SaveChanges();
                response.status = "SUCCESS";

                response.objParam1 = pAirFreight;
            }
            catch (Exception e)
            {
                response.message = e.InnerException.InnerException.Message.ToString();
            }
            return Ok(response);
            //return CreatedAtRoute("DefaultApi", new { id = airFreight.Id }, airFreight);
        }

        // DELETE: api/AirFreights/5
        [ResponseType(typeof(AirFreight))]
        public IHttpActionResult DeleteAirFreight(int id)
        {
            AirFreight airFreight = db.AirFreights.Find(id);
            if (airFreight == null)
            {
                return NotFound();
            }

            db.AirFreights.Remove(airFreight);
            db.SaveChanges();

            return Ok(airFreight);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool AirFreightExists(int id)
        {
            return db.AirFreights.Count(e => e.Id == id) > 0;
        }

        public void filterRecord(int param1, string type, AirFreight pAirFreight, AirFreight airFreight1, ref AirFreight[] pAirFreights)
        {
            /*If date is not nullable in table equate to "1/1/0001 12:00:00 AM" else null
            if integer value is not nullable in table equate to 0 else null*/
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


            var filteredAirFreights = db.AirFreights
                         .Include(a => a.AirLine)
                         .Include(a => a.BusinessUnit1)
                         .Include(a => a.BusinessUnit)
                         .Include(a => a.AirFreightShipments)
                         .Where(a => pAirFreight.Id == null || pAirFreight.Id == 0 ? true : a.Id == pAirFreight.Id)
                //.Where(a => pAirFreight.AirLineId == null || pAirFreight.AirLineId == 0 ? true : a.AirLineId == pAirFreight.AirLineId)
                //.Where(a => pAirFreight.AirWaybillNumber == null || pAirFreight.AirWaybillNumber == null ? true : a.AirWaybillNumber == pAirFreight.AirWaybillNumber)
                          .OrderBy(a => a.Id)
                         .Skip(skip).Take(pageSize).AsNoTracking().ToArray();

            pAirFreights = filteredAirFreights;


            /*
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
                .Where(s => shipment.CreatedDate == null || shipment.CreatedDate == defaultDate ? true : s.CreatedDate >= shipment.CreatedDate && s.CreatedDate <= shipment1.CreatedDate)
                .Where(s => shipment.PickupDate == null || shipment.PickupDate == defaultDate ? true : s.PickupDate >= shipment.PickupDate && s.PickupDate <= shipment1.PickupDate)
                .Where(s => shipment.BusinessUnitId == null || shipment.BusinessUnitId == 0 ? true : s.BusinessUnitId == shipment.BusinessUnitId)
                .Where(s => shipment.CustomerId == null || shipment.CustomerId == 0 ? true : s.CustomerId == shipment.CustomerId)
                .Where(s => shipment.ServiceId == null || shipment.ServiceId == 0 ? true : s.ServiceId == shipment.ServiceId)
                .Where(s => shipment.ShipmentTypeId == null || shipment.ShipmentTypeId == 0 ? true : s.ShipmentTypeId == shipment.ShipmentTypeId)
                .Where(s => shipment.PickUpBussinessUnitId == null || shipment.PickUpBussinessUnitId == 0 ? true : s.PickUpBussinessUnitId == shipment.PickUpBussinessUnitId)
                .Where(s => shipment.TransportStatusId == null || shipment.TransportStatusId == 0 ? true : s.TransportStatusId == shipment.TransportStatusId)
                .Where(s => shipment.PaymentMode == null ? true : s.PaymentMode.Equals(shipment.PaymentMode) == true)
                .OrderBy(s => s.Id)
                .Skip(skip).Take(pageSize).AsNoTracking().ToArray();
            shipments = filteredShipments;
             */
        }

        public void filterRecord(int param1, string type, AirFreight airfreight, AirFreight shipment1, int serviceCategoryId, ref AirFreight[] airfreights)
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

            //var filteredShipments = db.Shipments
            //    .Include(s => s.Address.CityMunicipality.StateProvince)
            //    .Include(s => s.Address1)
            //    .Include(s => s.Address1.CityMunicipality.StateProvince)
            //    .Include(s => s.BusinessUnit)
            //    .Include(s => s.BusinessUnit1)
            //    .Include(s => s.Service)
            //    .Include(s => s.ShipmentType)
            //    .Include(s => s.Customer)
            //    .Include(s => s.Customer.CustomerAddresses)
            //    .Include(s => s.Customer.CustomerAddresses.Select(ca => ca.CityMunicipality))
            //    .Include(s => s.Customer.CustomerAddresses.Select(ca => ca.CityMunicipality.StateProvince))
            //    .Include(s => s.Customer.CustomerContacts)
            //    .Include(s => s.Customer.CustomerContacts.Select(cc => cc.Contact))
            //    .Include(s => s.Customer.CustomerContacts.Select(cc => cc.Contact.ContactPhones))
            //    .Where(s => s.LastCheckInId == null ? true : (from ci in db.CheckIns where ci.Id == s.LastCheckInId select new { ci.CheckInBusinessUnitId }).FirstOrDefault().CheckInBusinessUnitId == s.BusinessUnitId)
            //    .Where(s => s.Service.ServiceCategoryId == serviceCategoryId)
            //    .Where(s => s.LoadingStatusId == (int)Status.LoadingStatus.Open)
            //    .Where(s => s.TransportStatusId != (int)Status.TransportStatus.Cancel && s.TransportStatusId != (int)Status.TransportStatus.Close)
            //    .Where(s => shipment.Id == null || shipment.Id == 0 ? true : s.Id == shipment.Id)
            //    .Where(s => shipment.CreatedDate == null || shipment.CreatedDate == defaultDate ? true : s.CreatedDate >= shipment.CreatedDate && s.CreatedDate <= shipment1.CreatedDate)
            //    .Where(s => shipment.PickupDate == null || shipment.PickupDate == defaultDate ? true : s.PickupDate >= shipment.PickupDate && s.PickupDate <= shipment1.PickupDate)
            //    .Where(s => shipment.BusinessUnitId == null || shipment.BusinessUnitId == 0 ? true : s.BusinessUnitId == shipment.BusinessUnitId)
            //    .Where(s => shipment.CustomerId == null || shipment.CustomerId == 0 ? true : s.CustomerId == shipment.CustomerId)
            //    .Where(s => shipment.ServiceId == null || shipment.ServiceId == 0 ? true : s.ServiceId == shipment.ServiceId)
            //    .Where(s => shipment.ShipmentTypeId == null || shipment.ShipmentTypeId == 0 ? true : s.ShipmentTypeId == shipment.ShipmentTypeId)
            //    .Where(s => shipment.PickUpBussinessUnitId == null || shipment.PickUpBussinessUnitId == 0 ? true : s.PickUpBussinessUnitId == shipment.PickUpBussinessUnitId)
            //    .Where(s => shipment.TransportStatusId == null || shipment.TransportStatusId == 0 ? true : s.TransportStatusId == shipment.TransportStatusId)
            //    .Where(s => shipment.PaymentMode == null ? true : s.PaymentMode.Equals(shipment.PaymentMode) == true)
            //    .OrderBy(s => s.Id)
            //    .Skip(skip).Take(pageSize).AsQueryable().AsNoTracking().ToArray();
            //shipments = filteredShipments;
        }
    }
}