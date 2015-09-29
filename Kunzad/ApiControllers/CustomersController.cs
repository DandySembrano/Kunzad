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
using System.Reflection;
using WebAPI.OutputCache;
namespace Kunzad.ApiControllers
{
    [AutoInvalidateCacheOutput]
    public class CustomersController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private int pageSize = 5;

        // GET: api/Customers

        [CacheOutput(ClientTimeSpan = 600, ServerTimeSpan = 600)]
        public IQueryable<Customer> GetCustomers()
        {
            return db.Customers;
        }

        // GET: api/Customers?page=1
        public IQueryable<Customer> GetCustomers(int page)
        {
            if (page > 1)
            {                
                return db.Customers
                    .Include(c => c.CustomerGroup)
                    .Include(c => c.Industry)
                    .Include(c => c.CustomerAddresses.Select(e => e.CityMunicipality.StateProvince.Country))
                    .Include(c => c.CustomerContacts.Select(d => d.Contact.ContactPhones))
                    .OrderBy(c => c.Name).Skip((page - 1) * pageSize).Take(pageSize);


            }
            else
            {
                return db.Customers
                    .Include(c => c.CustomerGroup)
                    .Include(c => c.Industry)
                    .Include(c => c.CustomerAddresses.Select(e => e.CityMunicipality.StateProvince.Country))
                    .Include(c => c.CustomerContacts.Select(d => d.Contact.ContactPhones))
                    .OrderBy(c => c.Name).Take(pageSize);
            }
        }

        // GET: api/Customers/5
        [ResponseType(typeof(Customer))]
        public IHttpActionResult GetCustomer(int id)
        {
            Customer customer = db.Customers.Find(id);
            customer.CustomerAddresses = db.CustomerAddresses
                .Include(a => a.CityMunicipality.StateProvince).Where(a => a.CustomerId == customer.Id).ToArray();
            customer.CustomerContacts = db.CustomerContacts
                .Include(b => b.Contact.ContactPhones ).Where(b => b.CustomerId == customer.Id).ToArray();

            if (customer == null)
            {
                return NotFound();
            }

            return Ok(customer);
        }

        //GET: api/Customers?customerId=1&customerContactId=1&customerContactPhoneId=1&customerAddressId=1
        [ResponseType(typeof(Customer))]
        public IHttpActionResult GetCustomer(int customerId, int customerContactId, int customerContactPhoneId, int customerAddressId) {
            var customer = db.Customers.Where(c => c.Id == customerId).ToArray();
            customer[0].CustomerAddresses = db.CustomerAddresses.Include(ca => ca.CityMunicipality).Where(ca => ca.Id == customerAddressId).ToList();
            customer[0].CustomerContacts = db.CustomerContacts.Include(cc => cc.Contact).Where(cc => cc.Id == customerContactId).ToList();
            customer[0].CustomerContacts = db.CustomerContacts.Include(cc => cc.Contact.ContactPhones).Where(cc => cc.Id == customerContactId).ToList();
            foreach (var cc in customer[0].CustomerContacts)
            {
                cc.Contact.ContactPhones = cc.Contact.ContactPhones.Where(ccp => ccp.Id == customerContactPhoneId).ToArray();
            }
            foreach (var ca in customer[0].CustomerAddresses)
            {
                ca.CityMunicipality.Couriers = null;
                ca.CityMunicipality.CustomerAddresses = null;
                ca.CityMunicipality.ServiceableAreas = null;
                ca.CityMunicipality.StateProvince = null;
            }
            return Ok(customer);
        }

