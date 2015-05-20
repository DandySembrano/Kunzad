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
    public class ShipmentTypesController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private int pageSize = 20;

        // GET: api/ShipmentTypes
        public IQueryable<ShipmentType> GetShipmentTypes()
        {
            return db.ShipmentTypes;
        }

        // GET: api/ShipmentTypes?page=1
        public IQueryable<ShipmentType> GetShipmentTypes(int page)
        {
            if (page > 1)
            {
                return db.ShipmentTypes.OrderBy(c => c.Name).Skip((page - 1) * pageSize).Take(pageSize);
            }
            else
            {
                return db.ShipmentTypes.OrderBy(c => c.Name).Take(pageSize);
            }
        }

        // GET: api/ShipmentTypes/5
        [ResponseType(typeof(ShipmentType))]
        public IHttpActionResult GetShipmentType(int id)
        {
            ShipmentType shipmentType = db.ShipmentTypes.Find(id);
            if (shipmentType == null)
            {
                return NotFound();
            }

            return Ok(shipmentType);
        }

        // PUT: api/ShipmentTypes/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutShipmentType(int id, ShipmentType shipmentType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != shipmentType.Id)
            {
                return BadRequest();
            }

            db.Entry(shipmentType).State = EntityState.Modified;

            try
            {
                shipmentType.LastUpdatedDate = DateTime.Now;
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ShipmentTypeExists(id))
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

        // POST: api/ShipmentTypes
        [ResponseType(typeof(ShipmentType))]
        public IHttpActionResult PostShipmentType(ShipmentType shipmentType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            shipmentType.CreatedDate = DateTime.Now;
            db.ShipmentTypes.Add(shipmentType);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = shipmentType.Id }, shipmentType);
        }

        // DELETE: api/ShipmentTypes/5
        [ResponseType(typeof(ShipmentType))]
        public IHttpActionResult DeleteShipmentType(int id)
        {
            ShipmentType shipmentType = db.ShipmentTypes.Find(id);
            if (shipmentType == null)
            {
                return NotFound();
            }

            db.ShipmentTypes.Remove(shipmentType);
            db.SaveChanges();

            return Ok(shipmentType);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ShipmentTypeExists(int id)
        {
            return db.ShipmentTypes.Count(e => e.Id == id) > 0;
        }
    }
}