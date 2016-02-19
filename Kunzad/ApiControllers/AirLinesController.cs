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
    public class AirLinesController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        Response response = new Response();

        // GET: api/AirLines
        [CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
        public IQueryable<AirLine> GetAirLines()
        {
            return db.AirLines.AsNoTracking();
        }

        // GET: api/BusinessUnitTypes?page=1
        public IQueryable<AirLine> GetAirLines(int page)
        {
            if (page > 1)
            {
                return db.AirLines.AsNoTracking().OrderBy(c => c.Name).Skip((page - 1) * AppSettingsGet.ServerTimeSpan).Take(AppSettingsGet.ServerTimeSpan);
            }
            else
            {
                return db.AirLines.AsNoTracking().OrderBy(c => c.Name).Take(AppSettingsGet.ServerTimeSpan);
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


        //Dynamic filtering
        [HttpGet]
        public IHttpActionResult GetAirLine(string type, int param1, [FromUri]List<AirLine> pAirline)
        {


            Object[] objAirline = new Object[AppSettingsGet.PageSize];

            var filteredAirline = (from airLine in db.AirLines
                                   select new
                                   {
                                       airLine.Id,
                                       airLine.Name
                                   }).ToArray();
            objAirline = filteredAirline;

            //this.filterRecord(param1, type,(AirLine)pAirline.ElementAt(0), (AirLine)pAirline.ElementAt(1), ref objAirline);
            if (objAirline != null)
                return Ok(objAirline);
            else
                return Ok();

        }

        public void filterRecord(int param1, string type, AirLine pAirline, AirLine pAirline1, ref Object[] objAirline)
        {
            /*If date is not nullable in table equate to "1/1/0001 12:00:00 AM" else null
            if integer value is not nullable in table equate to 0 else null*/
            DateTime defaultDate = new DateTime(0001, 01, 01, 00, 00, 00);
            int skip;

            if (type.Equals("paginate"))
            {
                if (param1 > 1)
                    skip = (param1 - 1) * AppSettingsGet.PageSize;
                else
                    skip = 0;
            }
            else
                skip = param1;

            var filteredAirline = (from airLine in db.AirLines
                                   select new
                                   {
                                       airLine.Id,
                                       airLine.Name
                                   })
                                            .Where(a => pAirline.Id == null || pAirline.Id == 0 ? true : pAirline.Id == pAirline.Id)
                                            .Where(a => pAirline.Name == null ? !pAirline.Name.Equals("") : (a.Name.ToLower().Equals(pAirline.Name) || a.Name.ToLower().Contains(pAirline.Name)))
                                            .OrderBy(a => pAirline.Id)
                                            .Skip(skip).Take(AppSettingsGet.PageSize).ToArray();
            objAirline = filteredAirline;
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

        private bool AirLineExists(int id)
        {
            return db.AirLines.Count(e => e.Id == id) > 0;
        }
    }
}