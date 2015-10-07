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
        Response response = new Response();
        private int pageSize = 20;
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

        [HttpGet]
        //Dynamic filtering
        public IHttpActionResult GetCourier(string type, int param1, [FromUri]List<Courier> courier)
        {
            Object[] couriers = new Object[pageSize];
            this.filterRecord(param1, type, courier.ElementAt(0), courier.ElementAt(1), ref couriers);

            if (couriers != null)
                return Ok(couriers);
            else
                return Ok();
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

        public void filterRecord(int param1, string type, Courier courier, Courier courier1, ref Object[] couriers)
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

            var filteredCouriers = (from c in db.Couriers
                                    where courier.Id == null || courier.Id == 0 ? true : c.Id == courier.Id
                                    where courier.Name == null ? true : (c.Name.ToLower().Contains(courier.Name) || c.Name.ToLower().Equals(courier.Name))
                                    where courier.TIN == null ? true : (c.TIN.ToLower().Contains(courier.TIN) || c.TIN.ToLower().Equals(courier.TIN))
                                    where courier.Line1 == null ? true : (c.Line1.ToLower().Contains(courier.Line1) || c.Line1.ToLower().Equals(courier.Line1))
                                    where courier.Line2 == null ? true : (c.Line2.ToLower().Contains(courier.Line2) || c.Line2.ToLower().Equals(courier.Line2))
                                    where courier.PostalCode == null ? true : (c.PostalCode.ToLower().Contains(courier.PostalCode) || c.PostalCode.ToLower().Equals(courier.PostalCode))
                                    select new { 
                                        c.Id,
                                        c.Name,
                                        c.TIN,
                                        c.Line1,
                                        c.Line2,
                                        CityMunicipality = (from cm in db.CityMunicipalities where cm.Id == c.CityMunicipalityId select new {cm.Name}),
                                        c.PostalCode
                                    })
                                        .OrderBy(c => c.Id)
                                        .Skip(skip).Take(pageSize).ToArray();

            couriers = filteredCouriers;
        }
    }
}