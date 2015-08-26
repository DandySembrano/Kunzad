﻿using System;
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

        // GET: api/Shipments
        public IQueryable<Shipment> GetShipments()
        {
            return db.Shipments;
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
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != shipment.Id)
            {
                return BadRequest();
            }

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

        // POST: api/Shipments
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

        // DELETE: api/Shipments/5
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