        // PUT: api/Customers/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutCustomer(int id, Customer customer)
        {
            try
            {
                CustomerGroup custGroup = customer.CustomerGroup;
                Industry custIndustry = customer.Industry;
                customer.LastUpdatedDate = DateTime.Now;
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (id != customer.Id)
                {
                    return BadRequest();
                }
                
                var currentCustomer = (from cAddr in db.CustomerAddresses where cAddr.CustomerId == customer.Id select cAddr);
                var currentCustomerContact = (from cContact in db.CustomerContacts where cContact.CustomerId == id select cContact);
                bool bolFound = false, bolFoundContact = false, bolFoundPhone = false;

                //remove address
                foreach(CustomerAddress cAddrOnDb in currentCustomer){
                    bolFound = false;
                    foreach(CustomerAddress cAddrOnDtl in customer.CustomerAddresses ){
                        if(cAddrOnDb.Id == cAddrOnDtl.Id){
                            bolFound = true;
                            break;
                        }
                    }
                    if(!bolFound){
                        db.CustomerAddresses.Remove(cAddrOnDb);
                    }
                }

                //remove Contact
                foreach(CustomerContact cContactOnDb in currentCustomerContact ){
                    bolFoundContact = false;
                    foreach (CustomerContact custContact in customer.CustomerContacts) { 
                        if( cContactOnDb.Id == custContact.Id){
                            bolFoundContact = true;
                            var currentContactPhones = (from curContactPhone in db.ContactPhones where curContactPhone.ContactId == cContactOnDb.ContactId select curContactPhone);
                            foreach (ContactPhone contactPhoneOnDb in currentContactPhones){
                                bolFoundPhone = false;
                                foreach (ContactPhone contactPhone in custContact.Contact.ContactPhones){
                                    if(contactPhoneOnDb.Id == contactPhone.Id){
                                        bolFoundPhone = true;
                                    }
                                }
                                if (!bolFoundPhone){
                                    db.ContactPhones.Remove(contactPhoneOnDb);
                                }
                            }
                        }    
                    }if(!bolFoundContact){
                        IEnumerable<Contact> currentContact = (from curContact in db.Contacts where curContact.Id == cContactOnDb.ContactId select curContact);
                        foreach(Contact contactDtl in currentContact){
                            db.Contacts.Remove(contactDtl);
                        }
                        db.CustomerContacts.Remove(cContactOnDb);
                    } 
                }

                //add, update customer Address
               foreach (CustomerAddress cAddrOnDtl in customer.CustomerAddresses) {
                    bolFound = false;
                    foreach (CustomerAddress cAddrOnDb in currentCustomer) {
                        if (cAddrOnDtl.Id == cAddrOnDb.Id) {
                            var cust = db.CustomerAddresses.Find(cAddrOnDtl.Id);
                            db.Entry(cust).CurrentValues.SetValues(cAddrOnDtl);
                            db.Entry(cust).State = EntityState.Modified;
                            bolFound = true;
                            break;
                        }
                    }
                    if(bolFound == false){
                        cAddrOnDtl.CustomerId = id;
                        db.CustomerAddresses.Add(cAddrOnDtl);
                    }
                }

                //add update customer contacts
               foreach (CustomerContact custContact in customer.CustomerContacts){
                   bolFoundContact = false;
                   foreach (CustomerContact cContactOnDb in currentCustomerContact){
                       if (custContact.Id == cContactOnDb.Id) {
                           bolFoundContact = true;
                           custContact.LastUpdatedByUserId = 1;
                           custContact.LastUpdatedDate = DateTime.Now;
                           var currentCustContact = db.CustomerContacts.Find(custContact.Id);
                           db.Entry(currentCustContact).CurrentValues.SetValues(custContact);
                           db.Entry(currentCustContact).State = EntityState.Modified;

                           var currentContact = db.Contacts.Find(custContact.ContactId);
                           custContact.Contact.LastUpdatedByUserId = 1;
                           custContact.Contact.LastUpdatedDate = DateTime.Now;
                           db.Entry(currentContact).CurrentValues.SetValues(custContact.Contact);
                           db.Entry(currentContact).State = EntityState.Modified;

                           var currentContactPhone = (from contactPhone in db.ContactPhones where contactPhone.ContactId == custContact.ContactId select contactPhone);
                            
                           foreach(ContactPhone custContactPhoneDtl in custContact.Contact.ContactPhones ){
                               bolFoundPhone = false;
                               foreach(ContactPhone custContactPhoneOnDb in currentContactPhone ){
                                    if(custContactPhoneOnDb.Id == custContactPhoneDtl.Id){
                                        bolFoundPhone = true;
                                        custContactPhoneDtl.LastUpdatedByUserId = 1;
                                        custContactPhoneDtl.LastUpdatedDate = DateTime.Now;
                                        db.Entry(custContactPhoneOnDb).CurrentValues.SetValues(custContactPhoneDtl);
                                        db.Entry(custContactPhoneOnDb).State = EntityState.Modified;
                                        break;
                                    }
                                }
                               if(!bolFoundPhone){ //insert phone
                                   custContactPhoneDtl.ContactId = currentContact.Id;
                                   db.ContactPhones.Add(custContactPhoneDtl);
                               }
                           }
                           break;
                       }
                   }
                   if(!bolFoundContact){ //insert contact
                       db.Contacts.Add(custContact.Contact);
                       db.CustomerContacts.Add(custContact);
                       foreach (ContactPhone contactPhone in custContact.Contact.ContactPhones){
                           db.ContactPhones.Add(contactPhone);
                       }
                   }
               }

                var custMaster = db.Customers.Find(id);
                db.Entry(custMaster).State = EntityState.Modified;
                db.Entry(custMaster).CurrentValues.SetValues(customer);
                db.SaveChanges();

                customer.CustomerGroup = custGroup;
                customer.Industry = custIndustry;

                return CreatedAtRoute("DefaultApi", new { id = customer.Id }, customer);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomerExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }catch(Exception ex){
                ModelState.AddModelError("",ex.Message);
            }
            return BadRequest(ModelState);

        }

