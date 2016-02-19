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
    public class TruckersController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        Response response = new Response();
        // GET: api/Truckers
        [CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
        public IQueryable<Trucker> GetTruckers()
        {
            return db.Truckers.Include(t => t.Trucks).AsNoTracking();
        }

        // GET: api/Truckers?page=1
        public IQueryable<Trucker> GetTruckers(int page)
        {
            if (page > 1)
                {
                    return db.Truckers
                        .Include(t => t.CityMunicipality)
                        .Include(t => t.CityMunicipality.StateProvince)
                        .Include(t => t.Trucks).AsNoTracking()
                        .OrderBy(t => t.Name).Skip((page - 1) * AppSettingsGet.PageSize).Take(AppSettingsGet.PageSize);
                }
                else
                {
                    return db.Truckers
                        .Include(t => t.CityMunicipality)
                        .Include(t => t.CityMunicipality.StateProvince)
                        .Include(t => t.Trucks).AsNoTracking()
                        .OrderBy(t => t.Name).Take(AppSettingsGet.PageSize);
                }
        }

        // GET: api/Truckers/5
        [ResponseType(typeof(Trucker))]
        public IHttpActionResult GetTrucker(int id)
        {
            Trucker trucker = db.Truckers.Find(id);
            trucker.Trucks = db.Trucks.Include(tt => tt.TruckType).Where(a => a.TruckerId == trucker.Id).OrderBy(tr => tr.Id).ToArray();
            if (trucker == null)
            {
                return NotFound();
            }
            return Ok(trucker);
        }

        // PUT: api/Truckers/5
        [ResponseType(typeof(Trucker))]
        public IHttpActionResult PutTrucker(int id, Trucker trucker)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad request.";
                return Ok(response);

            }

            if (id != trucker.Id)
            {
                response.message = "Truckers doesn't exist.";
                return Ok(response); 
            }
            try
            {
                bool flag;
                var currentTrucks = db.Trucks.Where(t => t.TruckerId == trucker.Id);
                
                foreach (Truck ct in currentTrucks)
                {
                    flag = false;
                    //check if current truck exist in truck list
                    foreach (Truck t in trucker.Trucks) {
                        if (ct.Id == t.Id)
                        {
                            flag = true;
                            break;
                        }
                    }
                    if (!flag)
                    {
                        //remove deleted truck(s)
                        db.Trucks.Remove(ct);
                    }
                }
                
                foreach (Truck t in trucker.Trucks)
                {
                    flag = false;
                    foreach (Truck ct in currentTrucks)
                    {
                        if (t.Id == ct.Id)
                        {
                            flag = true;

                            //Set changes for truck info for edit
                            var truckHolder = db.Trucks.Find(t.Id);
                            t.LastUpdatedDate = DateTime.Now;
                            db.Entry(truckHolder).CurrentValues.SetValues(t);
                            db.Entry(truckHolder).State = EntityState.Modified;
                            break;
                        }
                    }
                    //add truck
                    if (!flag)
                    {
                        t.CreatedDate = DateTime.Now;
                        db.Trucks.Add(t);
                    }
                }
               
                //Set changes for trucker info
                var truckerHolder = db.Truckers.Find(trucker.Id);
                trucker.LastUpdatedDate = DateTime.Now;
                db.Entry(truckerHolder).CurrentValues.SetValues(trucker);
                db.Entry(truckerHolder).State = EntityState.Modified;

                db.SaveChanges();
                Trucker modifiedTrucker = db.Truckers.Find(trucker.Id);
                modifiedTrucker.CityMunicipality = db.CityMunicipalities.Find(trucker.CityMunicipalityId);
                modifiedTrucker.CityMunicipality.StateProvince = db.StateProvinces.Find(modifiedTrucker.CityMunicipality.StateProvinceId);
                modifiedTrucker.Trucks = db.Trucks.Include(tt => tt.TruckType).Where(a => a.TruckerId == trucker.Id).ToArray();
                response.status = "SUCCESS";
                response.objParam1 = modifiedTrucker;
            }
            catch (Exception e)
            {
                if (!TruckerExists(id))
                {
                    response.message = "Trucker doesn't exist.";
                }
                else
                {
                    response.message = e.InnerException.InnerException.Message.ToString();
                }
            }
            return Ok(response);
        }

        // POST: api/Truckers
        [ResponseType(typeof(Trucker))]
        public IHttpActionResult PostTrucker(Trucker trucker)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad request.";
                return Ok(response);
            }
            try
            {
                foreach (Truck t in trucker.Trucks)
                {
                    t.CreatedDate = DateTime.Now;
                    db.Trucks.Add(t);
                }
                trucker.CreatedDate = DateTime.Now;
                db.Truckers.Add(trucker);
                db.SaveChanges();
                response.status = "SUCCESS";
                Trucker savedTrucker = db.Truckers.Find(trucker.Id);
                savedTrucker.CityMunicipality = db.CityMunicipalities.Find(trucker.CityMunicipalityId);
                savedTrucker.CityMunicipality.StateProvince = db.StateProvinces.Find(savedTrucker.CityMunicipality.StateProvinceId);
                savedTrucker.Trucks = db.Trucks.Include(tt => tt.TruckType).Where(a => a.TruckerId == trucker.Id).ToArray();
                response.objParam1 = savedTrucker;
            }
            catch (Exception e)
            {
                response.message = e.InnerException.InnerException.Message.ToString();
            }
            return Ok(response);
        }

        // DELETE: api/Truckers/5
        [ResponseType(typeof(Trucker))]
        public IHttpActionResult DeleteTrucker(int id)
        {
            response.status = "FAILURE";
            Trucker trucker = db.Truckers.Find(id);
            if (trucker == null)
            {
                response.message = "Bad request.";
                return Ok(response);
            }
            try
            {
                var deleteTrucks = db.Trucks.Where(t => t.TruckerId == id);
                db.Trucks.RemoveRange(deleteTrucks);
                db.Truckers.Remove(trucker);
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

        private bool TruckerExists(int id)
        {
            return db.Truckers.Count(e => e.Id == id) > 0;
        }
    }
}