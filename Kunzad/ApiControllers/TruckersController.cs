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
    public class TruckersController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private int pageSize = 20;
        Response response = new Response();
        // GET: api/Truckers
        public IQueryable<Trucker> GetTruckers()
        {
            return db.Truckers.Include(t => t.Trucks);
        }

        // GET: api/Truckers?page=1
        public IQueryable<Trucker> GetTruckers(int page)
        {
            if (page > 1)
                {
                    return db.Truckers
                        .Include(t => t.CityMunicipality)
                        .Include(t => t.Trucks)
                        .OrderBy(t => t.Name).Skip((page - 1) * pageSize).Take(pageSize);
                }
                else
                {
                    return db.Truckers
                        .Include(t => t.CityMunicipality)
                        .Include(t => t.Trucks)
                        .OrderBy(t => t.Name).Take(pageSize);
                }
        }

        // GET: api/Truckers/5
        [ResponseType(typeof(Trucker))]
        public IHttpActionResult GetTrucker(int id)
        {
            Trucker trucker = db.Truckers.Find(id);
            trucker.Trucks = db.Trucks.Include(tt => tt.TruckType ).Where(a => a.TruckerId == trucker.Id) .ToArray();
            if (trucker == null)
            {
                response.status = "FAILED";
                response.message = "Trucker not found";
            }
            else
            {
                response.status = "SUCCESS";
                response.objParam1 = trucker;
            }

            return Ok(response);
        }

        // PUT: api/Truckers/5
        [ResponseType(typeof(Trucker))]
        public IHttpActionResult PutTrucker(int id, Trucker trucker)
        {
            if (!ModelState.IsValid)
            {
                response.status = "FAILED";
                response.message = BadRequest(ModelState).ToString();

            }

            if (id != trucker.Id)
            {
                response.status = "FAILED";
                response.message = BadRequest().ToString();
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
                            var holder = db.Trucks.Find(t.Id);
                            t.LastUpdatedDate = DateTime.Now;
                            db.Entry(holder).CurrentValues.SetValues(t);
                            db.Entry(holder).State = EntityState.Modified;
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
                modifiedTrucker.Trucks = db.Trucks.Include(tt => tt.TruckType).Where(a => a.TruckerId == trucker.Id).ToArray();

                response.status = "SUCCESS";
                response.objParam1 = modifiedTrucker;
            }
            catch (Exception e)
            {
                if (!TruckerExists(id))
                {
                    response.status = "FAILED";
                    response.message = NotFound().ToString();
                }
                else
                {
                    response.status = "FAILED";
                    response.message = e.ToString();
                }
            }

            return Ok(response);
        }

        // POST: api/Truckers
        [ResponseType(typeof(Trucker))]
        public IHttpActionResult PostTrucker(Trucker trucker)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            foreach (Truck t in trucker.Trucks)
                db.Trucks.Add(t);
            trucker.CreatedDate = DateTime.Now;
            db.Truckers.Add(trucker);
            db.SaveChanges();
            return CreatedAtRoute("DefaultApi", new { id = trucker.Id }, trucker);
        }

        // DELETE: api/Truckers/5
        [ResponseType(typeof(Trucker))]
        public IHttpActionResult DeleteTrucker(int id)
        {
            Trucker trucker = db.Truckers.Find(id);
            if (trucker == null)
            {
                return NotFound();
            }

            db.Truckers.Remove(trucker);
            db.SaveChanges();

            return Ok(trucker);
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