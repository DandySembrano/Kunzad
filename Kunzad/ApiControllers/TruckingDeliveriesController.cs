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
    public class TruckingDeliveriesController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private Response response = new Response();

        // GET: api/TruckingDeliveries
        [CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
        public IQueryable<TruckingDelivery> GetTruckingDeliveries()
        {
            return db.TruckingDeliveries;
        }

        // GET: api/TruckingDeliveries?truckingId=1&page=1
        [CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
        [ResponseType(typeof(TruckingDelivery))]
        public IHttpActionResult GetTruckingDeliveries(int length, int masterId)
        {
            var truckingDelivery = db.TruckingDeliveries
                                    .Include(td => td.Shipment)
                                    .Include(td => td.Shipment.Address.CityMunicipality.StateProvince)
                                    .Include(td => td.Shipment.Address1)
                                    .Include(td => td.Shipment.Address1.CityMunicipality.StateProvince)
                                    .Include(td => td.Shipment.BusinessUnit)
                                    .Include(td => td.Shipment.BusinessUnit1)
                                    .Include(td => td.Shipment.Service)
                                    .Include(td => td.Shipment.ShipmentType)
                                    .Include(td => td.Shipment.Customer)
                                    .Include(td => td.Shipment.Customer.CustomerAddresses)
                                    .Include(td => td.Shipment.Customer.CustomerAddresses.Select(ca => ca.CityMunicipality))
                                    .Include(td => td.Shipment.Customer.CustomerAddresses.Select(ca => ca.CityMunicipality.StateProvince))
                                    .Include(td => td.Shipment.Customer.CustomerContacts)
                                    .Include(td => td.Shipment.Customer.CustomerContacts.Select(cc => cc.Contact))
                                    .Include(td => td.Shipment.Customer.CustomerContacts.Select(cc => cc.Contact.ContactPhones))
                                    .Where(td => td.TruckingId == masterId)
                                    .OrderBy(td => td.Id)
                                    .Skip(length).Take(AppSettingsGet.PageSize)
                                    .AsNoTracking().ToArray();
            
            return Ok(truckingDelivery);
        }

        // GET: api/TruckingDeliveries/5
        [CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
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