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
    public class CustomerAddressesController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();

        // GET: api/CustomerAddresses
        public IQueryable<CustomerAddress> GetCustomerAddresses()
        {
            return db.CustomerAddresses;
        }

        // GET: api/CustomerAddresses/5
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
    }
}