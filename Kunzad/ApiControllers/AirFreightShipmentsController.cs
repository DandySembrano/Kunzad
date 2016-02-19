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
using Kunzad.ActionFilters;

namespace Kunzad.ApiControllers
{
    [AuthorizationRequired]
    public class AirFreightShipmentsController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private Response response = new Response();
        // GET: api/AirFreightShipments
        public IQueryable<AirFreightShipment> GetAirFreightShipments()
        {
            return db.AirFreightShipments;
        }

        // GET: api/AirFreightShipments?wbno=xxx
        [ResponseType(typeof(AirFreightShipment))]
        public IHttpActionResult GetAirFreightShipment(string wbno)
        {
            response.status = "FAILURE";
            try
            {
                var airFreightShipment = db.AirFreightShipments
                                        .Include(afs => afs.Shipment)
                                        .Include(afs => afs.Shipment.Address.CityMunicipality.StateProvince)
                                        .Include(afs => afs.Shipment.Address1)
                                        .Include(afs => afs.Shipment.Address1.CityMunicipality.StateProvince)
                                        .Include(afs => afs.Shipment.BusinessUnit)
                                        .Include(afs => afs.Shipment.BusinessUnit1)
                                        .Include(afs => afs.Shipment.Service)
                                        .Include(afs => afs.Shipment.ShipmentType)
                                        .Include(afs => afs.Shipment.Customer)
                                        .Include(afs => afs.Shipment.Customer.CustomerAddresses)
                                        .Include(afs => afs.Shipment.Customer.CustomerAddresses.Select(ca => ca.CityMunicipality))
                                        .Include(afs => afs.Shipment.Customer.CustomerAddresses.Select(ca => ca.CityMunicipality.StateProvince))
                                        .Include(afs => afs.Shipment.Customer.CustomerContacts)
                                        .Include(afs => afs.Shipment.Customer.CustomerContacts.Select(cc => cc.Contact))
                                        .Include(afs => afs.Shipment.Customer.CustomerContacts.Select(cc => cc.Contact.ContactPhones))
                                        .Where(afs => afs.AirFreight.AirWaybillNumber.ToLower().Equals(wbno.ToLower()))
                                        .AsNoTracking().ToArray();
                
                if (airFreightShipment.Length == 0)
                    response.message = "Waybill number not found.";
                else
                {
                    response.intParam1 = db.AirFreights.Where(af => af.AirWaybillNumber == wbno).FirstOrDefault().Id;
                    CheckInShipment[] checkInShipments = new CheckInShipment[airFreightShipment.Length];
                    for (int i = 0; i < checkInShipments.Length; i++)
                    {
                        checkInShipments[i] = new CheckInShipment();
                        checkInShipments[i].ShipmentId = airFreightShipment[i].Shipment.Id;
                        checkInShipments[i].Shipment = airFreightShipment[i].Shipment;
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

        // GET: api/AirFreightShipments?airFreightId=1
        [ResponseType(typeof(AirFreightShipment))]
        public IHttpActionResult GetAirFreightShipment(int airFreightId)
        {
            response.status = "FAILURE";
            try
            {
                var airFreightShipment = db.AirFreightShipments
                                        .Include(afs => afs.Shipment)
                                        .Include(afs => afs.Shipment.Address.CityMunicipality.StateProvince)
                                        .Include(afs => afs.Shipment.Address1)
                                        .Include(afs => afs.Shipment.Address1.CityMunicipality.StateProvince)
                                        .Include(afs => afs.Shipment.BusinessUnit)
                                        .Include(afs => afs.Shipment.BusinessUnit1)
                                        .Include(afs => afs.Shipment.Service)
                                        .Include(afs => afs.Shipment.ShipmentType)
                                        .Include(afs => afs.Shipment.Customer)
                                        .Include(afs => afs.Shipment.Customer.CustomerAddresses)
                                        .Include(afs => afs.Shipment.Customer.CustomerAddresses.Select(ca => ca.CityMunicipality))
                                        .Include(afs => afs.Shipment.Customer.CustomerAddresses.Select(ca => ca.CityMunicipality.StateProvince))
                                        .Include(afs => afs.Shipment.Customer.CustomerContacts)
                                        .Include(afs => afs.Shipment.Customer.CustomerContacts.Select(cc => cc.Contact))
                                        .Include(afs => afs.Shipment.Customer.CustomerContacts.Select(cc => cc.Contact.ContactPhones))
                                        .Where(afs => afs.AirFreightId == airFreightId)
                                        .AsNoTracking().ToArray();

                if (airFreightShipment.Length == 0)
                    response.message = "Waybill number not found.";
                else
                {
                    CheckInShipment[] checkInShipments = new CheckInShipment[airFreightShipment.Length];
                    for (int i = 0; i < checkInShipments.Length; i++)
                    {
                        checkInShipments[i] = new CheckInShipment();
                        checkInShipments[i].ShipmentId = airFreightShipment[i].Shipment.Id;
                        checkInShipments[i].Shipment = airFreightShipment[i].Shipment;
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

        // PUT: api/AirFreightShipments/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutAirFreightShipment(int id, AirFreightShipment airFreightShipment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != airFreightShipment.Id)
            {
                return BadRequest();
            }

            db.Entry(airFreightShipment).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AirFreightShipmentExists(id))
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

        // POST: api/AirFreightShipments
        [ResponseType(typeof(AirFreightShipment))]
        public IHttpActionResult PostAirFreightShipment(AirFreightShipment airFreightShipment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.AirFreightShipments.Add(airFreightShipment);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = airFreightShipment.Id }, airFreightShipment);
        }

        // DELETE: api/AirFreightShipments/5
        [ResponseType(typeof(AirFreightShipment))]
        public IHttpActionResult DeleteAirFreightShipment(int id)
        {
            AirFreightShipment airFreightShipment = db.AirFreightShipments.Find(id);
            if (airFreightShipment == null)
            {
                return NotFound();
            }

            db.AirFreightShipments.Remove(airFreightShipment);
            db.SaveChanges();

            return Ok(airFreightShipment);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool AirFreightShipmentExists(int id)
        {
            return db.AirFreightShipments.Count(e => e.Id == id) > 0;
        }
    }
}