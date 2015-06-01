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
    public class VesselVoyagesController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();

        // GET: api/VesselVoyages
        public IQueryable<VesselVoyage> GetVesselVoyages()
        {
            return db.VesselVoyages;
        }

        // GET: api/VesselVoyages?shippingLineId=1
        public IHttpActionResult GetVesselVoyages(int shippingLineId)
        {
            var q = (from vv in db.VesselVoyages
                     join v in db.Vessels on vv.VesselId equals v.Id
                     join sl in db.ShippingLines on v.ShippingLineId equals sl.Id
                     //join bu in db.BusinessUnits on vv.OriginBusinessUnitId equals bu.Id
                     //join bu1 in db.BusinessUnits on vv.DestinationBusinessUnitId equals bu1.Id
                     select new
                     {
                         vv.Id,
                         vv.VesselId,
                         vv.VoyageNo,
                         vv.EstimatedDepartureDate,
                         vv.EstimatedDepartureTime,
                         vv.EstimatedArrivalDate,
                         vv.EstimatedArrivalTime,
                         vv.OriginBusinessUnitId,
                         vv.DestinationBusinessUnitId,
                         vv.DepartureDate,
                         vv.DepartureTime,
                         vv.ArrivalDate,
                         vv.ArrivalTime,
                         vv.CreatedDate,
                         vv.LastUpdatedDate,
                         vv.CreatedByUserId,
                         vv.LastUpdatedByUserId,
                         BusinessUnitNameOrigin = (from buo in db.BusinessUnits where buo.Id == vv.OriginBusinessUnitId select new { buo.Name}),
                         BusinessUnitNameDestination = (from bud in db.BusinessUnits where bud.Id == vv.DestinationBusinessUnitId select new { bud.Name})
                     }).OrderBy(vv => vv.Id);
            return Json(q);
        }

        // GET: api/VesselVoyages/5
        [ResponseType(typeof(VesselVoyage))]
        public IHttpActionResult GetVesselVoyage(int id)
        {
            VesselVoyage vesselVoyage = db.VesselVoyages.Find(id);
            if (vesselVoyage == null)
            {
                return NotFound();
            }

            return Ok(vesselVoyage);
        }

        // PUT: api/VesselVoyages/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutVesselVoyage(int id, VesselVoyage vesselVoyage)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != vesselVoyage.Id)
            {
                return BadRequest();
            }

            db.Entry(vesselVoyage).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VesselVoyageExists(id))
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

        // POST: api/VesselVoyages
        [ResponseType(typeof(VesselVoyage))]
        public IHttpActionResult PostVesselVoyage(VesselVoyage vesselVoyage)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.VesselVoyages.Add(vesselVoyage);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = vesselVoyage.Id }, vesselVoyage);
        }

        // DELETE: api/VesselVoyages/5
        [ResponseType(typeof(VesselVoyage))]
        public IHttpActionResult DeleteVesselVoyage(int id)
        {
            VesselVoyage vesselVoyage = db.VesselVoyages.Find(id);
            if (vesselVoyage == null)
            {
                return NotFound();
            }

            db.VesselVoyages.Remove(vesselVoyage);
            db.SaveChanges();

            return Ok(vesselVoyage);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool VesselVoyageExists(int id)
        {
            return db.VesselVoyages.Count(e => e.Id == id) > 0;
        }
    }
}