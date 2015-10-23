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
    public class DocumentationController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();

        // GET: api/Documentation
        public IQueryable<Shipment> GetShipments()
        {
            return db.Shipments;
        }

        // GET: api/Documentation/5
        [ResponseType(typeof(Shipment))]
        public IHttpActionResult GetShipment(int id)
        {
            //Shipment shipment = db.Shipments.Find(id);
            //db.Entry(shipment).Collection(c => c.TruckingDeliveries).Load();
            //
            //if (shipment == null)
            //{
            //    return NotFound();
            //}
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
            //if (!ModelState.IsValid)
            //{
            //    return BadRequest(ModelState);
            //}

            if (id != shipment.Id)
            {
                return BadRequest();
            }

            //foreach (Trucking t in shipment.TruckingDeliveries)
            //{
            //    db.Entry(t.tru).State = EntityState.Modified;
            //}

            db.Entry(shipment).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ShipmentExists(id))
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