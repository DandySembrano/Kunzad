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
    public class ServiceableAreasController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        Response response = new Response();

        // GET: api/ServiceableAreas
        [CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
        public IQueryable<ServiceableArea> GetServiceableAreas()
        {
            var serviceableAreas = db.ServiceableAreas
                                    .Include(sa => sa.CityMunicipality).AsNoTracking();

            foreach (var sa in serviceableAreas)
            {
                sa.CityMunicipality.Addresses = null;
                sa.CityMunicipality.Truckers = null;
                sa.CityMunicipality.Couriers = null;
                sa.CityMunicipality.CustomerAddresses = null;
                sa.CityMunicipality.StateProvince = null;
                sa.CityMunicipality.ServiceableAreas = null;
            }


            return db.ServiceableAreas;
        }

        // GET: api/ServiceableAreas?page=1
        public IQueryable<ServiceableArea> GetServiceableAreas(int page)
        {
            if (page > 1)
            {
                return db.ServiceableAreas.AsNoTracking()
                .OrderBy(sa => sa.Id)
                .Skip((page - 1) * AppSettingsGet.PageSize).Take(AppSettingsGet.PageSize);
            }
            else
            {
                return db.ServiceableAreas.AsNoTracking()
                .OrderBy(sa => sa.Id)
                .Take(AppSettingsGet.PageSize);
            }
        }
     
        [ResponseType(typeof(ServiceableArea))]
        public IHttpActionResult GetServiceableArea(int id)
        {
            ServiceableArea serviceableArea = db.ServiceableAreas.Find(id);
            if (serviceableArea == null)
            {
                return NotFound();
            }

            return Ok(serviceableArea);
        }

        // PUT: api/ServiceableAreas/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutServiceableArea(int id, ServiceableArea serviceableArea)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad request.";
                return Ok(response);
            }

            if (id != serviceableArea.Id)
            {
                response.message = "Delivery Area not found.";
                return Ok(response);
            }

            try
            {
                serviceableArea.LastUpdatedDate = DateTime.Now;
                db.Entry(serviceableArea).State = EntityState.Modified;
                db.SaveChanges();
                response.status = "SUCCESS";
                response.objParam1 = serviceableArea;
            }
            catch (Exception e)
            {
                if (!ServiceableAreaExists(id))
                {
                    response.message = "Delivery Area doesnt't exist.";
                }
                else
                {
                    response.message = e.InnerException.InnerException.Message.ToString();
                }
            }
            return Ok(response);
        }

        // POST: api/ServiceableAreas
        [ResponseType(typeof(ServiceableArea))]
        public IHttpActionResult PostServiceableArea(ServiceableArea serviceableArea)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad request.";
                return Ok(response);
            }
            try
            {
                serviceableArea.CreatedDate = DateTime.Now;
                db.ServiceableAreas.Add(serviceableArea);
                db.SaveChanges();
                response.status = "SUCCESS";
                response.objParam1 = serviceableArea;
            }
            catch (Exception e)
            {
                response.message = e.InnerException.InnerException.Message.ToString();
            }
            return Ok(response);
        }

        // DELETE: api/ServiceableAreas/5
        [ResponseType(typeof(ServiceableArea))]
        public IHttpActionResult DeleteServiceableArea(int id)
        {
            response.status = "FAILURE";
            ServiceableArea serviceableArea = db.ServiceableAreas.Find(id);
            if (serviceableArea == null)
            {
                response.message = "Delivery Area doesn't exist.";
            }
            try
            {
                db.ServiceableAreas.Remove(serviceableArea);
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

        private bool ServiceableAreaExists(int id)
        {
            return db.ServiceableAreas.Count(e => e.Id == id) > 0;
        }
    }
}