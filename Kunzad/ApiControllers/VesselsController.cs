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
    public class VesselsController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        int pageSize = 20;
        // GET: api/Vessels
        public IQueryable<Vessel> GetVessels()
        {
            return db.Vessels;
        }

        // GET: api/Vessels?shippingLineId=1
        public IHttpActionResult GetVessels(int shippingLineId)
        {
            var vessels = db.Vessels.Where(v => v.ShippingLineId == shippingLineId).ToArray();
            if (vessels.Length == 0)
                return Ok();
            return Ok(vessels);
        }

        // GET: api/Vessels/5
        [ResponseType(typeof(Vessel))]
        public IHttpActionResult GetVessel(int id)
        {
            Vessel vessel = db.Vessels.Find(id);
            if (vessel == null)
            {
                return NotFound();
            }

            return Ok(vessel);
        }

        [HttpGet]
        //Dynamic filtering
        public IHttpActionResult GetVessel(string type, int param1, [FromUri]List<Vessel> vessel)
        {
            Object[] vessels = new Object[pageSize];
            this.filterRecord(param1, type, vessel.ElementAt(0), vessel.ElementAt(1), ref vessels);

            if (vessels != null)
                return Ok(vessels);
            else
                return Ok();
        }

        // PUT: api/Vessels/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutVessel(int id, Vessel vessel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != vessel.Id)
            {
                return BadRequest();
            }

            db.Entry(vessel).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VesselExists(id))
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

        // POST: api/Vessels
        [ResponseType(typeof(Vessel))]
        public IHttpActionResult PostVessel(Vessel vessel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Vessels.Add(vessel);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = vessel.Id }, vessel);
        }

        // DELETE: api/Vessels/5
        [ResponseType(typeof(Vessel))]
        public IHttpActionResult DeleteVessel(int id)
        {
            Vessel vessel = db.Vessels.Find(id);
            if (vessel == null)
            {
                return NotFound();
            }

            db.Vessels.Remove(vessel);
            db.SaveChanges();

            return Ok(vessel);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool VesselExists(int id)
        {
            return db.Vessels.Count(e => e.Id == id) > 0;
        }

        public void filterRecord(int param1, string type, Vessel vessel, Vessel vessel1, ref Object[] vessels)
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

            var filteredVessels = (from v in db.Vessels
                                          select new
                                          {
                                              v.Id,
                                              v.Name,
                                              v.CreatedByUserId,
                                              v.CreatedDate,
                                              v.LastUpdatedByUserId,
                                              v.LastUpdatedDate,
                                              v.ShippingLineId,
                                              Shippingline = (from s in db.ShippingLines
                                                        where s.Id == v.ShippingLineId
                                                        select new
                                                        {
                                                            s.Id,
                                                            s.Name
                                                        }
                                                       )
                                          })
                                        .Where(v => vessel.Id == null || vessel.Id == 0 ? true : v.Id == vessel.Id)
                                        .Where(v => vessel.ShippingLineId == null || vessel.ShippingLineId == 0 ? true : v.ShippingLineId == vessel.ShippingLineId)
                                        .Where(v => vessel.Name == null ? !vessel.Name.Equals("") : (v.Name.ToLower().Equals(vessel.Name)))
                                        .OrderBy(v => v.Id)
                                        .Skip(skip).Take(pageSize).ToArray();

            vessels = filteredVessels;
        }
    }
}