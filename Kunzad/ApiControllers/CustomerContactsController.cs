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
    public class CustomerContactsController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private int pageSize = 20;
        // GET: api/CustomerContacts
        [CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
        public IQueryable<CustomerContact> GetCustomerContacts()
        {
            return db.CustomerContacts;
        }

        // GET: api/CustomerContacts?customerId=1
        [CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
        public IHttpActionResult GetCustomerContacts(int customerId)
        {
            var customerContacts = db.CustomerContacts.Where(cc => cc.CustomerId == customerId).ToArray();
            if (customerContacts.Length == 0)
                return Ok();
            for (int i = 0; i < customerContacts.Length; i++)
                db.Entry(customerContacts[i]).Reference(cc => cc.Contact).Load();
            return Ok(customerContacts);
        }

        // GET: api/CustomerContacts/5
        [CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
        [ResponseType(typeof(CustomerContact))]
        public IHttpActionResult GetCustomerContact(int id)
        {
            CustomerContact customerContact = db.CustomerContacts.Find(id);
            if (customerContact == null)
            {
                return NotFound();
            }

            return Ok(customerContact);
        }

        // PUT: api/CustomerContacts/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutCustomerContact(int id, CustomerContact customerContact)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != customerContact.Id)
            {
                return BadRequest();
            }

            db.Entry(customerContact).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomerContactExists(id))
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

        [HttpGet]
        //Dynamic filtering
        //[CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
        public IHttpActionResult GetCustomerContact(string type, int param1, [FromUri]List<CustomerContact> customerContact)
        {
            Object[] customerContacts = new Object[pageSize];
            this.filterRecord(param1, type, customerContact.ElementAt(0), customerContact.ElementAt(1), ref customerContacts);

            if (customerContacts != null)
                return Ok(customerContacts);
            else
                return Ok();
        }

        // POST: api/CustomerContacts
        [ResponseType(typeof(CustomerContact))]
        public IHttpActionResult PostCustomerContact(CustomerContact customerContact)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.CustomerContacts.Add(customerContact);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = customerContact.Id }, customerContact);
        }

        // DELETE: api/CustomerContacts/5
        [ResponseType(typeof(CustomerContact))]
        public IHttpActionResult DeleteCustomerContact(int id)
        {
            CustomerContact customerContact = db.CustomerContacts.Find(id);
            if (customerContact == null)
            {
                return NotFound();
            }

            db.CustomerContacts.Remove(customerContact);
            db.SaveChanges();

            return Ok(customerContact);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CustomerContactExists(int id)
        {
            return db.CustomerContacts.Count(e => e.Id == id) > 0;
        }

        public void filterRecord(int param1, string type, CustomerContact customercontact, CustomerContact customercontact1, ref Object[] customercontacts)
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

            var filteredCustomerContacts = (from cc in db.CustomerContacts
                                            where customercontact.Id == null || customercontact.Id == 0 ? true : cc.Id == customercontact.Id
                                            where customercontact.CustomerId == null || customercontact.CustomerId == 0 ? true : cc.CustomerId == customercontact.CustomerId
                                            where customercontact.Contact.Name == null ? !customercontact.Contact.Name.Equals("") : (cc.Contact.Name.ToLower().Equals(customercontact.Contact.Name) || cc.Contact.Name.ToLower().Contains(customercontact.Contact.Name))
                                            where customercontact.Contact.Title == null ? !customercontact.Contact.Title.Equals("") : (cc.Contact.Title.ToLower().Equals(customercontact.Contact.Title) || cc.Contact.Title.ToLower().Contains(customercontact.Contact.Title))
                                            select new
                                            {
                                                cc.Id,
                                                cc.CustomerId,
                                                cc.ContactId,
                                                Contact = (from c in db.Contacts 
                                                        where c.Id == cc.ContactId 
                                                        select new { c.Id, c.Name, c.Title, c.Email, c.AlternateEmail }),
                                            })
                                        .OrderBy(cc => cc.Id)
                                        .Skip(skip).Take(pageSize).ToArray(); 
            customercontacts = filteredCustomerContacts;
        }
    }
}