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
    public class CouriersController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private int pageSize = 20;

        // GET: api/Couriers
        public IQueryable<Courier> GetCouriers()
        {
            return db.Couriers.Include(c => c.CityMunicipality);
        }

        // GET: api/Couriers?page=1
        public IQueryable<Courier> GetCouriers(int page)
        {
            if (page > 1)
            {
                return db.Couriers
                    .Include(c => c.CityMunicipality)
                    .OrderBy(c => c.Name).Skip((page - 1) * pageSize).Take(pageSize);
            }
            else
            {
                return db.Couriers
                    .Include(c => c.CityMunicipality)
                    .OrderBy(c => c.Name).Take(pageSize);
            }
        }

        // GET: api/Couriers/5
        [ResponseType(typeof(Courier))]
        public IHttpActionResult GetCourier(int id)
        {
            Courier courier = db.Couriers.Find(id);
            if (courier == null)
            {
                return NotFound();
            }

            return Ok(courier);
        }

        // PUT: api/Couriers/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutCourier(int id, Courier courier)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != courier.Id)
            {
                return BadRequest();
            }

            db.Entry(courier).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CourierExists(id))
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

        // POST: api/Couriers
        [ResponseType(typeof(Courier))]
        public IHttpActionResult PostCourier(Courier courier)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            courier.CreatedDate = DateTime.Now;
            db.Couriers.Add(courier);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = courier.Id }, courier);
        }

        // DELETE: api/Couriers/5
        [ResponseType(typeof(Courier))]
        public IHttpActionResult DeleteCourier(int id)
        {
            Courier courier = db.Couriers.Find(id);
            if (courier == null)
            {
                return NotFound();
            }

            db.Couriers.Remove(courier);
            db.SaveChanges();

            return Ok(courier);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CourierExists(int id)
        {
            return db.Couriers.Count(e => e.Id == id) > 0;
        }
    }
}