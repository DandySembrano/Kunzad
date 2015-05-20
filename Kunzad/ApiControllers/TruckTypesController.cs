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
    public class TruckTypesController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private int pageSize = 20;
        // GET: api/TruckTypes
        public IQueryable<TruckType> GetTruckTypes()
        {
            return db.TruckTypes;
        }
        // GET: api/TruckTypes?page=1
        public IQueryable<TruckType> GetTruckTypes(int page)
        {
            if (page > 1)
            {
                return db.TruckTypes.OrderBy(c => c.Type).Skip((page - 1) * pageSize).Take(pageSize);
            }
            else
            {
                return db.TruckTypes.OrderBy(c => c.Type).Take(pageSize);
            }
        }

        // GET: api/TruckTypes/5
        [ResponseType(typeof(TruckType))]
        public IHttpActionResult GetTruckType(int id)
        {
            TruckType truckType = db.TruckTypes.Find(id);
            if (truckType == null)
            {
                return NotFound();
            }

            return Ok(truckType);
        }

        // PUT: api/TruckTypes/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutTruckType(int id, TruckType truckType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != truckType.Id)
            {
                return BadRequest();
            }

            db.Entry(truckType).State = EntityState.Modified;

            try
            {
                truckType.LastUpdatedDate = DateTime.Now;
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TruckTypeExists(id))
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

        // POST: api/TruckTypes
        [ResponseType(typeof(TruckType))]
        public IHttpActionResult PostTruckType(TruckType truckType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            truckType.CreatedDate = DateTime.Now;
            db.TruckTypes.Add(truckType);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = truckType.Id }, truckType);
        }

        // DELETE: api/TruckTypes/5
        [ResponseType(typeof(TruckType))]
        public IHttpActionResult DeleteTruckType(int id)
        {
            TruckType truckType = db.TruckTypes.Find(id);
            if (truckType == null)
            {
                return NotFound();
            }

            db.TruckTypes.Remove(truckType);
            db.SaveChanges();

            return Ok(truckType);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TruckTypeExists(int id)
        {
            return db.TruckTypes.Count(e => e.Id == id) > 0;
        }
    }
}