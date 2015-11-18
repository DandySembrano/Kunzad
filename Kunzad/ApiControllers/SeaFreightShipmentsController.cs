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
    public class SeaFreightShipmentsController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private Response response = new Response();
        private int pageSize = (int)AppSettingsGet.PageSize;

        // GET: api/SeaFreightShipments
        public IQueryable<SeaFreightShipment> GetSeaFreightShipments()
        {
            return db.SeaFreightShipments;
        }

        // GET: api/SeaFreightShipments?seaFreightId=1&page=1
        public IHttpActionResult GetSeaFreightShipments(int seaFreightId,int page)
        {
            int skip;
            if (page > 1)
                skip = (page - 1) * pageSize;
            else
                skip = 0;

            var seaFreightShipment = db.SeaFreightShipments
                      .Include(sfs => sfs.Shipment)
                      .Include(sfs => sfs.Shipment.Address)
                      .Include(sfs => sfs.Shipment.Address.CityMunicipality.StateProvince)
                      .Include(sfs => sfs.Shipment.Address1)
                      .Include(sfs => sfs.Shipment.Address1.CityMunicipality.StateProvince)
                      .Include(sfs => sfs.Shipment.BusinessUnit)
                      .Include(sfs => sfs.Shipment.BusinessUnit1)
                      .Include(sfs => sfs.Shipment.Service)
                      .Include(sfs => sfs.Shipment.ShipmentType)
                      .Include(sfs => sfs.Shipment.Customer)
                      .Include(sfs => sfs.Shipment.Customer.CustomerAddresses)
                      .Include(sfs => sfs.Shipment.Customer.CustomerAddresses.Select(ca => ca.CityMunicipality))
                      .Include(sfs => sfs.Shipment.Customer.CustomerAddresses.Select(ca => ca.CityMunicipality.StateProvince))
                      .Include(sfs => sfs.Shipment.Customer.CustomerContacts)
                      .Include(sfs => sfs.Shipment.Customer.CustomerContacts.Select(cc => cc.Contact))
                      .Include(sfs => sfs.Shipment.Customer.CustomerContacts.Select(cc => cc.Contact.ContactPhones))
                      .Where(sfs => sfs.SeaFreightId == seaFreightId)
                      .OrderBy(sfs => sfs.Id)
                      .Skip(skip).Take(pageSize)
                      .AsNoTracking().ToArray();
            return Ok(seaFreightShipment);
        }

        // GET: api/SeaFreightShipments?blno=xxxx
        [ResponseType(typeof(SeaFreightShipment))]
        public IHttpActionResult GetSeaFreightShipment(string blno)
        {
            response.status = "FAILURE";
            try
            {
                var seaFreightShipment = db.SeaFreightShipments
                                        .Include(sfs => sfs.Shipment)
                                        .Include(sfs => sfs.Shipment.Address.CityMunicipality.StateProvince)
                                        .Include(sfs => sfs.Shipment.Address1)
                                        .Include(sfs => sfs.Shipment.Address1.CityMunicipality.StateProvince)
                                        .Include(sfs => sfs.Shipment.BusinessUnit)
                                        .Include(sfs => sfs.Shipment.BusinessUnit1)
                                        .Include(sfs => sfs.Shipment.Service)
                                        .Include(sfs => sfs.Shipment.ShipmentType)
                                        .Include(sfs => sfs.Shipment.Customer)
                                        .Include(sfs => sfs.Shipment.Customer.CustomerAddresses)
                                        .Include(sfs => sfs.Shipment.Customer.CustomerAddresses.Select(ca => ca.CityMunicipality))
                                        .Include(sfs => sfs.Shipment.Customer.CustomerAddresses.Select(ca => ca.CityMunicipality.StateProvince))
                                        .Include(sfs => sfs.Shipment.Customer.CustomerContacts)
                                        .Include(sfs => sfs.Shipment.Customer.CustomerContacts.Select(cc => cc.Contact))
                                        .Include(sfs => sfs.Shipment.Customer.CustomerContacts.Select(cc => cc.Contact.ContactPhones))
                                        .Where(sfs => sfs.SeaFreight.BLNumber.ToLower().Equals(blno.ToLower()))
                                        .AsNoTracking().ToArray();
                if(seaFreightShipment.Length == 0)
                    response.message = "BL number not found.";
                else
                {
                    CheckInShipment[] checkInShipments = new CheckInShipment[seaFreightShipment.Length];
                    for (int i = 0; i < checkInShipments.Length; i++)
                    {
                        checkInShipments[i] = new CheckInShipment();
                        checkInShipments[i].ShipmentId = seaFreightShipment[i].Shipment.Id;
                        checkInShipments[i].Shipment = seaFreightShipment[i].Shipment;
                    }
                    response.status = "SUCCESS";
                    response.objParam1 = checkInShipments;
                }
            }
            catch (Exception e) 
            {
                response.message = e.InnerException.InnerException.Message.ToString();
            }
            return Ok(response);
        }

        // PUT: api/SeaFreightShipments/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutSeaFreightShipment(int id, SeaFreightShipment seaFreightShipment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != seaFreightShipment.Id)
            {
                return BadRequest();
            }

            db.Entry(seaFreightShipment).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SeaFreightShipmentExists(id))
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

        // POST: api/SeaFreightShipments
        [ResponseType(typeof(SeaFreightShipment))]
        public IHttpActionResult PostSeaFreightShipment(SeaFreightShipment seaFreightShipment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.SeaFreightShipments.Add(seaFreightShipment);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = seaFreightShipment.Id }, seaFreightShipment);
        }

        // DELETE: api/SeaFreightShipments/5
        [ResponseType(typeof(SeaFreightShipment))]
        public IHttpActionResult DeleteSeaFreightShipment(int id)
        {
            SeaFreightShipment seaFreightShipment = db.SeaFreightShipments.Find(id);
            if (seaFreightShipment == null)
            {
                return NotFound();
            }

            db.SeaFreightShipments.Remove(seaFreightShipment);
            db.SaveChanges();

            return Ok(seaFreightShipment);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SeaFreightShipmentExists(int id)
        {
            return db.SeaFreightShipments.Count(e => e.Id == id) > 0;
        }
    }
}