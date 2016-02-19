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
using Kunzad.ActionFilters;

namespace Kunzad.ApiControllers
{
    [AuthorizationRequired]
    public class CheckInTypesController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();

        // GET: api/CheckInTypes
        public IQueryable<CheckInType> GetCheckInTypes()
        {
            return db.CheckInTypes;
        }

        // GET: api/CheckInTypes/5
        [ResponseType(typeof(CheckInType))]
        public IHttpActionResult GetCheckInType(int id)
        {
            CheckInType checkInType = db.CheckInTypes.Find(id);
            if (checkInType == null)
            {
                return NotFound();
            }

            return Ok(checkInType);
        }

        // PUT: api/CheckInTypes/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutCheckInType(int id, CheckInType checkInType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != checkInType.Id)
            {
                return BadRequest();
            }

            db.Entry(checkInType).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CheckInTypeExists(id))
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

        // POST: api/CheckInTypes
        [ResponseType(typeof(CheckInType))]
        public IHttpActionResult PostCheckInType(CheckInType checkInType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.CheckInTypes.Add(checkInType);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = checkInType.Id }, checkInType);
        }

        // DELETE: api/CheckInTypes/5
        [ResponseType(typeof(CheckInType))]
        public IHttpActionResult DeleteCheckInType(int id)
        {
            CheckInType checkInType = db.CheckInTypes.Find(id);
            if (checkInType == null)
            {
                return NotFound();
            }

            db.CheckInTypes.Remove(checkInType);
            db.SaveChanges();

            return Ok(checkInType);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CheckInTypeExists(int id)
        {
            return db.CheckInTypes.Count(e => e.Id == id) > 0;
        }
    }
}