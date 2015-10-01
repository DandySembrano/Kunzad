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
    public class TruckingDeliveriesController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private Response response = new Response();

        // GET: api/TruckingDeliveries
        public IQueryable<TruckingDelivery> GetTruckingDeliveries()
        {
            return db.TruckingDeliveries;
        }

        // GET: api/TruckingDeliveries?truckingId=1&page=1
        [ResponseType(typeof(TruckingDelivery))]
        public IHttpActionResult GetTruckingDeliveries(int truckingId, int page)
        {
            var truckingDelivery = db.TruckingDeliveries
                                    .Include(td => td.Address)
                                    .Include(td => td.Address.CityMunicipality.StateProvince)
                                    .Include(td => td.Trucking)
                                    .Include(td => td.Shipment)
                                    .Include(td => td.Shipment.BusinessUnit)
                                    .Include(td => td.Shipment.Service)
                                    .Include(td => td.Shipment.ShipmentType)
                                    .Include(td => td.Customer)
                                    .Include(td => td.Customer.CustomerAddresses.Select(ca => ca.CityMunicipality))
                                    .Include(td => td.Customer.CustomerContacts)
                                    .Include(td => td.Customer.CustomerContacts.Select(cc => cc.Contact))
                                    .Include(td => td.Customer.CustomerContacts.Select(cc => cc.Contact.ContactPhones))
                                    .Where(td => td.TruckingId == truckingId)
                                    .ToArray();
            for (int i = 0; i < truckingDelivery.Length; i++)
            {
                truckingDelivery[i].Address.Shipments = null;
                truckingDelivery[i].Address.Shipments1 = null;
                truckingDelivery[i].Address.CityMunicipality.Addresses = null;
                truckingDelivery[i].Address.CityMunicipality.CustomerAddresses = null;
                truckingDelivery[i].Address.CityMunicipality.Addresses = null;
                truckingDelivery[i].Address.CityMunicipality.ServiceableAreas = null;
                truckingDelivery[i].Address.CityMunicipality.Truckers = null;
                truckingDelivery[i].Address.CityMunicipality.StateProvince.CityMunicipalities = null;
                truckingDelivery[i].Shipment.BusinessUnit.AirFreights = null;
                truckingDelivery[i].Shipment.BusinessUnit.AirFreights1 = null;
                truckingDelivery[i].Shipment.BusinessUnit.BusinessUnitContacts = null;
                truckingDelivery[i].Shipment.BusinessUnit.BusinessUnitType = null;
                truckingDelivery[i].Shipment.BusinessUnit.CourierTransactions = null;
                truckingDelivery[i].Shipment.BusinessUnit.SeaFreights = null;
                truckingDelivery[i].Shipment.BusinessUnit.SeaFreights1 = null;
                truckingDelivery[i].Shipment.BusinessUnit.Shipments = null;
                truckingDelivery[i].Shipment.Service.ServiceCategory = null;
                truckingDelivery[i].Shipment.Service.ServiceCharges = null;
                truckingDelivery[i].Shipment.Service.Shipments = null;
                truckingDelivery[i].Shipment.ShipmentType.Shipments = null;
                truckingDelivery[i].Customer.CustomerGroup = null;
                truckingDelivery[i].Customer.Industry = null;
                truckingDelivery[i].Customer.Shipments = null;
                truckingDelivery[i].Customer.TruckingDeliveries = null;

                truckingDelivery[i].Customer.CustomerContacts = truckingDelivery[i].Customer.CustomerContacts.Where(cc => cc.Id == truckingDelivery[i].Shipment.CustomerContactId).ToArray();
                foreach (var cc in truckingDelivery[i].Customer.CustomerContacts)
                {
                    cc.Customer = null;
                    cc.Contact.BusinessUnitContacts = null;
                    cc.Contact.CustomerContacts = null;
                    cc.Contact.ContactPhones = cc.Contact.ContactPhones.Where(ccp => ccp.Id == truckingDelivery[i].Shipment.CustomerContactPhoneId).ToArray();
                    foreach (var ccp in cc.Contact.ContactPhones)
                    {
                        ccp.Contact = null;
                        ccp.ContactNumberType = null;
                    }
                }

                truckingDelivery[i].Customer.CustomerAddresses = truckingDelivery[i].Customer.CustomerAddresses.Where(ca => ca.Id == truckingDelivery[i].Shipment.CustomerAddressId).ToArray();
                

                foreach (var ca in truckingDelivery[i].Customer.CustomerAddresses)
                {
                    ca.CityMunicipality.Couriers = null;
                    ca.CityMunicipality.CustomerAddresses = null;
                    ca.CityMunicipality.ServiceableAreas = null;
                    ca.CityMunicipality.StateProvince = null;
                }

            }
            
            return Ok(truckingDelivery);
        }

        // GET: api/TruckingDeliveries/5
        [ResponseType(typeof(TruckingDelivery))]
        public IHttpActionResult GetTruckingDelivery(int id)
        {
            TruckingDelivery truckingDelivery = db.TruckingDeliveries.Find(id);
            if (truckingDelivery == null)
            {
                return NotFound();
            }

            return Ok(truckingDelivery);
        }

        // PUT: api/TruckingDeliveries/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutTruckingDelivery(int id, TruckingDelivery truckingDelivery)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != truckingDelivery.Id)
            {
                return BadRequest();
            }

            db.Entry(truckingDelivery).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TruckingDeliveryExists(id))
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

        // POST: api/TruckingDeliveries
        [ResponseType(typeof(TruckingDelivery))]
        public IHttpActionResult PostTruckingDelivery(TruckingDelivery truckingDelivery)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.TruckingDeliveries.Add(truckingDelivery);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = truckingDelivery.Id }, truckingDelivery);
        }

        // DELETE: api/TruckingDeliveries/5
        [ResponseType(typeof(TruckingDelivery))]
        public IHttpActionResult DeleteTruckingDelivery(int id)
        {
            TruckingDelivery truckingDelivery = db.TruckingDeliveries.Find(id);
            if (truckingDelivery == null)
            {
                return NotFound();
            }

            db.TruckingDeliveries.Remove(truckingDelivery);
            db.SaveChanges();

            return Ok(truckingDelivery);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TruckingDeliveryExists(int id)
        {
            return db.TruckingDeliveries.Count(e => e.Id == id) > 0;
        }
    }
}