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
    public class ContactNumberTypesController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private int pageSize = 20;

        // GET: api/ContactNumberTypes
        public IQueryable<ContactNumberType> GetContactNumberTypes()
        {
            return db.ContactNumberTypes;
        }

        // GET: api/AirLines?page=1
        public IQueryable<ContactNumberType> GetContactNumberTypes(int page)
        {
            if (page > 1)
            {
                return db.ContactNumberTypes.OrderBy(c => c.Type).Skip((page - 1) * pageSize).Take(pageSize);
            }
            else
            {
                return db.ContactNumberTypes.OrderBy(c => c.Type).Take(pageSize);
            }
        }

        // GET: api/ContactNumberTypes/5
        [ResponseType(typeof(ContactNumberType))]
        public IHttpActionResult GetContactNumberType(int id)
        {
            ContactNumberType contactNumberType = db.ContactNumberTypes.Find(id);
            if (contactNumberType == null)
            {
                return NotFound();
            }

            return Ok(contactNumberType);
        }

        // PUT: api/ContactNumberTypes/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutContactNumberType(int id, ContactNumberType contactNumberType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != contactNumberType.Id)
            {
                return BadRequest();
            }

            db.Entry(contactNumberType).State = EntityState.Modified;

            try
            {
                contactNumberType.LastUpdatedDate = DateTime.Now;
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ContactNumberTypeExists(id))
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

        // POST: api/ContactNumberTypes
        [ResponseType(typeof(ContactNumberType))]
        public IHttpActionResult PostContactNumberType(ContactNumberType contactNumberType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            contactNumberType.CreatedDate = DateTime.Now;
            db.ContactNumberTypes.Add(contactNumberType);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = contactNumberType.Id }, contactNumberType);
        }

        // DELETE: api/ContactNumberTypes/5
        [ResponseType(typeof(ContactNumberType))]
        public IHttpActionResult DeleteContactNumberType(int id)
        {
            ContactNumberType contactNumberType = db.ContactNumberTypes.Find(id);
            if (contactNumberType == null)
            {
                return NotFound();
            }

            db.ContactNumberTypes.Remove(contactNumberType);
            db.SaveChanges();

            return Ok(contactNumberType);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ContactNumberTypeExists(int id)
        {
            return db.ContactNumberTypes.Count(e => e.Id == id) > 0;
        }
    }
}