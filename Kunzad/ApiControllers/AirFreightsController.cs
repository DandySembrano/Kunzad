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
    public class AirFreightsController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();

        // GET: api/AirFreights
        public IQueryable<AirFreight> GetAirFreights()
        {
            return db.AirFreights;
        }

        // GET: api/AirFreights/5
        [ResponseType(typeof(AirFreight))]
        public IHttpActionResult GetAirFreight(int id)
        {
            AirFreight airFreight = db.AirFreights.Find(id);
            if (airFreight == null)
            {
                return NotFound();
            }

            return Ok(airFreight);
        }

        // PUT: api/AirFreights/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutAirFreight(int id, AirFreight airFreight)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != airFreight.Id)
            {
                return BadRequest();
            }

            db.Entry(airFreight).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AirFreightExists(id))
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

        // POST: api/AirFreights
        [ResponseType(typeof(AirFreight))]
        public IHttpActionResult PostAirFreight(AirFreight airFreight)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.AirFreights.Add(airFreight);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = airFreight.Id }, airFreight);
        }

        // DELETE: api/AirFreights/5
        [ResponseType(typeof(AirFreight))]
        public IHttpActionResult DeleteAirFreight(int id)
        {
            AirFreight airFreight = db.AirFreights.Find(id);
            if (airFreight == null)
            {
                return NotFound();
            }

            db.AirFreights.Remove(airFreight);
            db.SaveChanges();

            return Ok(airFreight);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool AirFreightExists(int id)
        {
            return db.AirFreights.Count(e => e.Id == id) > 0;
        }
    }
}