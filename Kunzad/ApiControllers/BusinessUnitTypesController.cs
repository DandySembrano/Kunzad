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
    public class BusinessUnitTypesController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private int pageSize = 20;

        // GET: api/BusinessUnitTypes
        public IQueryable<BusinessUnitType> GetBusinessUnitTypes()
        {
            return db.BusinessUnitTypes;
        }

        // GET: api/BusinessUnitTypes?page=1
        public IQueryable<BusinessUnitType> GetBusinessUnitTypes(int page)
        {
            if (page > 1)
            {
                return db.BusinessUnitTypes.OrderBy(c => c.Name).Skip((page - 1) * pageSize).Take(pageSize);
            }
            else
            {
                return db.BusinessUnitTypes.OrderBy(c => c.Name).Take(pageSize);
            }
        }

        // GET: api/BusinessUnitTypes/5
        [ResponseType(typeof(BusinessUnitType))]
        public IHttpActionResult GetBusinessUnitType(int id)
        {
            BusinessUnitType businessUnitType = db.BusinessUnitTypes.Find(id);
            if (businessUnitType == null)
            {
                return NotFound();
            }

            return Ok(businessUnitType);
        }

        // PUT: api/BusinessUnitTypes/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutBusinessUnitType(int id, BusinessUnitType businessUnitType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != businessUnitType.Id)
            {
                return BadRequest();
            }

            db.Entry(businessUnitType).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BusinessUnitTypeExists(id))
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

        // POST: api/BusinessUnitTypes
        [ResponseType(typeof(BusinessUnitType))]
        public IHttpActionResult PostBusinessUnitType(BusinessUnitType businessUnitType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.BusinessUnitTypes.Add(businessUnitType);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = businessUnitType.Id }, businessUnitType);
        }

        // DELETE: api/BusinessUnitTypes/5
        [ResponseType(typeof(BusinessUnitType))]
        public IHttpActionResult DeleteBusinessUnitType(int id)
        {
            BusinessUnitType businessUnitType = db.BusinessUnitTypes.Find(id);
            if (businessUnitType == null)
            {
                return NotFound();
            }

            db.BusinessUnitTypes.Remove(businessUnitType);
            db.SaveChanges();

            return Ok(businessUnitType);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool BusinessUnitTypeExists(int id)
        {
            return db.BusinessUnitTypes.Count(e => e.Id == id) > 0;
        }
    }
}