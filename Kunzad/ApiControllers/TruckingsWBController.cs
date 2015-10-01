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
    public class TruckingsWBController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private int pageSize = 20;

        // GET: api/TruckingsWB
        public IHttpActionResult GetTruckings()
        {
            var truckings = db.Truckings
                .Include(t => t.Trucker)
                .Include(t => t.Truck)
                .Include(t => t.Driver)
                .Include(t => t.TruckingDeliveries)
                .Include(t => t.TruckingDeliveries.Select(s => s.Shipment.Customer))
                .Include(t => t.TruckingDeliveries.Select(s => s.Shipment.Address))
                .Include(t => t.TruckingDeliveries.Select(s => s.Shipment.Address.CityMunicipality))
                .Include(t => t.TruckingDeliveries.Select(s => s.Shipment.Address.CityMunicipality.StateProvince))
                .Where(t => t.TruckingStatusId == 10)
                .OrderByDescending(t => t.Id).ToArray();
            return Ok(truckings);
        }

        // GET: api/TruckingsWB/p=1&status=1
        public IQueryable<Trucking> GetTruckings(int p, int status)
        {
            int skip;
            if (p > 1)
                skip = (p - 1) * pageSize;
            else
                skip = 0;

            return db.Truckings
                .Include(t => t.Trucker)
                .Include(t => t.Truck)
                .Include(t => t.Driver)
                .Where(t => t.TruckingStatusId == status)
                .OrderByDescending(t => t.Id)
                .Skip(skip).Take(pageSize);
        }

        // GET: api/TruckingsWB/5
        [ResponseType(typeof(Trucking))]
        public IHttpActionResult GetTrucking(int id)
        {
            Trucking trucking = db.Truckings.Find(id);
            db.Entry(trucking).Reference(t => t.TruckingDeliveries).Load();

            if (trucking == null)
            {
                return NotFound();
            }

            return Ok(trucking);
        }

        // PUT: api/TruckingsWB/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutTrucking(int id, Trucking trucking)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != trucking.Id)
            {
                return BadRequest();
            }

            db.Entry(trucking).State = EntityState.Modified;

            try
            {
                //trucking.TruckingStatusId = '1';
                //trucking.LastUpdatedDate = DateTime.Now;
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TruckingExists(id))
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

        // POST: api/TruckingsWB
        //[ResponseType(typeof(Trucking))]
        //public IHttpActionResult PostTrucking(Trucking trucking)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    db.Truckings.Add(trucking);
        //    db.SaveChanges();

        //    return CreatedAtRoute("DefaultApi", new { id = trucking.Id }, trucking);
        //}

        // DELETE: api/TruckingsWB/5
        //[ResponseType(typeof(Trucking))]
        //public IHttpActionResult DeleteTrucking(int id)
        //{
        //    Trucking trucking = db.Truckings.Find(id);
        //    if (trucking == null)
        //    {
        //        return NotFound();
        //    }

        //    db.Truckings.Remove(trucking);
        //    db.SaveChanges();

        //    return Ok(trucking);
        //}

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TruckingExists(int id)
        {
            return db.Truckings.Count(e => e.Id == id) > 0;
        }
    }
}