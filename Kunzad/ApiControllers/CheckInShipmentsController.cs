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
    [AutoInvalidateCacheOutput]
    public class CheckInShipmentsController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private Response response = new Response();
        // GET: api/CheckInShipments
        public IQueryable<CheckInShipment> GetCheckInShipments()
        {
            return db.CheckInShipments;
        }

        // GET: api/CheckInShipments?length=0&masterId=1
        [CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
        [ResponseType(typeof(CheckInShipment))]
        public IHttpActionResult GetCheckInShipment(int length, int masterId)
        {
            response.status = "FAILURE";
            try
            {
                var checkInShipments = db.CheckInShipments
                       .Include(cis => cis.Shipment)
                       .Include(cis => cis.Shipment.Address.CityMunicipality.StateProvince)
                       .Include(cis => cis.Shipment.Address1)
                       .Include(cis => cis.Shipment.Address1.CityMunicipality.StateProvince)
                       .Include(cis => cis.Shipment.BusinessUnit)
                       .Include(cis => cis.Shipment.BusinessUnit1)
                       .Include(cis => cis.Shipment.Service)
                       .Include(cis => cis.Shipment.ShipmentType)
                       .Include(cis => cis.Shipment.Customer)
                       .Include(cis => cis.Shipment.Customer.CustomerAddresses)
                       .Include(cis => cis.Shipment.Customer.CustomerAddresses.Select(ca => ca.CityMunicipality))
                       .Include(cis => cis.Shipment.Customer.CustomerAddresses.Select(ca => ca.CityMunicipality.StateProvince))
                       .Include(cis => cis.Shipment.Customer.CustomerContacts)
                       .Include(cis => cis.Shipment.Customer.CustomerContacts.Select(cc => cc.Contact))
                       .Include(cis => cis.Shipment.Customer.CustomerContacts.Select(cc => cc.Contact.ContactPhones))
                       .Where(cis => cis.CheckInId == masterId)
                       .Where(cis => cis.IsDisplay == true)
                       .OrderBy(cis => cis.Id)
                       .Skip(length).Take(AppSettingsGet.PageSize)
                       .AsNoTracking().ToArray();
                var checkInMaster = db.CheckIns.Find(masterId);
                switch (checkInMaster.CheckInTypeId)
                {
                    case 1: //Sea freight Loading
                        var getSeaFreight = db.SeaFreights.Where(sf => sf.Id == (from ci in db.CheckIns where ci.Id == masterId select ci).FirstOrDefault().CheckInSourceId).FirstOrDefault();
                        response.stringParam1 = getSeaFreight.BLNumber;
                        break;
                    case 2:
                        var getAirFreight = db.AirFreights.Where(sf => sf.Id == (from ci in db.CheckIns where ci.Id == masterId select ci).FirstOrDefault().CheckInSourceId).FirstOrDefault();
                        response.stringParam1 = getAirFreight.AirWaybillNumber;
                        break;                      
                    default: break;
                }

                
                response.status = "SUCCESS";
                response.objParam1 = checkInShipments;
            }
            catch (Exception e)
            {
                response.message = e.InnerException.InnerException.Message.ToString();
            }
           
            return Ok(response);
        }

        // PUT: api/CheckInShipments/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutCheckInShipment(int id, CheckInShipment checkInShipment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != checkInShipment.Id)
            {
                return BadRequest();
            }

            db.Entry(checkInShipment).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CheckInShipmentExists(id))
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

        // POST: api/CheckInShipments
        [ResponseType(typeof(CheckInShipment))]
        public IHttpActionResult PostCheckInShipment(CheckInShipment checkInShipment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.CheckInShipments.Add(checkInShipment);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = checkInShipment.Id }, checkInShipment);
        }

        // DELETE: api/CheckInShipments/5
        [ResponseType(typeof(CheckInShipment))]
        public IHttpActionResult DeleteCheckInShipment(int id)
        {
            CheckInShipment checkInShipment = db.CheckInShipments.Find(id);
            if (checkInShipment == null)
            {
                return NotFound();
            }

            db.CheckInShipments.Remove(checkInShipment);
            db.SaveChanges();

            return Ok(checkInShipment);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CheckInShipmentExists(int id)
        {
            return db.CheckInShipments.Count(e => e.Id == id) > 0;
        }
    }
}