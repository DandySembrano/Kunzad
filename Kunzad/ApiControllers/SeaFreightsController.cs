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
    public class SeaFreightsController : ApiController
    {   
        private KunzadDbEntities db = new KunzadDbEntities();
        private Response response = new Response();
        private int pageSize = 20;
        // GET: api/SeaFreights
        public IQueryable<SeaFreight> GetSeaFreights()
        {
            return db.SeaFreights;
        }
        // GET: api/SeaFreights?page=1
        public IHttpActionResult GetSeafreights(int page)
        {

            var seafreight = db.SeaFreights
                            .Include(s => s.BusinessUnit)
                            .Include(s => s.VesselVoyage)
                            .Include(s => s.VesselVoyage.Vessel.ShippingLine)
                            .ToArray();
            if (seafreight.Length == 0)
                return Ok(seafreight);
            for (int i = 0; i < seafreight.Length; i++)
            {
                seafreight[i].BusinessUnit.AirFreights = null;
                seafreight[i].BusinessUnit.AirFreights1 = null;
                seafreight[i].BusinessUnit.BusinessUnitContacts = null;
                seafreight[i].BusinessUnit.BusinessUnitType = null;
                seafreight[i].BusinessUnit.CourierTransactions = null;
                seafreight[i].BusinessUnit.Shipments = null;
                seafreight[i].BusinessUnit.SeaFreights = null;
                seafreight[i].BusinessUnit.SeaFreights1 = null;
                seafreight[i].VesselVoyage.SeaFreights = null;
                seafreight[i].VesselVoyage.Vessel.VesselVoyages = null;
                seafreight[i].VesselVoyage.Vessel.ShippingLine.Vessels = null;

            }
            if (page > 1)
                return Ok(seafreight.Skip((page - 1) * pageSize).Take(pageSize));
            else
                return Ok(seafreight.Take(pageSize));
            //var seafreight = db.SeaFreights.ToArray();
            //if (seafreight.Length <= 0)
            //{
            //    return Ok(seafreight);
            //}
            //db.Entry(seafreight[0]).Reference(s => s.BusinessUnit).Load();
            //db.Entry(seafreight[0]).Reference(s => s.BusinessUnit1).Load();
            //db.Entry(seafreight[0]).Reference(s => s.VesselVoyage).Load();

            //if (page > 1)
            //    return Ok(seafreight.Skip((page - 1) * pageSize).Take(pageSize));
            //else
            //    return Ok(seafreight.Take(pageSize));
        }
        // GET: api/SeaFreights/5
        [ResponseType(typeof(SeaFreight))]
        public IHttpActionResult GetSeaFreight(int id)
        {
            SeaFreight seaFreight = db.SeaFreights.Find(id);
            db.Entry(seaFreight).Reference(c => c.BusinessUnit).Load();

            if (seaFreight == null)
            {
                return NotFound();
            }

            return Ok(seaFreight);
        }

        // PUT: api/SeaFreights/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutSeaFreight(int id, SeaFreight seaFreight)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != seaFreight.Id)
            {
                return BadRequest();
            }

            db.Entry(seaFreight).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SeaFreightExists(id))
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

        // POST: api/SeaFreights
        [ResponseType(typeof(SeaFreight))]
        public IHttpActionResult PostSeaFreight(SeaFreight seaFreight)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad request.";
                return Ok(response);
            }
            try
            {
                foreach (SeaFreightShipment sfs in seaFreight.SeaFreightShipments)
                {
                    sfs.CreatedDate = DateTime.Now;
                    db.SeaFreightShipments.Add(sfs);
                }
                seaFreight.CreatedDate = DateTime.Now;
                db.SeaFreights.Add(seaFreight);
                db.SaveChanges();
                response.status = "SUCCESS";
                
                response.objParam1 = seaFreight;
            }
            catch (Exception e)
            {
                response.message = e.InnerException.InnerException.Message.ToString();
            }
            return Ok(response);
            //if (!ModelState.IsValid)
            //{
            //    return BadRequest(ModelState);
            //}

            //db.SeaFreights.Add(seaFreight);
            //db.SaveChanges();

            //return CreatedAtRoute("DefaultApi", new { id = seaFreight.Id }, seaFreight);
        }

        // DELETE: api/SeaFreights/5
        [ResponseType(typeof(SeaFreight))]
        public IHttpActionResult DeleteSeaFreight(int id)
        {
            SeaFreight seaFreight = db.SeaFreights.Find(id);
            if (seaFreight == null)
            {
                return NotFound();
            }

            db.SeaFreights.Remove(seaFreight);
            db.SaveChanges();

            return Ok(seaFreight);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SeaFreightExists(int id)
        {
            return db.SeaFreights.Count(e => e.Id == id) > 0;
        }
    }
}