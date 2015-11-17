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
      [AutoInvalidateCacheOutput]
    public class CustomerAddressesController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        // GET: api/CustomerAddresses
        [CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
        public IQueryable<CustomerAddress> GetCustomerAddresses()
        {
            return db.CustomerAddresses.AsNoTracking();
        }

        [CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
        public IHttpActionResult GetCustomerAddresses(int customerId)
        {
            var customerAddresses = db.CustomerAddresses.Where(ca => ca.CustomerId == customerId).ToArray();
            if (customerAddresses.Length == 0)
                return Ok();
            for (int i = 0; i < customerAddresses.Length; i++)
            {
                db.Entry(customerAddresses[i]).Reference(ca => ca.CityMunicipality).Load();
            }

            return Ok(customerAddresses);
        }

        // GET: api/CustomerAddresses/5
          [CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
        [ResponseType(typeof(CustomerAddress))]
        public IHttpActionResult GetCustomerAddress(int id)
        {
            CustomerAddress customerAddress = db.CustomerAddresses.Find(id);
            if (customerAddress == null)
            {
                return NotFound();
            }

            return Ok(customerAddress);
        }

        // PUT: api/CustomerAddresses/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutCustomerAddress(int id, CustomerAddress customerAddress)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != customerAddress.Id)
            {
                return BadRequest();
            }

            db.Entry(customerAddress).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomerAddressExists(id))
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
        [CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
        public IHttpActionResult GetCustomerAddress(string type, int param1, [FromUri]List<CustomerAddress> customerAddress)
        {
            Object[] customerAddresses = new Object[AppSettingsGet.PageSize];
            this.filterRecord(param1, type, customerAddress.ElementAt(0), customerAddress.ElementAt(1), ref customerAddresses);

            if (customerAddresses != null)
                return Ok(customerAddresses);
            else
                return Ok();
        }

        // POST: api/CustomerAddresses
        [ResponseType(typeof(CustomerAddress))]
        public IHttpActionResult PostCustomerAddress(CustomerAddress customerAddress)
        {
            /*
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }*/

            db.CustomerAddresses.Add(customerAddress);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = customerAddress.Id }, customerAddress);
        }

        // DELETE: api/CustomerAddresses/5
        [ResponseType(typeof(CustomerAddress))]
        public IHttpActionResult DeleteCustomerAddress(int id)
        {
            CustomerAddress customerAddress = db.CustomerAddresses.Find(id);
            if (customerAddress == null)
            {
                return NotFound();
            }

            db.CustomerAddresses.Remove(customerAddress);
            db.SaveChanges();

            return Ok(customerAddress);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CustomerAddressExists(int id)
        {
            return db.CustomerAddresses.Count(e => e.Id == id) > 0;
        }

        public void filterRecord(int param1, string type, CustomerAddress customerAddress, CustomerAddress customerAddress1, ref Object[] customerAddresses)
        {
            /*If date is not nullable in table equate to "1/1/0001 12:00:00 AM" else null
            if integer value is not nullable in table equate to 0 else null*/
            DateTime defaultDate = new DateTime(0001, 01, 01, 00, 00, 00);
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

            var filteredCustomerAddresses = (from ca in db.CustomerAddresses
                                             where customerAddress.Id == null || customerAddress.Id == 0 ? true : ca.Id == customerAddress.Id
                                             where customerAddress.CustomerId == null || customerAddress.CustomerId == 0 ? true : ca.CustomerId == customerAddress.CustomerId
                                             where customerAddress.Line1 == null ? !customerAddress.Line1.Equals("") : (ca.Line1.ToLower().Equals(customerAddress.Line1) || ca.Line1.ToLower().Contains(customerAddress.Line1))
                                             where customerAddress.Line2 == null ? !customerAddress.Line1.Equals("") : (ca.Line2.ToLower().Equals(customerAddress.Line2) || ca.Line2.ToLower().Contains(customerAddress.Line2))
                                             where customerAddress.PostalCode == null ? !customerAddress.PostalCode.Equals("") : (ca.PostalCode.ToLower().Equals(customerAddress.PostalCode) || ca.PostalCode.ToLower().Contains(customerAddress.PostalCode))
                                             where customerAddress.CityMunicipality.Name == null ? !customerAddress.CityMunicipality.Name.Equals("") : (ca.CityMunicipality.Name.ToLower().Equals(customerAddress.CityMunicipality.Name) || ca.CityMunicipality.Name.ToLower().Contains(customerAddress.CityMunicipality.Name))
                                             select new
                                            {
                                                ca.Id,
                                                ca.Line1,
                                                ca.Line2,
                                                ca.PostalCode,
                                                ca.IsBillingAddress,
                                                ca.IsDeliveryAddress,
                                                ca.IsPickupAddress,
                                                CityMunicipality = (from cm in db.CityMunicipalities
                                                                    where cm.Id == ca.CityMunicipalityId
                                                                    select new
                                                                    {
                                                                        cm.Id,
                                                                        cm.Name,
                                                                        StateProvince = (from sp in db.StateProvinces
                                                                                         where sp.Id == cm.StateProvinceId
                                                                                         select new { 
                                                                                            sp.Id,
                                                                                            sp.Name
                                                                                         })
                                                                    })
                                            })
                                        .OrderBy(cc => cc.Id)
                                        .Skip(skip).Take(AppSettingsGet.PageSize).ToArray();
            customerAddresses = filteredCustomerAddresses;
        }
    }
}