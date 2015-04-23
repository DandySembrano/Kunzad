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

namespace Kunzad.Controllers
{
    public class CityMunicipalitiesController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();

        // GET: api/CityMunicipalities
        public IQueryable<CityMunicipality> GetCityMunicipalities()
        {
            return db.CityMunicipalities;
               //.Include(c => c.StateProvince)  ;
        }

        // GET: api/CityMunicipalities/5
        [ResponseType(typeof(CityMunicipality))]
        public IHttpActionResult GetCityMunicipality(int id)
        {
            CityMunicipality cityMunicipality = db.CityMunicipalities.Find(id);
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