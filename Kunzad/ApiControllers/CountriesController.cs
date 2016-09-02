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
    public class CountriesController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        Response response = new Response();
        // GET: api/Countries
        [CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
        public IQueryable<Country> GetCountries()
        {
            return db.Countries.AsNoTracking();
        }

        // GET: api/Countries?page=1
        public IQueryable<Country> GetCountries(int page)
        {
            if (page > 1)
            {
                return db.Countries
                    .Include(c => c.StateProvinces).AsNoTracking()
                    .OrderBy(c => c.Code).Skip((page - 1) * AppSettingsGet.PageSize).Take(AppSettingsGet.PageSize);
            }
            else
            {
                return db.Countries
                    .Include(c => c.StateProvinces).AsNoTracking()
                    .OrderBy(c => c.Code).Take(AppSettingsGet.PageSize);
            }
        }

        // GET: api/Countries/5
        [ResponseType(typeof(Country))]
        public IHttpActionResult GetCountry(int id)
        {
            Country country = db.Countries.Find(id);
 
            if (country == null)
            {
                return NotFound();
            }

            return Ok(country);
        }

        // PUT: api/Countries/5
        [ResponseType(typeof(Country))]
        public IHttpActionResult PutCountry(int id, Country country)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad request.";
                return Ok(response);
            }

            if (id != country.Id)
            {
                response.message = "Country doesn't exist.";
                return Ok(response);
            }

            try
            {
                bool flag, cmFlag;
                //get State/Province of a specific country
                var currentStateProvinces = db.StateProvinces.Where(state => state.CountryId == country.Id);

                //Check if State/Province is for delete
                foreach (StateProvince sp in currentStateProvinces)
                {
                    flag = false;
                    foreach (StateProvince sp1 in country.StateProvinces)
                    {
                        if (sp.Id == sp1.Id)
                        {
                            flag = true;
                            break;
                        }
                    }
                    if (!flag)
                    {
                        var removeCityMunicipalities = db.CityMunicipalities.Where(cm => cm.StateProvinceId == sp.Id);
                        //remove City/Municipalities
                        db.CityMunicipalities.RemoveRange(removeCityMunicipalities);
                        //remove deleted State/Province(s)
                        db.StateProvinces.Remove(sp);
                    }
                }

                //Check if State/Province is for Add or Delete
                foreach (StateProvince sp in country.StateProvinces)
                {
                    flag = false;
                    foreach (StateProvince sp1 in currentStateProvinces)
                    {
                        if (sp.Id == sp1.Id)
                        {
                            flag = true;
                            //Set changes for State/Province info for edit
                            var stateProvinceHolder = db.StateProvinces.Find(sp.Id);
                            sp.LastUpdatedDate = DateTime.Now;
                            db.Entry(stateProvinceHolder).CurrentValues.SetValues(sp);
                            db.Entry(stateProvinceHolder).State = EntityState.Modified;

                            var currentMunicipalities = db.CityMunicipalities.Where(cm => cm.StateProvinceId == sp.Id);
                            //Check if City/Municipalities is for delete
                            foreach (CityMunicipality cm in currentMunicipalities)
                            {
                                cmFlag = false;
                                foreach (CityMunicipality cm1 in sp.CityMunicipalities)
                                {
                                    if (cm.Id == cm1.Id)
                                    {
                                        cmFlag = true;
                                        break;
                                    }
                                }
                                if (!cmFlag)
                                    //remove City/Municipalities
                                    db.CityMunicipalities.Remove(cm);
                            }
                            //Check if City/Municipalities is for Add/Edit
                            foreach (CityMunicipality cm in sp.CityMunicipalities)
                            {
                                cmFlag = false;
                                foreach (CityMunicipality cm1 in currentMunicipalities)
                                {
                                    if (cm.Id == cm1.Id)
                                    {
                                        cmFlag = true;
                                        //set changes of City/Municipalities
                                        var cityMunicipalitiesHolder = db.CityMunicipalities.Find(cm.Id);
                                        cm.LastUpdatedDate = DateTime.Now;
                                        db.Entry(cityMunicipalitiesHolder).CurrentValues.SetValues(cm);
                                        db.Entry(cityMunicipalitiesHolder).State = EntityState.Modified;
                                        break;
                                    }
                                }
                                if (!cmFlag)
                                {
                                    //Add City/Municipalities
                                    cm.CreatedDate = DateTime.Now;
                                    db.CityMunicipalities.Add(cm);
                                }
                            }
                            break;
                        }
                    }
                    if (!flag)
                    {
                        //add State/Province
                        sp.CreatedDate = DateTime.Now;
                        sp.CountryId = country.Id;
                        db.StateProvinces.Add(sp);
                        foreach (CityMunicipality cm in sp.CityMunicipalities)
                        {
                            //add City/Municipalities
                            cm.CreatedDate = DateTime.Now;
                            db.CityMunicipalities.Add(cm);
                        }
                    }
                }
                var countryHolder = db.Countries.Find(country.Id);
                country.LastUpdatedDate = DateTime.Now;
                db.Entry(countryHolder).CurrentValues.SetValues(country);
                db.Entry(countryHolder).State = EntityState.Modified;
                db.SaveChanges();

                //var modifiedCountry = db.Countries.Find(country.Id);
                response.status = "SUCCESS";
                response.objParam1 = country;
            }
            catch (Exception e)
            {
                if (!CountryExists(id))
                {
                    response.message = "Country not found.";
                }
                else
                {
                    response.message = e.InnerException.InnerException.Message.ToString();
                }
            }
            return Ok(response);
        }

        // POST: api/Countries
        [ResponseType(typeof(Country))]
        public IHttpActionResult PostCountry(Country country)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad request.";
                return Ok(response);
            }

            try
            {
                foreach (StateProvince sp in country.StateProvinces)
                {
                    sp.CreatedDate = DateTime.Now;
                    db.StateProvinces.Add(sp);
                    foreach (CityMunicipality cm in sp.CityMunicipalities)
                    {
                        cm.CreatedDate = DateTime.Now;
                        db.CityMunicipalities.Add(cm);
                    }
                }
                country.CreatedDate = DateTime.Now;
                db.Countries.Add(country);
                db.SaveChanges();
                response.status = "SUCCESS";
                response.objParam1 = db.Countries.Find(country.Id);
            }
            catch (Exception e)
            {
                if (CountryExists(country.Id))
                {
                    response.message = "Country already exist.";
                }
                else
                {
                    response.message = e.InnerException.InnerException.Message.ToString();
                }
            } 
            return Ok(response);
        }

        // DELETE: api/Countries/5
        [ResponseType(typeof(Country))]
        public IHttpActionResult DeleteCountry(int id)
        {
            response.status = "FAILURE";
            Country country = db.Countries.Find(id);
            if (country == null)
            {
                response.message = "Country doesn't exist.";
                return Ok(response);
            }

            try
            {
                var deleteCityMunicipalities = db.CityMunicipalities.Where(cm => cm.StateProvince.CountryId == id);
                var deleteStateProvince = db.StateProvinces.Where(sp => sp.CountryId == id);
                db.CityMunicipalities.RemoveRange(deleteCityMunicipalities);
                db.StateProvinces.RemoveRange(deleteStateProvince);
                db.Countries.Remove(country);
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

        private bool CountryExists(int id)
        {
            return db.Countries.Count(e => e.Id == id) > 0;
        }
    }
}