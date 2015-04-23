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
    public class CustomerGroupsController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private int pageSize = 20;

        // GET: api/CustomerGroups
        public IQueryable<CustomerGroup> GetCustomerGroups()
        {
            return db.CustomerGroups.OrderBy(c => c.Name);
        }

        // GET: api/CustomerGroups?page=1
        public IQueryable<CustomerGroup> GetCustomerGroups(int page)
        {
            if (page > 1)
            {
                return db.CustomerGroups.OrderBy(c => c.Name).Skip((page-1) * pageSize).Take(pageSize);
            }
            else
            {
                return db.CustomerGroups.OrderBy(c => c.Name).Take(pageSize);
            }
        }

        // GET: api/CustomerGroups/5
        [ResponseType(typeof(CustomerGroup))]
        public IHttpActionResult GetCustomerGroup(int id)
        {
            CustomerGroup customerGroup = db.CustomerGroups.Find(id);
            if (customerGroup == null)
            {
                return NotFound();
            }

            return Ok(customerGroup);
        }

        // PUT: api/CustomerGroups/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutCustomerGroup(int id, CustomerGroup customerGroup)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != customerGroup.Id)
            {
                return BadRequest();
            }

            db.Entry(customerGroup).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomerGroupExists(id))
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

        // POST: api/CustomerGroups
        [ResponseType(typeof(CustomerGroup))]
        public IHttpActionResult PostCustomerGroup(CustomerGroup customerGroup)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.CustomerGroups.Add(customerGroup);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = customerGroup.Id }, customerGroup);
        }

        // DELETE: api/CustomerGroups/5
        [ResponseType(typeof(CustomerGroup))]
        public IHttpActionResult DeleteCustomerGroup(int id)
        {
            CustomerGroup customerGroup = db.CustomerGroups.Find(id);
            if (customerGroup == null)
            {
                //var message = string.Format("Customer group with id = {0} not found", id);
                //throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, message));              
                return NotFound();
            }

            db.CustomerGroups.Remove(customerGroup);
            db.SaveChanges();

            return Ok(customerGroup);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CustomerGroupExists(int id)
        {
            return db.CustomerGroups.Count(e => e.Id == id) > 0;
        }
    }
}