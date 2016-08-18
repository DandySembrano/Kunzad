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
using Kunzad.ActionFilters;
namespace Kunzad.ApiControllers
{
    [AuthorizationRequired]
    public class DocumentationController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private Response response = new Response();
        // GET: api/Documentation
        [CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
        public IQueryable<Shipment> GetShipments()
        {
            return db.Shipments;
        }

        // GET: api/Documentation/5
        [CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
        [ResponseType(typeof(Shipment))]
        public IHttpActionResult GetShipment(int id)
        {
            var shipment = (from t in db.Truckings
                            select new
                            {
                                t.Id,
                                TruckingDeliveries = (from td in db.TruckingDeliveries
                                                      where t.Id == td.TruckingId
                                                      select new
                                                      {
                                                          Shipments = (from s in db.Shipments
                                                                      where s.Id == id
                                                                      select new { 
                                                                        s.Id,
                                                                        s.IsRevenue,
                                                                        s.Revenue,
                                                                        s.IsTaxInclusive,
                                                                        s.TaxAmount,
                                                                        s.TaxPercentage
                                                                      })
                                                      }),
                                t.InternalRevenue

                            });

            return Ok(shipment);
        }

        // PUT: api/Documentation/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutShipment(int id, Shipment shipment)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid || id != shipment.Id)
            {
                response.message = "Bad request.";
                return Ok(response);
            }

            try
            {
                //set revenue to TRUE if revenue amount is inputted
                if (shipment.Revenue > 0)
                {
                    shipment.IsRevenue = true;
                }

                //set tax inclusive to TRUE if tax amount is inputted
                if (shipment.TaxAmount > 0)
                {
                    shipment.IsTaxInclusive = true;
                }

                db.Entry(shipment).State = EntityState.Modified;
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

        // POST: api/Documentation
        [ResponseType(typeof(Shipment))]
        public IHttpActionResult PostShipment(Shipment shipment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Shipments.Add(shipment);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = shipment.Id }, shipment);
        }

        // DELETE: api/Documentation/5
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
    }
}