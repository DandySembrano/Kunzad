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
    public class ServiceableAreasController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private int pageSize = 20;
        Response response = new Response();

        // GET: api/ServiceableAreas
        public IQueryable<ServiceableArea> GetServiceableAreas()
        {
            return db.ServiceableAreas;
        }

        // GET: api/ServiceableAreas?page=1
        public IHttpActionResult GetServiceableAreas(int page)
        {
            var q = (from sa in db.ServiceableAreas
                     join cm in db.CityMunicipalities on sa.CityMunicipalityId equals cm.Id
                     join sp in db.StateProvinces on cm.StateProvinceId equals sp.Id
                     select new
                     {
                         sa.Id,
                         sa.Name,
                         sa.CityMunicipalityId,
                         sa.PostalCode,
                         sa.IsServiceable,
                         sa.BusinessUnitId,
                         sa.CreatedDate,
                         sa.LastUpdatedDate,
                         sa.CreatedByUserId,
                         sa.LastUpdatedByUserId,
                         CityMunicipalityName = cm.Name,
                         StateProvinceName = sp.Name,
                         BusinessUnitName = (from bu in db.BusinessUnits where bu.Id == sa.BusinessUnitId select new { bu.Name })
                     });
            if (page > 1)
            {
                q.Skip((page - 1) * pageSize).Take(pageSize);
            }
            else
            {
                q.Take(pageSize);
            }
            return Json(q);
        }
        // GET: api/ServiceableAreas/5
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