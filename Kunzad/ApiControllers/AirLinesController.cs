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
    public class AirLinesController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private int pageSize = 20;
        Response response = new Response();

        // GET: api/AirLines
        public IQueryable<AirLine> GetAirLines()
        {
            return db.AirLines;
        }

        // GET: api/BusinessUnitTypes?page=1
        public IQueryable<AirLine> GetAirLines(int page)
        {
            if (page > 1)
            {
                return db.AirLines.OrderBy(c => c.Name).Skip((page - 1) * pageSize).Take(pageSize);
            }
            else
            {
                return db.AirLines.OrderBy(c => c.Name).Take(pageSize);
            }
        }

        // GET: api/AirLines/5
        [ResponseType(typeof(AirLine))]
        public IHttpActionResult GetAirLine(int id)
        {
            AirLine airLine = db.AirLines.Find(id);
            if (airLine == null)
            {
                return NotFound();
            }

            return Ok(airLine);
        }

        // PUT: api/AirLines/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutAirLine(int id, AirLine airLine)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad request.";
                return Ok(response);
            }

            if (id != airLine.Id)
            {
                response.message = "Airline doesn't exist.";
                return Ok(response);
            }

            db.Entry(airLine).State = EntityState.Modified;

            try
            {
                airLine.LastUpdatedDate = DateTime.Now;
                db.SaveChanges();
                response.status = "SUCCESS";
                response.objParam1 = airLine;
            }
            catch (Exception e)
            {
                if (!AirLineExists(id))
                {
                    response.message = "Airline doesn't exist.";
                }
                else
                {
                    response.message = e.InnerException.InnerException.Message.ToString();
                }
            }
            return Ok(response);
        }

        // POST: api/AirLines
        [ResponseType(typeof(AirLine))]
        public IHttpActionResult PostAirLine(AirLine airLine)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad request.";
               return Ok(response);
            }
            try
            {
                airLine.CreatedDate = DateTime.Now;
                db.AirLines.Add(airLine);
                db.SaveChanges();
                response.status = "SUCCESS";
                response.objParam1 = airLine;
            }
            catch (Exception e)
            {
                response.message = e.InnerException.InnerException.Message.ToString();
            }

            return Ok(response);
        }

        // DELETE: api/AirLines/5
        [ResponseType(typeof(AirLine))]
        public IHttpActionResult DeleteAirLine(int id)
        {
            response.status = "FAILURE";
            AirLine airLine = db.AirLines.Find(id);
            if (airLine == null)
            {
                response.message = "Airline doesn't exist.";
                return Ok(response);
            }
            try
            {
                db.AirLines.Remove(airLine);
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

        private bool AirLineExists(int id)
        {
            return db.AirLines.Count(e => e.Id == id) > 0;
        }
    }
}