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
        private int pageSize = 20;
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

        [HttpPut]
        //Dynamic filtering
        public IHttpActionResult PutContactPhone(string type, int param1, List<ContactPhone> contactPhone)
        {
            Object[] contactPhones = new Object[pageSize];
            this.filterRecord(param1, type, contactPhone.ElementAt(0), contactPhone.ElementAt(1), ref contactPhones);

            if (contactPhones != null)
                return Ok(contactPhones);
            else
                return Ok();
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

        public void filterRecord(int param1, string type, ContactPhone contactPhone, ContactPhone contactPhone1, ref Object[] contactPhones)
        {
            /*If date is not nullable in table equate to "1/1/0001 12:00:00 AM" else null
            if integer value is not nullable in table equate to 0 else null*/
            DateTime defaultDate = new DateTime(0001, 01, 01, 00, 00, 00);
            int skip;

            if (type.Equals("paginate"))
            {
                if (param1 > 1)
                    skip = (param1 - 1) * pageSize;
                else
                    skip = 0;
            }
            else
                skip = param1;

            var filteredContactPhones = (from cp in db.ContactPhones
                                         where contactPhone.Id == null || contactPhone.Id == 0 ? true : cp.Id == contactPhone.Id
                                         where contactPhone.ContactId == null || contactPhone.ContactId == 0 ? true : cp.ContactId == contactPhone.ContactId
                                         where contactPhone.ContactNumber == null ? !contactPhone.ContactNumber.Equals("") : (cp.ContactNumber.ToLower().Equals(contactPhone.ContactNumber) || cp.ContactNumber.ToLower().Contains(contactPhone.ContactNumber))
                                         select new
                                         {
                                             cp.Id,
                                             cp.ContactNumber,
                                             ContactNumberType = (from cnt in db.ContactNumberTypes where cnt.Id == cp.ContactNumberTypeId select new { cnt.Id, cnt.Type})
                                         })
                                        .OrderBy(cc => cc.Id)
                                        .Skip(skip).Take(pageSize).ToArray();
            contactPhones = filteredContactPhones;
        }
    }
}