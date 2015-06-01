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
    public class BusinessUnitsController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private int pageSize = 20;
        Response response = new Response();
        // GET: api/BusinessUnits
        public IQueryable<BusinessUnit> GetBusinessUnits()
        {
            return db.BusinessUnits.OrderBy(bu => bu.Name);
        }

        // GET: api/GetBusinessUnits?page=1
        public IHttpActionResult GetBusinessUnits(int page)
        {
            var q = (from bu in db.BusinessUnits
                     join but in db.BusinessUnitTypes on bu.BusinessUnitTypeId equals but.Id
                     select new
                     {
                         bu.Id,
                         bu.Code,
                         bu.Name,
                         bu.BusinessUnitTypeId,
                         bu.ParentBusinessUnitId,
                         bu.isOperatingSite,
                         bu.hasAirPort,
                         bu.hasSeaPort,
                         bu.CreatedDate,
                         bu.LastUpdatedDate,
                         bu.CreatedByUserId,
                         bu.LastUpdatedByUserId,
                         BusinessUnitTypeName = but.Name,
                         ParentBusinessUnitName = (from bu1 in db.BusinessUnits where bu1.Id == bu.ParentBusinessUnitId select new { bu1.Name })
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

        // GET: api/BusinessUnits/5
        [ResponseType(typeof(BusinessUnit))]
        public IHttpActionResult GetBusinessUnit(int id)
        {
            BusinessUnit businessUnit = db.BusinessUnits.Find(id);
            if (businessUnit == null)
            {
                return NotFound();
            }

            return Ok(businessUnit);
        }

        // PUT: api/BusinessUnits/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutBusinessUnit(int id, BusinessUnit businessUnit)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad request.";
                return Ok(response);
            }

            if (id != businessUnit.Id)
            {
                response.message = "Business Unit doesn't exist.";
                return Ok(response);
            }

            db.Entry(businessUnit).State = EntityState.Modified;

            try
            {
                businessUnit.LastUpdatedDate = DateTime.Now;
                db.SaveChanges();
                response.status = "SUCCESS";
                response.objParam1 = businessUnit;
            }
            catch (Exception e)
            {
                if (!BusinessUnitExists(id))
                {
                    response.message = "Business Unit doesn't exist.";
                }
                else
                {
                    response.message = e.InnerException.InnerException.Message.ToString();
                }
            }

            return Ok(response);
        }

        // POST: api/BusinessUnits
        [ResponseType(typeof(BusinessUnit))]
        public IHttpActionResult PostBusinessUnit(BusinessUnit businessUnit)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad request.";
                return Ok(response);
            }
            try
            {
                businessUnit.CreatedDate = DateTime.Now;
                db.BusinessUnits.Add(businessUnit);
                db.SaveChanges();
                response.status = "SUCCESS";
                response.objParam1 = businessUnit;
            }
            catch (Exception e)
            {
                response.message = e.InnerException.InnerException.Message.ToString();
            }

            return Ok(response);
        }

        // DELETE: api/BusinessUnits/5
        [ResponseType(typeof(BusinessUnit))]
        public IHttpActionResult DeleteBusinessUnit(int id)
        {
            response.status = "FAILURE";
            BusinessUnit businessUnit = db.BusinessUnits.Find(id);
            if (businessUnit == null)
            {
                response.message = "Business Unit doesn't exist.";
                return Ok(response);
            }
            try
            {
                db.BusinessUnits.Remove(businessUnit);
                db.SaveChanges();
                response.status = "SUCCESS";
            }
            catch (Exception e) {
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

        private bool BusinessUnitExists(int id)
        {
            return db.BusinessUnits.Count(e => e.Id == id) > 0;
        }
    }
}