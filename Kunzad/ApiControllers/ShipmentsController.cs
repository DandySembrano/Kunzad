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

        // GET: api/Shipments?page=1
        [ResponseType(typeof(Shipment))]
        public IHttpActionResult GetShipments(int page)
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
                            .Include(s => s.Customer.CustomerContacts.Select(cc => cc.Contact.ContactPhones))
                            .ToArray();
            if (shipment.Length == 0)
                return Ok(shipment);
            for (int i = 0; i < shipment.Length; i++)
            {

                shipment[i].BusinessUnit.AirFreights = null;
                shipment[i].BusinessUnit.AirFreights1 = null;
                shipment[i].BusinessUnit.BusinessUnitContacts = null;
                shipment[i].BusinessUnit.BusinessUnitType = null;
                shipment[i].BusinessUnit.CourierTransactions = null;
                shipment[i].BusinessUnit.SeaFreights = null;
                shipment[i].BusinessUnit.SeaFreights1 = null;
                shipment[i].BusinessUnit.Shipments = null;
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
                if (page > 1)
                    return Ok(shipment.Skip((page - 1) * pageSize).Take(pageSize));
                else
                    return Ok(shipment.Take(pageSize));
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

            try
            {
                shipment.OriginAddressId = shipment.CustomerAddressId;
                shipment.DeliveryAddressId = 1;
                shipment.LastUpdatedDate = DateTime.Now;
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
                shipment.OriginAddressId = shipment.CustomerAddressId;
                shipment.DeliveryAddressId = 1;
                shipment.CreatedDate = DateTime.Now;
                db.Shipments.Add(shipment);
                db.SaveChanges();
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
            response.status = "FAILURE";
            if (shipment == null)
            {
                response.message = "Shipment doesn't exist.";
                return Ok(response);
            }
            try
            {
                db.Shipments.Remove(shipment);
                db.SaveChanges();
                response.status = "SUCCESS";
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
    }
}