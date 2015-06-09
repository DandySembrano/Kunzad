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
    public class CouriersController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private int pageSize = 20;
        Response response = new Response();

        // GET: api/Couriers
        public IQueryable<Courier> GetCouriers()
        {
            return db.Couriers.Include(c => c.CityMunicipality);
        }

        // GET: api/Couriers?page=1
        public IQueryable<Courier> GetCouriers(int page)
        {
            if (page > 1)
            {
                return db.Couriers
                    .Include(c => c.CityMunicipality)
                    .Include(c => c.CityMunicipality.StateProvince)
                    .Include(c => c.CityMunicipality.StateProvince.Country)
                    .OrderBy(c => c.Name).Skip((page - 1) * pageSize).Take(pageSize);
            }
            else
            {
                return db.Couriers
                    .Include(c => c.CityMunicipality)
                    .Include(c => c.CityMunicipality.StateProvince)
                    .Include(c => c.CityMunicipality.StateProvince.Country)
                    .OrderBy(c => c.Name).Take(pageSize);
            }
        }

        // GET: api/Couriers/5
        [ResponseType(typeof(Courier))]
        public IHttpActionResult GetCourier(int id)
        {
            Courier courier = db.Couriers.Find(id);
            if (courier == null)
            {
                return NotFound();
            }

            return Ok(courier);
        }

        // PUT: api/Couriers/5
        [ResponseType(typeof(Courier))]
        public IHttpActionResult PutCourier(int id, Courier courier)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad request.";
                return Ok(response);
            }

            if (id != courier.Id)
            {
                response.message = "Courier doesn't Exist.";
                return Ok(response);
            }

            db.Entry(courier).State = EntityState.Modified;

            try
            {
                courier.LastUpdatedDate = DateTime.Now;
                db.SaveChanges();
                response.status = "SUCCESS";
                response.objParam1 = courier;
            }
            catch (Exception e)
            {
                if (!CourierExists(id))
                {
                    response.message = "Courier doesn't exist.";
                }
                else
                {
                    response.message = e.InnerException.InnerException.Message.ToString();
                }
            }
            return Ok(response);
        }

        // POST: api/Couriers
        [ResponseType(typeof(Courier))]
        public IHttpActionResult PostCourier(Courier courier)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad request.";
                return Ok(response);
            }
            try
            {
                courier.CreatedDate = DateTime.Now;
                db.Couriers.Add(courier);
                db.SaveChanges();
                var savedCourier = db.Couriers.Find(courier.Id);
                savedCourier.CityMunicipality = db.CityMunicipalities.Find(savedCourier.CityMunicipalityId);
                savedCourier.CityMunicipality.StateProvince = db.StateProvinces.Find(savedCourier.CityMunicipality.StateProvinceId);
                response.status = "SUCCESS";
                response.objParam1 = savedCourier;
            }
            catch (Exception e) 
            {
                response.message = e.InnerException.InnerException.Message.ToString();
            }
            return Ok(response);
        }

        // DELETE: api/Couriers/5
        [ResponseType(typeof(Courier))]
        public IHttpActionResult DeleteCourier(int id)
        {
            response.status = "FAILURE";
            Courier courier = db.Couriers.Find(id);
            if (courier == null)
            {
                response.message = "Courier doesn't exist.";
                return Ok(response);
            }
            try
            {
                db.Couriers.Remove(courier);
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

        private bool CourierExists(int id)
        {
            return db.Couriers.Count(e => e.Id == id) > 0;
        }
    }
}