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
using WebAPI.OutputCache;
namespace Kunzad.ApiControllers
{
    public class TrucksController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private int pageSize = 20;
        // GET: api/Trucks
        [CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
        public IQueryable<Truck> GetTrucks()
        {
            return db.Trucks;
        }

        [HttpGet]
        //[CacheOutput(ClientTimeSpan = 6, ServerTimeSpan = 6)]
        //[CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
        public IHttpActionResult GetTrucks(string type, int param1, [FromUri]List<Truck> truck)
        {
            Truck[] trucks = new Truck[pageSize];
            this.filterRecord(param1, type, truck.ElementAt(0), truck.ElementAt(1), ref trucks);

            if (trucks != null)
                return Ok(trucks);
            else
                return Ok();
        }

        // GET: api/Trucks?page=1
        [CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
        public IHttpActionResult GetTrucks(int page)
        {
            int skip;
            if (page > 1)
                skip = (page - 1) * pageSize;
            else
                skip = 0;

            var truck = db.Trucks
                            .Include(t => t.Trucker)
                            .Include(t => t.TruckType)
                            .ToArray();
            if (truck.Length == 0)
                return Ok(truck);
            for (int i = 0; i < truck.Length; i++)
            {
                truck[i].Trucker.CityMunicipality = null;
                truck[i].Trucker.Truckings = null;
                truck[i].Trucker.Trucks = null;
                truck[i].TruckType.Trucks = null;

            }
            if (page > 1)
                return Ok(truck.Skip((page - 1) * pageSize).Take(pageSize));
            else
                return Ok(truck.Take(pageSize));
           
        }

        // GET: api/Trucks/5
        [CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
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
        [CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
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

        public void filterRecord(int param1, string type, Truck truck, Truck truck1, ref Truck[] trucks)
        {

            /*
             * If date is not nullable in table equate to "1/1/0001 12:00:00 AM" else null
             * If integer value is not nullable in table equate to 0 else null
             * Use modified date if filtered data type is date
             */
            DateTime defaultDate = new DateTime(0001, 01, 01, 00, 00, 00);
            TimeSpan defaultTime = new TimeSpan(23, 00, 00);
            int skip;

            if (type.Equals("paginate"))
            {
                if (param1 > 1)
                    skip = (param1 - 1) * AppSettingsGet.PageSize;
                else
                    skip = 0;
            }
            else
                skip = param1;
            var filteredTrucks = db.Trucks
                .Include(t => t.Trucker)
                .Include(t => t.TruckType)
                .Where(t => truck.Id == null || truck.Id == 0 ? true : t.Id == truck.Id)
                .Where(t => truck.TruckTypeId == null || truck.TruckTypeId == 0 ? true : t.TruckTypeId == truck.TruckTypeId)
                .Where(t => truck.PlateNo == null ? true : t.PlateNo.Equals(truck.PlateNo) || t.PlateNo.Contains(truck.PlateNo))
                .OrderBy(t => t.Id)
                .Skip(skip).Take(AppSettingsGet.PageSize).AsNoTracking().ToArray();

            trucks = filteredTrucks;
        }
    }
}