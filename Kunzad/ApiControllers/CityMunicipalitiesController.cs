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
using Kunzad.ActionFilters;

namespace Kunzad.Controllers
{
    [AuthorizationRequired]
    public class CityMunicipalitiesController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();

        // GET: api/CityMunicipalities
        public IQueryable<CityMunicipality> GetCityMunicipalities()
        {
            return db.CityMunicipalities;
        }

        // GET: api/CityMunicipalities?countryId=1
        public IHttpActionResult GetCityMunicipalities(int countryId)
        {
            var q = (from c in db.CityMunicipalities
                     join p in db.StateProvinces on c.StateProvinceId equals p.Id
                     join co in db.Countries on p.CountryId equals co.Id
                     where c.StateProvince.CountryId == countryId
                     select new
                     {
                         c.Id,
                         c.Name,
                         c.StateProvinceId,
                         StateProvinceName = p.Name,
                         CountryId = co.Id,
                         CountryName = co.Name
                     }).OrderBy(c => c.Id);
            return Json(q);
        }

        // GET: api/CityMunicipalities/5
        [ResponseType(typeof(CityMunicipality))]
        public IHttpActionResult GetCityMunicipality(int id)
        {
            CityMunicipality cityMunicipality = db.CityMunicipalities.Include(c => c.StateProvince).Where(c => c.Id == id).SingleOrDefault();
            if (cityMunicipality == null)
            {
                return NotFound();
            }
            return Ok(cityMunicipality);
        }

        // PUT: api/CityMunicipalities/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutCityMunicipality(int id, CityMunicipality cityMunicipality)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != cityMunicipality.Id)
            {
                return BadRequest();
            }

            db.Entry(cityMunicipality).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CityMunicipalityExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/CityMunicipalities
        [ResponseType(typeof(CityMunicipality))]
        public IHttpActionResult PostCityMunicipality(CityMunicipality cityMunicipality)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.CityMunicipalities.Add(cityMunicipality);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (CityMunicipalityExists(cityMunicipality.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = cityMunicipality.Id }, cityMunicipality);
        }

        // DELETE: api/CityMunicipalities/5
        [ResponseType(typeof(CityMunicipality))]
        public IHttpActionResult DeleteCityMunicipality(int id)
        {
            CityMunicipality cityMunicipality = db.CityMunicipalities.Find(id);
            if (cityMunicipality == null)
            {
                return NotFound();
            }

            db.CityMunicipalities.Remove(cityMunicipality);
            db.SaveChanges();

            return Ok(cityMunicipality);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CityMunicipalityExists(int id)
        {
            return db.CityMunicipalities.Count(e => e.Id == id) > 0;
        }
    }

}