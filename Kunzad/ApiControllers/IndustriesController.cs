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
    public class IndustriesController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private int pageSize = 20;
        Response response = new Response();
        // GET: api/Industries
        public IQueryable<Industry> GetIndustries()
        {
            return db.Industries;
        }

        // GET: api/Industries?page=1
        public IQueryable<Industry> GetIndustries(int page)
        {
            if (page > 1)
            {
                return db.Industries.OrderBy(c => c.Name).Skip((page - 1) * pageSize).Take(pageSize);
            }
            else
            {
                return db.Industries.OrderBy(c => c.Name).Take(pageSize);
            }
        }
        // GET: api/Industries/5
        [ResponseType(typeof(Industry))]
        public IHttpActionResult GetIndustry(int id)
        {
            Industry industry = db.Industries.Find(id);
            if (industry == null)
            {
                return NotFound();
            }

            return Ok(industry);
        }

        // PUT: api/Industries/5
        [ResponseType(typeof(Industry))]
        public IHttpActionResult PutIndustry(int id, Industry industry)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad request";
                return Ok(response);
            }

            if (id != industry.Id)
            {
                response.message = "Industry doesn't exist.";
                return Ok(response);
            }

            db.Entry(industry).State = EntityState.Modified;

            try
            {
                industry.LastUpdatedDate = DateTime.Now;
                db.SaveChanges();
                response.status = "SUCCESS";
                response.objParam1 = industry;
            }
            catch (Exception e)
            {
                if (!IndustryExists(id))
                {
                    response.message = "Industry doesn't exist.";
                }
                else
                {
                    response.message = e.InnerException.InnerException.Message.ToString();
                }
            }
            return Ok(response);
        }

        // POST: api/Industries
        [ResponseType(typeof(Industry))]
        public IHttpActionResult PostIndustry(Industry industry)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad request.";
                return Ok(response);
            }
            try
            {
                industry.CreatedDate = DateTime.Now;
                db.Industries.Add(industry);
                db.SaveChanges();
                response.status = "SUCCESS";
                response.objParam1 = industry;
            }
            catch(Exception e)
            {
                response.message = e.InnerException.InnerException.Message.ToString();
            }

            return Ok(response);
        }

        // DELETE: api/Industries/5
        [ResponseType(typeof(Industry))]
        public IHttpActionResult DeleteIndustry(int id)
        {
            response.status = "FAILURE";
            Industry industry = db.Industries.Find(id);
            if (industry == null)
            {
                response.message = "Industry doesn't exist.";
                return Ok(response);
            }
            try
            {
                db.Industries.Remove(industry);
                db.SaveChanges();
                response.status = "SUCCESS";
            }
            catch(Exception e)
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

        private bool IndustryExists(int id)
        {
            return db.Industries.Count(e => e.Id == id) > 0;
        }
    }
}