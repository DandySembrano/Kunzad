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

        // GET: api/BusinessUnits?parentBusinessUnitId=1
        public IHttpActionResult GetBusinessUnitss(int parentBusinessUnitId)
        {
            var businessUnit = db.BusinessUnits.Where(bu => bu.ParentBusinessUnitId == parentBusinessUnitId).ToArray();
            if (businessUnit.Length == 0)
                return Ok();
            return Ok(businessUnit);
        }

        // GET: api/BusinessUnits?businessUnitId=1
        public IHttpActionResult GetBusinessUnits(int businessUnitId,string dummy)
        {
            var businessUnit = db.BusinessUnits.Where(bu => bu.Id == businessUnitId).ToArray();
            if (businessUnit.Length == 0)
                return Ok();
            return Ok(businessUnit);
        }

        // GET: api/GetBusinessUnits?page=1
        public IQueryable<BusinessUnit> GetBusinessUnits(int page)
        {
            if (page > 1)
            {
                return db.BusinessUnits
                    .OrderBy(bu => bu.Id).Skip((page - 1) * pageSize).Take(pageSize);
            }
            else
            {
                return db.BusinessUnits
                    .OrderBy(bu => bu.Id).Take(pageSize);
            }
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

        [HttpGet]
        //Dynamic filtering
        public IHttpActionResult GetBusinessUnit(string type, int param1, [FromUri]List<BusinessUnit> businessUnit)
        {
            Object[] businessUnits = new Object[pageSize];
            this.filterRecord(param1, type, businessUnit.ElementAt(0), businessUnit.ElementAt(1), ref businessUnits);

            if (businessUnits != null)
                return Ok(businessUnits);
            else
                return Ok();
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

        public void filterRecord(int param1, string type, BusinessUnit businessUnit, BusinessUnit businessUnit1, ref Object[] businessUnits)
        {
            /*If date is not nullable in table equate to "1/1/0001 12:00:00 AM" else null
            if integer value is not nullable in table equate to 0 else null*/
            DateTime defaultDate = new DateTime(0001, 01, 01, 00, 00, 00);
            int skip;

            if (type.Equals("paginate"))
            {
                if (param1 > 1)
                    skip = (param1 - 1) * pageSize;
                else
                    skip = 0;
            }
            else
                skip = param1;

            var filteredBusinessUnits = (from bu in db.BusinessUnits
                                            select new
                                            {
                                                bu.Id,bu.Code,bu.Name,bu.BusinessUnitTypeId,bu.ParentBusinessUnitId,bu.isOperatingSite,bu.hasAirPort,bu.hasSeaPort,
                                                BusinessUnitType = (from but in db.BusinessUnits where but.Id == bu.BusinessUnitTypeId select new { but.Id, but.Name }),
                                                ParentBusinessUnit = (from bu1 in db.BusinessUnits where bu1.Id == bu.ParentBusinessUnitId select new { bu1.Id, bu1.Code, bu1.Name })
                                            })
                                            .Where(bu => businessUnit.Id == null || businessUnit.Id == 0 ? true : bu.Id == businessUnit.Id)
                                            .Where(bu => businessUnit.Code == null ? !businessUnit.Code.Equals("") : (bu.Code.ToLower().Equals(businessUnit.Code)))
                                            .Where(bu => businessUnit.Name == null ? !businessUnit.Name.Equals("") : (bu.Name.ToLower().Equals(businessUnit.Name) || bu.Name.ToLower().Contains(businessUnit.Name)))
                                            .Where(bu => businessUnit.ParentBusinessUnitId == null || businessUnit.ParentBusinessUnitId == 0 ? true : bu.ParentBusinessUnitId == businessUnit.ParentBusinessUnitId)
                                            .OrderBy(bu => bu.Id)
                                            .Skip(skip).Take(pageSize).ToArray();
            businessUnits = filteredBusinessUnits;
        }
    }
}