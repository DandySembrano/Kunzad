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
    public class DriversController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        Response response = new Response();

        // GET: api/Drivers
        [CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
        public IQueryable<Driver> GetDrivers()
        {
            return db.Drivers.AsNoTracking();
        }

        //[CacheOutput(ClientTimeSpan = 6, ServerTimeSpan = 6)]
        //[CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
        public IHttpActionResult GetDrivers(string type, int param1, [FromUri]List<Driver> driver)
        {
            Driver[] drivers = new Driver[AppSettingsGet.PageSize];
            this.filterRecord(param1, type, driver.ElementAt(0), driver.ElementAt(1), ref drivers);

            if (drivers != null)
                return Ok(drivers);
            else
                return Ok();
        }

        // GET: api/Drivers?page=1
        [CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
        public IQueryable<Driver> GetDrivers(int page)
        {
            if (page > 1)
            {
                return db.Drivers.AsNoTracking().OrderBy(c => c.FirstName).Skip((page - 1) * AppSettingsGet.PageSize).Take(AppSettingsGet.PageSize);
            }
            else
            {
                return db.Drivers.AsNoTracking().OrderBy(c => c.FirstName).Take(AppSettingsGet.PageSize);
            }
        }

        // GET: api/Drivers/5
        [CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
        [ResponseType(typeof(Driver))]
        public IHttpActionResult GetDriver(int id)
        {
            Driver driver = db.Drivers.Find(id);
            if (driver == null)
            {
                return NotFound();
            }

            return Ok(driver);
        }

        // PUT: api/Drivers/5
        [ResponseType(typeof(Driver))]
        public IHttpActionResult PutDriver(int id, Driver driver)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != driver.Id)
            {
                response.message = "Bad request.";
                return Ok(response);
            }

            db.Entry(driver).State = EntityState.Modified;

            try
            {
                driver.LastUpdatedDate = DateTime.Now;
                db.SaveChanges();
                response.status = "SUCCESS";
                response.objParam1 = driver;
            }
            catch (Exception e)
            {
                if (!DriverExists(id))
                {
                    response.message = "Driver doesn't exist.";
                }
                else
                {
                    response.message = e.InnerException.InnerException.Message.ToString();
                }
            }

            return Ok(response);
        }

        // POST: api/Drivers
        [ResponseType(typeof(Driver))]
        public IHttpActionResult PostDriver(Driver driver)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad request";
                return Ok(response);
            }
            try
            {
                driver.CreatedDate = DateTime.Now;
                db.Drivers.Add(driver);
                db.SaveChanges();
                response.status = "SUCCESS";
                response.objParam1 = driver;
            }
            catch (Exception e) 
            {
                response.message = e.InnerException.InnerException.Message.ToString();
            }

            return Ok(response);
        }

        // DELETE: api/Drivers/5
        [ResponseType(typeof(Driver))]
        public IHttpActionResult DeleteDriver(int id)
        {
            response.status = "FAILURE";
            Driver driver = db.Drivers.Find(id);
            if (driver == null)
            {
                response.message = "Driver doesn't exist.";
                return Ok(response);
            }
            try
            {
                db.Drivers.Remove(driver);
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

        private bool DriverExists(int id)
        {
            return db.Drivers.Count(e => e.Id == id) > 0;
        }

        public void filterRecord(int param1, string type, Driver driver, Driver driver1, ref Driver[] drivers)
        {

            /*
             * If date is not nullable in table equate to "1/1/0001 12:00:00 AM" else null
             * If integer value is not nullable in table equate to 0 else null
             * Use modified date if filtered data type is date
             */
            DateTime defaultDate = new DateTime(0001, 01, 01, 00, 00, 00);
            TimeSpan defaultTime = new TimeSpan(23, 00, 00);
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
            var filteredDrivers = db.Drivers
                .Where(d => driver.Id == null || driver.Id == 0 ? true : d.Id == driver.Id)
                .Where(d => driver.FirstName == null ? true : d.FirstName.Equals(driver.FirstName) || d.FirstName.Contains(driver.FirstName))
                .Where(d => driver.LastName == null ? true : d.LastName.Equals(driver.LastName) || d.LastName.Contains(driver.LastName))
                .Where(d => driver.MiddleName == null ? true : d.MiddleName.Equals(driver.MiddleName) || d.MiddleName.Contains(driver.MiddleName))
                .Where(d => driver.LicenseNo == null ? true : d.LicenseNo.Equals(driver.LicenseNo) || d.LicenseNo.Contains(driver.LicenseNo))
                .OrderBy(d => d.Id).Skip(skip).Take(AppSettingsGet.PageSize).AsNoTracking().ToArray();
            drivers = filteredDrivers;
        }
    }
}