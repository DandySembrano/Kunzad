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
    public class BusinessUnitTypesController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private int pageSize = 20;
        Response response = new Response();

        // GET: api/BusinessUnitTypes
        public IQueryable<BusinessUnitType> GetBusinessUnitTypes()
        {
            return db.BusinessUnitTypes;
        }

        // GET: api/BusinessUnitTypes?page=1
        public IQueryable<BusinessUnitType> GetBusinessUnitTypes(int page)
        {
            if (page > 1)
            {
                return db.BusinessUnitTypes.OrderBy(c => c.Name).Skip((page - 1) * pageSize).Take(pageSize);
            }
            else
            {
                return db.BusinessUnitTypes.OrderBy(c => c.Name).Take(pageSize);
            }
        }

        // GET: api/BusinessUnitTypes/5
        [ResponseType(typeof(BusinessUnitType))]
        public IHttpActionResult GetBusinessUnitType(int id)
        {
            BusinessUnitType businessUnitType = db.BusinessUnitTypes.Find(id);
            if (businessUnitType == null)
            {
                return NotFound();
            }

            return Ok(businessUnitType);
        }

        // PUT: api/BusinessUnitTypes/5
        [ResponseType(typeof(BusinessUnitType))]
        public IHttpActionResult PutBusinessUnitType(int id, BusinessUnitType businessUnitType)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad Request";
                return Ok(response);
            }

            if (id != businessUnitType.Id)
            {
                response.message = "Business unit doesn't exist";
                return Ok(response);
            }

            db.Entry(businessUnitType).State = EntityState.Modified;

            try
            {
                businessUnitType.LastUpdatedDate = DateTime.Now;
                db.SaveChanges();
                response.status = "SUCCESS";
                response.objParam1 = businessUnitType;
            }
            catch (Exception e)
            {
                if (!BusinessUnitTypeExists(id))
                {
                    response.message = "Business Unit Type doesn't Exist.";
                }
                else
                {
                    response.message = e.InnerException.InnerException.Message.ToString();
                }
            }
            return Ok(response);
        }

        // POST: api/BusinessUnitTypes
        [ResponseType(typeof(BusinessUnitType))]
        public IHttpActionResult PostBusinessUnitType(BusinessUnitType businessUnitType)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad Request.";
                return Ok(response);
            }
            try {
                businessUnitType.CreatedDate = DateTime.Now;
                db.BusinessUnitTypes.Add(businessUnitType);
                db.SaveChanges();
                response.status = "SUCCESS";
                response.objParam1 = businessUnitType;
            }
            catch(Exception e)
            {
                response.message = e.InnerException.InnerException.Message.ToString();
            }
            return Ok(response);
        }

        // DELETE: api/BusinessUnitTypes/5
        [ResponseType(typeof(BusinessUnitType))]
        public IHttpActionResult DeleteBusinessUnitType(int id)
        {
            response.status = "FAILURE";
            BusinessUnitType businessUnitType = db.BusinessUnitTypes.Find(id);
            if (businessUnitType == null)
            {
                response.message = "Business Unit Type not found.";
                return Ok(response);
            }
            try {
                db.BusinessUnitTypes.Remove(businessUnitType);
                db.SaveChanges();
                response.status = "SUCCESS";
            }
            catch(Exception e){
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

        private bool BusinessUnitTypeExists(int id)
        {
            return db.BusinessUnitTypes.Count(e => e.Id == id) > 0;
        }
    }
}