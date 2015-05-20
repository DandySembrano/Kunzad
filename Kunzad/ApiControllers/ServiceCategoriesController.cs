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
    public class ServiceCategoriesController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private int pageSize = 20;

        // GET: api/ServiceCategories
        public IQueryable<ServiceCategory> GetServiceCategories()
        {
            return db.ServiceCategories;
        }

        // GET: api/ServiceCategories?page=1
        public IQueryable<ServiceCategory> GetServiceCategories(int page)
        {
            if (page > 1)
            {
                return db.ServiceCategories.OrderBy(c => c.Name).Skip((page - 1) * pageSize).Take(pageSize);
            }
            else
            {
                return db.ServiceCategories.OrderBy(c => c.Name).Take(pageSize);
            }
        }

        // GET: api/ServiceCategories/5
        [ResponseType(typeof(ServiceCategory))]
        public IHttpActionResult GetServiceCategory(int id)
        {
            ServiceCategory serviceCategory = db.ServiceCategories.Find(id);
            if (serviceCategory == null)
            {
                return NotFound();
            }

            return Ok(serviceCategory);
        }

        // PUT: api/ServiceCategories/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutServiceCategory(int id, ServiceCategory serviceCategory)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != serviceCategory.Id)
            {
                return BadRequest();
            }

            db.Entry(serviceCategory).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ServiceCategoryExists(id))
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

        // POST: api/ServiceCategories
        [ResponseType(typeof(ServiceCategory))]
        public IHttpActionResult PostServiceCategory(ServiceCategory serviceCategory)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.ServiceCategories.Add(serviceCategory);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = serviceCategory.Id }, serviceCategory);
        }

        // DELETE: api/ServiceCategories/5
        [ResponseType(typeof(ServiceCategory))]
        public IHttpActionResult DeleteServiceCategory(int id)
        {
            ServiceCategory serviceCategory = db.ServiceCategories.Find(id);
            if (serviceCategory == null)
            {
                return NotFound();
            }

            db.ServiceCategories.Remove(serviceCategory);
            db.SaveChanges();

            return Ok(serviceCategory);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ServiceCategoryExists(int id)
        {
            return db.ServiceCategories.Count(e => e.Id == id) > 0;
        }
    }
}