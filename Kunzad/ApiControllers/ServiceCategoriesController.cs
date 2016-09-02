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
using Kunzad.ActionFilters;
namespace Kunzad.ApiControllers
{
    [AuthorizationRequired]
     [AutoInvalidateCacheOutput]
    public class ServiceCategoriesController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        Response response = new Response();

        // GET: api/ServiceCategories
        [CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
        public IQueryable<ServiceCategory> GetServiceCategories()
        {
            return db.ServiceCategories.AsNoTracking();
        }

        [CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
        // GET: api/ServiceCategories?page=1
        public IQueryable<ServiceCategory> GetServiceCategories(int page)
        {
            if (page > 1)
            {
                return db.ServiceCategories.AsNoTracking().OrderBy(c => c.Name).Skip((page - 1) * AppSettingsGet.PageSize).Take(AppSettingsGet.PageSize);
            }
            else
            {
                return db.ServiceCategories.AsNoTracking().OrderBy(c => c.Name).Take(AppSettingsGet.PageSize);
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
        [ResponseType(typeof(ServiceCategory))]
        public IHttpActionResult PutServiceCategory(int id, ServiceCategory serviceCategory)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad request.";
                return Ok(response);
            }

            if (id != serviceCategory.Id)
            {
                response.message = "Service category not found.";
                return Ok(response);
            }

            db.Entry(serviceCategory).State = EntityState.Modified;

            try
            {
                serviceCategory.LastUpdatedDate = DateTime.Now;
                db.SaveChanges();
                response.status = "SUCCESS";
                response.objParam1 = serviceCategory;
            }
            catch (Exception e)
            {
                if (!ServiceCategoryExists(id))
                {
                    response.message = "Service category doesn't exist.";
                }
                else
                {
                    response.message = e.InnerException.InnerException.Message.ToString();
                }
            }
            return Ok(response);
        }

        // POST: api/ServiceCategories
        [ResponseType(typeof(ServiceCategory))]
        public IHttpActionResult PostServiceCategory(ServiceCategory serviceCategory)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad request.";
                return Ok(response);
            }
            try
            {
                serviceCategory.CreatedDate = DateTime.Now;
                db.ServiceCategories.Add(serviceCategory);
                db.SaveChanges();
                response.status = "SUCCESS";
                response.objParam1 = serviceCategory;
            }
            catch (Exception e)
            {
                response.message = e.InnerException.InnerException.Message.ToString();
            }
            return Ok(response);
        }

        // DELETE: api/ServiceCategories/5
        [ResponseType(typeof(ServiceCategory))]
        public IHttpActionResult DeleteServiceCategory(int id)
        {
            response.status = "FAILURE";
            ServiceCategory serviceCategory = db.ServiceCategories.Find(id);
            if (serviceCategory == null)
            {
                response.message = "Service Category doesn't exist.";
            }
            try
            {
                db.ServiceCategories.Remove(serviceCategory);
                db.SaveChanges();
                response.status = "SUCCESS";
            }
            catch (Exception e)
            {
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

        private bool ServiceCategoryExists(int id)
        {
            return db.ServiceCategories.Count(e => e.Id == id) > 0;
        }
    }
}