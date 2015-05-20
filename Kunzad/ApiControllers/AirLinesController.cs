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
    public class AirLinesController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private int pageSize = 20;

        // GET: api/AirLines
        public IQueryable<AirLine> GetAirLines()
        {
            return db.AirLines;
        }

        // GET: api/AirLines?page=1
        public IQueryable<AirLine> GetAirLines(int page)
        {
            if (page > 1)
            {
                return db.AirLines.OrderBy(c => c.Name).Skip((page - 1) * pageSize).Take(pageSize);
            }
            else
            {
                return db.AirLines.OrderBy(c => c.Name).Take(pageSize);
            }
        }

        // GET: api/AirLines/5
        [ResponseType(typeof(AirLine))]
        public IHttpActionResult GetAirLine(int id)
        {
            AirLine airLine = db.AirLines.Find(id);
            if (airLine == null)
            {
                return NotFound();
            }

            return Ok(airLine);
        }

        // PUT: api/AirLines/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutAirLine(int id, AirLine airLine)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != airLine.Id)
            {
                return BadRequest();
            }

            db.Entry(airLine).State = EntityState.Modified;

            try
            {
                airLine.LastUpdatedDate = DateTime.Now;
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AirLineExists(id))
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

        // POST: api/AirLines
        [ResponseType(typeof(AirLine))]
        public IHttpActionResult PostAirLine(AirLine airLine)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            airLine.CreatedDate =  DateTime.Now;
            db.AirLines.Add(airLine);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = airLine.Id }, airLine);
        }

        // DELETE: api/AirLines/5
        [ResponseType(typeof(AirLine))]
        public IHttpActionResult DeleteAirLine(int id)
        {
            AirLine airLine = db.AirLines.Find(id);
            if (airLine == null)
            {
                return NotFound();
            }

            db.AirLines.Remove(airLine);
            db.SaveChanges();

            return Ok(airLine);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool AirLineExists(int id)
        {
            return db.AirLines.Count(e => e.Id == id) > 0;
        }
    }
}