        // POST: api/Customers
        [ResponseType(typeof(Customer))]
        public IHttpActionResult PostCustomer(Customer customer)
        {
            try
            {
                CustomerGroup custGroup = customer.CustomerGroup;
                Industry custIndustry = customer.Industry;
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                customer.CustomerGroup = null;
                customer.Industry = null;

                customer.CreatedDate = DateTime.Now;
                foreach (CustomerAddress c in customer.CustomerAddresses)
                {
                    db.CustomerAddresses.Add(c);
                }

                foreach(CustomerContact custContact in customer.CustomerContacts){
                    db.Contacts.Add(custContact.Contact);
                    foreach(ContactPhone contactPhone in custContact.Contact.ContactPhones){
                        db.ContactPhones.Add(contactPhone);
                    }
                }

                db.Customers.Add(customer);
                db.SaveChanges();

                customer.CustomerGroup = custGroup;
                customer.Industry = custIndustry;

                return CreatedAtRoute("DefaultApi", new { id = customer.Id }, customer);
            }catch(Exception ex){
                ModelState.AddModelError("", ex.Message);
                return BadRequest(ModelState);
            }
        }

        // DELETE: api/Customers/5
        [ResponseType(typeof(Customer))]
        public IHttpActionResult DeleteCustomer(int id)
        {
            try
            {
                var customer = db.Customers.Find(id);
                var address = db.CustomerAddresses.Where(c => c.CustomerId == id);
                var custContact = db.CustomerContacts.Where(c => c.CustomerId == id);
                var contacts = db.Contacts.Where(c => c.CustomerContacts.Any(cc => cc.CustomerId == id));
                var phone = db.ContactPhones.Where(c => c.Contact.CustomerContacts.Any(cc=> cc.CustomerId == id));

                db.CustomerAddresses.RemoveRange(address);
                db.CustomerContacts.RemoveRange(custContact);
                db.Contacts.RemoveRange(contacts);
                db.ContactPhones.RemoveRange(phone);

                db.Customers.Remove(customer);
                db.SaveChanges();
                
                return Ok(customer);
            }catch(Exception ex){
                ModelState.AddModelError("", ex.Message);
                return BadRequest(ModelState);
            }
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CustomerExists(int id)
        {
            return db.Customers.Count(e => e.Id == id) > 0;
        }
    }
}