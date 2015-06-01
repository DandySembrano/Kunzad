﻿using System;
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
    public class DriversController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private int pageSize = 20;
        Response response = new Response();

        // GET: api/Drivers
        public IQueryable<Driver> GetDrivers()
        {
            return db.Drivers;
        }

        // GET: api/Drivers?page=1
        public IQueryable<Driver> GetDrivers(int page)
        {
            if (page > 1)
            {
                return db.Drivers.OrderBy(c => c.FirstName).Skip((page - 1) * pageSize).Take(pageSize);
            }
            else
            {
                return db.Drivers.OrderBy(c => c.FirstName).Take(pageSize);
            }
        }

        // GET: api/Drivers/5
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
    }
}