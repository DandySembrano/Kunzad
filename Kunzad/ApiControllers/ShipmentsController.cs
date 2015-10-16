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
    //[AutoInvalidateCacheOutput]
    public class ShipmentsController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private Response response = new Response();
        private int pageSize = 20;
        // GET: api/Shipments
        public IQueryable<Shipment> GetShipments()
        {
            var shipment = db.Shipments
                            .Include(s => s.BusinessUnit)
                            .Include(s => s.Service)
                            .Include(s => s.ShipmentType)
                            .Include(s => s.Customer)
                            .Include(s => s.Customer.CustomerAddresses)
                            .Include(s => s.Customer.CustomerAddresses.Select(ca => ca.CityMunicipality))
                            .Include(s => s.Customer.CustomerContacts)
                            .Include(s => s.Customer.CustomerContacts.Select(cc => cc.Contact))
                            .Include(s => s.Customer.CustomerContacts.Select(cc => cc.Contact.ContactPhones));
            foreach (var s in shipment)
            {
                s.BusinessUnit.AirFreights = null;
                s.BusinessUnit.AirFreights1 = null;
                s.BusinessUnit.BusinessUnitContacts = null;
                s.BusinessUnit.BusinessUnitType = null;
                s.BusinessUnit.CourierTransactions = null;
                s.BusinessUnit.SeaFreights = null;
                s.BusinessUnit.SeaFreights1 = null;
                s.BusinessUnit.Shipments = null;
                s.Service.ServiceCategory = null;
                s.Service.ServiceCharges = null;
                s.Service.Shipments = null;
                s.ShipmentType.Shipments = null;
                s.Customer.CustomerGroup = null;
                s.Customer.Industry = null;
                s.Customer.Shipments = null;
                s.Customer.TruckingDeliveries = null;

                s.Customer.CustomerContacts = s.Customer.CustomerContacts.Where(cc => cc.Id == s.CustomerContactId).ToArray();
                foreach (var cc in s.Customer.CustomerContacts)
                {
                    cc.Customer = null;
                    cc.Contact.BusinessUnitContacts = null;
                    cc.Contact.CustomerContacts = null;
                    cc.Contact.ContactPhones = cc.Contact.ContactPhones.Where(ccp => ccp.Id == s.CustomerContactPhoneId).ToArray();
                    foreach (var ccp in cc.Contact.ContactPhones)
                    {
                        ccp.Contact = null;
                        ccp.ContactNumberType = null;
                    }
                }

                s.Customer.CustomerAddresses = s.Customer.CustomerAddresses.Where(ca => ca.Id == s.CustomerAddressId).ToArray();
                foreach (var ca in s.Customer.CustomerAddresses)
                {
                    ca.CityMunicipality.Couriers = null;
                    ca.CityMunicipality.CustomerAddresses = null;
                    ca.CityMunicipality.ServiceableAreas = null;
                    ca.CityMunicipality.StateProvince = null;
                }
            }
            return shipment;
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

        [HttpGet]
        public IHttpActionResult GetShipment(string type, string source, int param1, [FromUri]List<Shipment> shipment)
        {
            //Filtering for shipments that will be displayd in Sea Freight, Air Freight and Courier Delivery Module
            Shipment[] shipments = new Shipment[pageSize];
            int serviceCategoryId;
            if(source.ToLower().Equals("air"))
                serviceCategoryId = 1;
            else if(source.ToLower().Equals("sea"))
                serviceCategoryId = 7;
            else //courier
                serviceCategoryId = 6;

            this.filterRecord(param1, type, shipment.ElementAt(0), shipment.ElementAt(1), serviceCategoryId, ref shipments);

            if (shipments != null)
                return Ok(shipments);
            else
                return Ok();
        }

        // GET: api/Shipments?page=1
        [ResponseType(typeof(Shipment))]
        public IHttpActionResult GetShipments(int page)
        {
            int skip;
            if (page > 1)
                skip = (page - 1) * pageSize;
            else
                skip = 0;

            var shipment = db.Shipments
                            .Include(s => s.Address)
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
                            .Include(s => s.Customer.CustomerContacts)
                            .Include(s => s.Customer.CustomerContacts.Select(cc => cc.Contact))
                            .Include(s => s.Customer.CustomerContacts.Select(cc => cc.Contact.ContactPhones))
                            .OrderByDescending(s => s.CreatedDate)
                            .Skip(skip).Take(pageSize).ToArray();

            if (shipment.Length == 0)
                return Ok(shipment);
            for (int i = 0; i < shipment.Length; i++)
            {   
                shipment[i].Address.Shipments = null;
                shipment[i].Address.Shipments1 = null;
                shipment[i].Address.CityMunicipality.Addresses = null;
                shipment[i].Address.CityMunicipality.CustomerAddresses = null;
                shipment[i].Address.CityMunicipality.Addresses = null;
                shipment[i].Address.CityMunicipality.ServiceableAreas = null;
                shipment[i].Address.CityMunicipality.Truckers = null;
                shipment[i].Address.CityMunicipality.StateProvince.CityMunicipalities = null;
                shipment[i].Address1.Shipments = null;
                shipment[i].Address1.Shipments1 = null;
                shipment[i].Address1.CityMunicipality.Addresses = null;
                shipment[i].Address1.CityMunicipality.CustomerAddresses = null;
                shipment[i].Address1.CityMunicipality.Addresses = null;
                shipment[i].Address1.CityMunicipality.ServiceableAreas = null;
                shipment[i].Address1.CityMunicipality.Truckers = null;
                shipment[i].Address1.CityMunicipality.StateProvince.CityMunicipalities = null;
                shipment[i].BusinessUnit.AirFreights = null;
                shipment[i].BusinessUnit.AirFreights1 = null;
                shipment[i].BusinessUnit.BusinessUnitContacts = null;
                shipment[i].BusinessUnit.BusinessUnitType = null;
                shipment[i].BusinessUnit.CourierTransactions = null;
                shipment[i].BusinessUnit.SeaFreights = null;
                shipment[i].BusinessUnit.SeaFreights1 = null;
                shipment[i].BusinessUnit.Shipments = null;
                shipment[i].BusinessUnit1.AirFreights = null;
                shipment[i].BusinessUnit1.AirFreights1 = null;
                shipment[i].BusinessUnit1.BusinessUnitContacts = null;
                shipment[i].BusinessUnit1.BusinessUnitType = null;
                shipment[i].BusinessUnit1.CourierTransactions = null;
                shipment[i].BusinessUnit1.SeaFreights = null;
                shipment[i].BusinessUnit1.SeaFreights1 = null;
                shipment[i].BusinessUnit1.Shipments = null;
                shipment[i].Service.ServiceCategory = null;
                shipment[i].Service.ServiceCharges = null;
                shipment[i].Service.Shipments = null;
                shipment[i].ShipmentType.Shipments = null;
                shipment[i].Customer.CustomerGroup = null;
                shipment[i].Customer.Industry = null;
                shipment[i].Customer.Shipments = null;
                shipment[i].Customer.TruckingDeliveries = null;

                shipment[i].Customer.CustomerContacts = shipment[i].Customer.CustomerContacts.Where(cc => cc.Id == shipment[i].CustomerContactId).ToArray();
                foreach (var cc in shipment[i].Customer.CustomerContacts)
                {
                    cc.Customer = null;
                    cc.Contact.BusinessUnitContacts = null;
                    cc.Contact.CustomerContacts = null;
                    cc.Contact.ContactPhones = cc.Contact.ContactPhones.Where(ccp => ccp.Id == shipment[i].CustomerContactPhoneId).ToArray();
                    foreach (var ccp in cc.Contact.ContactPhones)
                    {
                        ccp.Contact = null;
                        ccp.ContactNumberType = null;
                    }
                }

                shipment[i].Customer.CustomerAddresses = shipment[i].Customer.CustomerAddresses.Where(ca => ca.Id == shipment[i].CustomerAddressId).ToArray();
                foreach (var ca in shipment[i].Customer.CustomerAddresses)
                {
                    ca.CityMunicipality.Couriers = null;
                    ca.CityMunicipality.CustomerAddresses = null;
                    ca.CityMunicipality.ServiceableAreas = null;
                    ca.CityMunicipality.StateProvince = null;
                }

            }
            return Ok(shipment);
        }

        // GET: api/Shipments/5
        [ResponseType(typeof(Shipment))]
        public IHttpActionResult GetShipment(int id)
        {
            Shipment shipment = db.Shipments.Find(id);
            db.Entry(shipment).Reference(c => c.BusinessUnit).Load();
            db.Entry(shipment).Reference(c => c.Customer).Load();
            db.Entry(shipment).Reference(c => c.Service).Load();
            db.Entry(shipment).Reference(c => c.ShipmentType).Load();
            db.Entry(shipment).Collection(c => c.SeaFreightShipments).Load();
            if (shipment == null)
            {
                return NotFound();
            }

            return Ok(shipment);
        }

        // PUT: api/Shipments/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutShipment(int id, Shipment shipment)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid || id != shipment.Id)
            {
                response.message = "Bad request.";
                return Ok(response);
            }

            db.Entry(shipment).State = EntityState.Modified;
            db.Entry(shipment.Address).State = EntityState.Modified;
            db.Entry(shipment.Address1).State = EntityState.Modified;
            try
            {
                
                shipment.LastUpdatedDate = DateTime.Now;
                shipment.Address.LastUpdatedDate = DateTime.Now;
                shipment.Address1.LastUpdatedDate = DateTime.Now;
                db.SaveChanges();
                response.status = "SUCCESS";
                response.objParam1 = shipment;
            }
            catch (Exception e)
            {
                if (!ShipmentExists(id))
                {
                    response.message = "Shipment doesn't exist.";
                }
                else
                {
                    response.message = e.InnerException.InnerException.Message.ToString();
                }
            }

            return Ok(response);
        }

        // POST: api/Shipments
        [ResponseType(typeof(Shipment))]
        public IHttpActionResult PostShipment(Shipment shipment)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad request.";
                return Ok(response);
            }
            try
            {
                //for (int i = 0; i < 100; i++)
                //{
                    shipment.CreatedDate = DateTime.Now;
                    shipment.Address.CreatedDate = DateTime.Now;
                    shipment.Address1.CreatedDate = DateTime.Now;
                    shipment.TransportStatusId = (int)Status.TransportStatus.Open;
                    shipment.TransportStatusRemarks = "For pickup from customer";

                    db.Addresses.Add(shipment.Address);
                    db.Addresses.Add(shipment.Address1);
                    db.Shipments.Add(shipment);
                    db.SaveChanges();
                //}
                response.status = "SUCCESS";
                response.objParam1 = shipment;
            }
            catch (Exception e)
            {
                response.message = e.InnerException.InnerException.Message.ToString();
            }

            return Ok(response);
        }

        // DELETE: api/Shipments/5
        [ResponseType(typeof(Shipment))]
        public IHttpActionResult DeleteShipment(int id)
        {
            Shipment shipment = db.Shipments.Find(id);
            Shipment shipmentEdited = db.Shipments.Find(id);

            shipmentEdited.TransportStatusId = (int)Status.TransportStatus.Cancel;
            response.status = "FAILURE";
            if (shipment == null)
            {
                response.message = "Shipment doesn't exist.";
                return Ok(response);
            }
            try
            {
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
        }

        public void filterRecord(int param1, string type, Shipment shipment, Shipment shipment1, int serviceCategoryId, ref Shipment[] shipments)
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
                .Where(s => s.LastCheckInId == null ? true : (from ci in db.CheckIns where ci.Id == s.LastCheckInId select new { ci.CheckInBusinessUnitId }).FirstOrDefault().CheckInBusinessUnitId == s.BusinessUnitId)
                .Where(s => s.Service.ServiceCategoryId == serviceCategoryId)
                .Where(s => s.TransportStatusId != (int)Status.TransportStatus.Cancel && s.TransportStatusId != (int)Status.TransportStatus.Close)
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
                .Skip(skip).Take(pageSize).AsQueryable().AsNoTracking().ToArray();
            shipments = filteredShipments;
        }
    }
}