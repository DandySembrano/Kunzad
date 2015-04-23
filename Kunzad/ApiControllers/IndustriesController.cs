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
    public class IndustriesController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();

        // GET: api/Industries
        public IQueryable<Industry> GetIndustries()
        {
            return db.Industries;
        }

        // GET: api/Industries/5
        [ResponseType(typeof(Industry))]
        public IHttpActionResult GetIndustry(int id)
        {
            Industry industry = db.Industries.Find(id);
            if (industry == null)
            {
                return NotFound();
            }

            return Ok(industry);
        }

        // PUT: api/Industries/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutIndustry(int id, Industry industry)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != industry.Id)
            {
                return BadRequest();
            }

            db.Entry(industry).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IndustryExists(id))
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

        // POST: api/Industries
        [ResponseType(typeof(Industry))]
        public IHttpActionResult PostIndustry(Industry industry)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Industries.Add(industry);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = industry.Id }, industry);
        }

        // DELETE: api/Industries/5
        [ResponseType(typeof(Industry))]
        public IHttpActionResult DeleteIndustry(int id)
        {
            Industry industry = db.Industries.Find(id);
            if (industry == null)
            {
                return NotFound();
            }

            db.Industries.Remove(industry);
            db.SaveChanges();

            return Ok(industry);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool IndustryExists(int id)
        {
            return db.Industries.Count(e => e.Id == id) > 0;
        }
    }
}