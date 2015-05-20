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
    public class TrucksController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private int pageSize = 20;
        // GET: api/Trucks
        public IQueryable<Truck> GetTrucks()
        {
            return db.Trucks;
        }


        // GET: api/Trucks/5
        [ResponseType(typeof(Truck))]
        public IHttpActionResult GetTruck(int id)
        {
            Truck truck = db.Trucks.Find(id);
            if (truck == null)
            {
                return NotFound();
            }

            return Ok(truck);
        }
        // GET: api/Trucks?truckerId=1&request="gettrucker"
        [ResponseType(typeof(Truck))]
        public IHttpActionResult GetTruck(int truckerId, String request)
        {
            var searchTruckByTruckerId = db.Trucks
                                            .Include(t => t.TruckType)
                                            .Where(t => t.TruckerId == truckerId)
                                            .ToList();
            if (searchTruckByTruckerId == null)
            {
                return NotFound();
            }

            return Ok(searchTruckByTruckerId);
        }

        // PUT: api/Trucks/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutTruck(int id, Truck truck)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != truck.Id)
            {
                return BadRequest();
            }

            db.Entry(truck).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TruckExists(id))
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

        // POST: api/Trucks
        [ResponseType(typeof(Truck))]
        public IHttpActionResult PostTruck(Truck truck)
        {
            int i = 0;
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            truck.TruckType = null; 
            db.Trucks.Add(truck);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = truck.Id }, truck);
        }

        // DELETE: api/Trucks/5
        [ResponseType(typeof(Truck))]
        public IHttpActionResult DeleteTruck(int id)
        {
            Truck truck = db.Trucks.Find(id);
            if (truck == null)
            {
                return NotFound();
            }
            db.Trucks.Remove(truck);
            db.SaveChanges();

            return Ok(truck);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TruckExists(int id)
        {
            return db.Trucks.Count(e => e.Id == id) > 0;
        }
    }
}