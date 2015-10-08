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
        int pageSize = 20;
        // GET: api/VesselVoyages
        public IQueryable<VesselVoyage> GetVesselVoyages()
        {
            return db.VesselVoyages;
        }

        // GET: api/VesselVoyages?vesselId=1
        public IHttpActionResult GetVesselsVoyages(int vesselId)
        {
            var vesselVoyages = db.VesselVoyages.Where(vv => vv.VesselId == vesselId).ToArray();
            if (vesselVoyages.Length == 0)
                return Ok();
            return Ok(vesselVoyages);
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

        [HttpGet]
        //Dynamic filtering
        public IHttpActionResult GetVesselVoyage(string type, int param1, [FromUri]List<VesselVoyage> vesselVoyage)
        {
            Object[] vesselVoyages = new Object[pageSize];
            this.filterRecord(param1, type, vesselVoyage.ElementAt(0), vesselVoyage.ElementAt(1), ref vesselVoyages);

            if (vesselVoyages != null)
                return Ok(vesselVoyages);
            else
                return Ok();
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

        public void filterRecord(int param1, string type, VesselVoyage vesselVoyage, VesselVoyage vesselVoyage1, ref Object[] vesselVoyages)
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

            var filteredVesselVoayages = (from vv in db.VesselVoyages
                                            select new
                                            {
                                                vv.Id,
                                                vv.VoyageNo,
                                                vv.VesselId,
                                                vv.OriginBusinessUnitId,
                                                Origin = (from o in db.BusinessUnits where o.Id == vv.OriginBusinessUnitId
                                                          select new
                                                          {
                                                              o.Id,
                                                              o.Name
                                                          }
                                                         ),
                                                vv.DestinationBusinessUnitId,
                                                Destination = (from d in db.BusinessUnits
                                                          where d.Id == vv.DestinationBusinessUnitId
                                                          select new
                                                          {
                                                              d.Id,
                                                              d.Name
                                                          }
                                                         ),
                                                vv.EstimatedArrivalDate,
                                                vv.EstimatedArrivalTime,
                                                vv.DepartureDate,
                                                vv.DepartureTime,
                                                vv.ArrivalDate,
                                                vv.ArrivalTime,
                                                Vessel = (from v in db.Vessels where v.Id == vv.VesselId
                                                          select new
                                                          {
                                                             v.Id,
                                                             v.Name
                                                          }
                                                         )
                                            })
                                        .Where(vv => vesselVoyage.Id == null || vesselVoyage.Id == 0 ? true : vv.Id == vesselVoyage.Id)
                                        .Where(vv => vesselVoyage.VesselId == null || vesselVoyage.VesselId == 0 ? true : vv.VesselId == vesselVoyage.VesselId)
                                        .Where(vv => vesselVoyage.OriginBusinessUnitId == null || vesselVoyage.OriginBusinessUnitId == 0 ? true : vv.OriginBusinessUnitId == vesselVoyage.OriginBusinessUnitId)
                                        .Where(vv => vesselVoyage.DestinationBusinessUnitId == null || vesselVoyage.DestinationBusinessUnitId == 0 ? true : vv.DestinationBusinessUnitId == vesselVoyage.DestinationBusinessUnitId)
                                        .Where(vv => vesselVoyage.VoyageNo == null ? !vesselVoyage.VoyageNo.Equals("") : (vv.VoyageNo.ToLower().Equals(vesselVoyage.VoyageNo)))
                                        .Where(vv => vesselVoyage.EstimatedArrivalDate == null || vesselVoyage.EstimatedArrivalDate == defaultDate ? true : vv.EstimatedArrivalDate >= vesselVoyage.EstimatedArrivalDate && vv.EstimatedArrivalDate <= vesselVoyage1.EstimatedArrivalDate)
                                        .Where(vv => vesselVoyage.DepartureDate == null || vesselVoyage.DepartureDate == defaultDate ? true : vv.DepartureDate >= vesselVoyage.DepartureDate && vv.DepartureDate <= vesselVoyage1.DepartureDate)
                                        .Where(vv => vesselVoyage.ArrivalDate == null || vesselVoyage.ArrivalDate == defaultDate ? true : vv.ArrivalDate >= vesselVoyage.ArrivalDate && vv.ArrivalDate <= vesselVoyage1.ArrivalDate)
                                        .OrderBy(vv => vv.Id)
                                        .Skip(skip).Take(pageSize).ToArray();

            vesselVoyages = filteredVesselVoayages;
        }
    }
}