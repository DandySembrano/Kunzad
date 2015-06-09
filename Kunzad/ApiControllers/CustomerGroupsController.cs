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
        Response response = new Response();
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
            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad request.";
                return Ok(response);
            }

            if (id != customerGroup.Id)
            {
                response.message = "Customer Group not found.";
                return Ok(response);
            }

            db.Entry(customerGroup).State = EntityState.Modified;

            try
            {
                customerGroup.LastUpdatedDate = DateTime.Now;
                db.SaveChanges();
                response.status = "SUCCESS";
                response.objParam1 = customerGroup;
            }
            catch (Exception e)
            {
                if (!CustomerGroupExists(id))
                {
                    response.message = "Customer Group not found.";
                }
                else
                {
                    response.message = e.InnerException.InnerException.Message.ToString();
                }
            }

            return Ok(response);
        }

        // POST: api/CustomerGroups
        [ResponseType(typeof(CustomerGroup))]
        public IHttpActionResult PostCustomerGroup(CustomerGroup customerGroup)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad request.";
                return Ok(response);
            }
            try
            {
                customerGroup.CreatedDate = DateTime.Now;
                db.CustomerGroups.Add(customerGroup);
                db.SaveChanges();
                response.status = "SUCCESS";
                response.objParam1 = customerGroup;
            }
            catch (Exception e) {
                response.message = e.InnerException.InnerException.Message.ToString();
            }

            return Ok(response);
        }

        // DELETE: api/CustomerGroups/5
        [ResponseType(typeof(CustomerGroup))]
        public IHttpActionResult DeleteCustomerGroup(int id)
        {
            response.status = "FAILURE";
            CustomerGroup customerGroup = db.CustomerGroups.Find(id);
            if (customerGroup == null)
            {
                response.message = "Customer Group not found.";
                return Ok(response);
            }
            try
            {
                db.CustomerGroups.Remove(customerGroup);
                db.SaveChanges();
                response.status = "SUCCESS";
            }
            catch(Exception e) {
                response.message = e.InnerException.InnerException.Message.ToString();
            }

            return Ok(response);
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