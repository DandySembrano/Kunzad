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
    public class VesselsController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();

        // GET: api/Vessels
        public IQueryable<Vessel> GetVessels()
        {
            return db.Vessels;
        }

        // GET: api/Vessels?shippingLineId=1
        public IHttpActionResult GetVessels(int shippingLineId)
        {
            var vessels = db.Vessels.Where(v => v.ShippingLineId == shippingLineId).ToArray();
            if (vessels.Length == 0)
                return Ok();
            return Ok(vessels);
        }

        // GET: api/Vessels/5
        [ResponseType(typeof(Vessel))]
        public IHttpActionResult GetVessel(int id)
        {
            Vessel vessel = db.Vessels.Find(id);
            if (vessel == null)
            {
                return NotFound();
            }

            return Ok(vessel);
        }

        // PUT: api/Vessels/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutVessel(int id, Vessel vessel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != vessel.Id)
            {
                return BadRequest();
            }

            db.Entry(vessel).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VesselExists(id))
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

        // POST: api/Vessels
        [ResponseType(typeof(Vessel))]
        public IHttpActionResult PostVessel(Vessel vessel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Vessels.Add(vessel);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = vessel.Id }, vessel);
        }

        // DELETE: api/Vessels/5
        [ResponseType(typeof(Vessel))]
        public IHttpActionResult DeleteVessel(int id)
        {
            Vessel vessel = db.Vessels.Find(id);
            if (vessel == null)
            {
                return NotFound();
            }

            db.Vessels.Remove(vessel);
            db.SaveChanges();

            return Ok(vessel);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool VesselExists(int id)
        {
            return db.Vessels.Count(e => e.Id == id) > 0;
        }
    }
}