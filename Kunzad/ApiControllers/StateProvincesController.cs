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
    public class StateProvincesController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();

        // GET: api/StateProvinces
        public IQueryable<StateProvince> GetStateProvinces()
        {
            return db.StateProvinces;
        }

        // GET: api/StateProvinces/5
        [ResponseType(typeof(StateProvince))]
        public IHttpActionResult GetStateProvince(int id)
        {
            StateProvince stateProvince = db.StateProvinces.Find(id);
            if (stateProvince == null)
            {
                return NotFound();
            }

            return Ok(stateProvince);
        }

        // PUT: api/StateProvinces/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutStateProvince(int id, StateProvince stateProvince)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != stateProvince.Id)
            {
                return BadRequest();
            }

            db.Entry(stateProvince).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StateProvinceExists(id))
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

        // POST: api/StateProvinces
        [ResponseType(typeof(StateProvince))]
        public IHttpActionResult PostStateProvince(StateProvince stateProvince)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.StateProvinces.Add(stateProvince);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (StateProvinceExists(stateProvince.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = stateProvince.Id }, stateProvince);
        }

        // DELETE: api/StateProvinces/5
        [ResponseType(typeof(StateProvince))]
        public IHttpActionResult DeleteStateProvince(int id)
        {
            StateProvince stateProvince = db.StateProvinces.Find(id);
            if (stateProvince == null)
            {
                return NotFound();
            }

            db.StateProvinces.Remove(stateProvince);
            db.SaveChanges();

            return Ok(stateProvince);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool StateProvinceExists(int id)
        {
            return db.StateProvinces.Count(e => e.Id == id) > 0;
        }
    }
}