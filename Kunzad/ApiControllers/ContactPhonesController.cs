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
    public class ContactPhonesController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();

        // GET: api/ContactPhones
        public IQueryable<ContactPhone> GetContactPhones()
        {
            return db.ContactPhones;
        }

        // GET: api/ContactPhones?contactId=1
        public IHttpActionResult GetContactPhones(int contactId)
        {
            var contactPhones = db.ContactPhones.Where(cp => cp.ContactId == contactId).ToArray();
            if (contactPhones.Length == 0)
                return Ok();
            for (int i = 0; i < contactPhones.Length; i++)
                db.Entry(contactPhones[i]).Reference(cp => cp.ContactNumberType).Load();
            return Ok(contactPhones);
        }

        // GET: api/ContactPhones/5
        [ResponseType(typeof(ContactPhone))]
        public IHttpActionResult GetContactPhone(int id)
        {
            ContactPhone contactPhone = db.ContactPhones.Find(id);
            if (contactPhone == null)
            {
                return NotFound();
            }

            return Ok(contactPhone);
        }

        // PUT: api/ContactPhones/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutContactPhone(int id, ContactPhone contactPhone)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != contactPhone.Id)
            {
                return BadRequest();
            }

            db.Entry(contactPhone).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ContactPhoneExists(id))
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

        // POST: api/ContactPhones
        [ResponseType(typeof(ContactPhone))]
        public IHttpActionResult PostContactPhone(ContactPhone contactPhone)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.ContactPhones.Add(contactPhone);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = contactPhone.Id }, contactPhone);
        }

        // DELETE: api/ContactPhones/5
        [ResponseType(typeof(ContactPhone))]
        public IHttpActionResult DeleteContactPhone(int id)
        {
            ContactPhone contactPhone = db.ContactPhones.Find(id);
            if (contactPhone == null)
            {
                return NotFound();
            }

            db.ContactPhones.Remove(contactPhone);
            db.SaveChanges();

            return Ok(contactPhone);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ContactPhoneExists(int id)
        {
            return db.ContactPhones.Count(e => e.Id == id) > 0;
        }
    }
}