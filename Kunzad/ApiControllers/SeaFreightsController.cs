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
        private int pageSize = AppSettingsGet.PageSize;
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
                            .Include(s => s.BusinessUnit1)
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
                seafreight[i].BusinessUnit1.AirFreights = null;
                seafreight[i].BusinessUnit1.AirFreights1 = null;
                seafreight[i].BusinessUnit1.BusinessUnitContacts = null;
                seafreight[i].BusinessUnit1.BusinessUnitType = null;
                seafreight[i].BusinessUnit1.CourierTransactions = null;
                seafreight[i].BusinessUnit1.Shipments = null;
                seafreight[i].BusinessUnit1.SeaFreights = null;
                seafreight[i].BusinessUnit1.SeaFreights1 = null;
                seafreight[i].VesselVoyage.SeaFreights = null;
                seafreight[i].VesselVoyage.Vessel.VesselVoyages = null;
                seafreight[i].VesselVoyage.Vessel.ShippingLine.Vessels = null;

            }
            if (page > 1)
                return Ok(seafreight.Skip((page - 1) * pageSize).Take(pageSize));
            else
                return Ok(seafreight.Take(pageSize));
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

        [HttpGet]
        //Dynamic Filtering
        public IHttpActionResult GetSeaFreight(string type, int param1,[FromUri]List<SeaFreight> seaFreight) 
        {
            Object[] seaFreights = new Object[pageSize];
            this.filterRecord(param1, type, seaFreight.ElementAt(0),seaFreight.ElementAt(1),ref seaFreights);

            if (seaFreights != null)
                return Ok(seaFreights);
            else
                return Ok();
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

        public void filterRecord(int param1, string type, SeaFreight seaFreight, SeaFreight seaFreight1, ref Object[] seaFreights) 
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

            var filteredSeaFreights = (from sf in db.SeaFreights
                                       where seaFreight.Id == null || seaFreight.Id == 0 ? true : sf.Id == seaFreight.Id
                                       where seaFreight.BLNumber == null ? !seaFreight.BLNumber.Equals("") : (sf.BLNumber.ToLower().Equals(seaFreight.BLNumber) || sf.BLNumber.ToLower().Contains(seaFreight.BLNumber))
                                       where seaFreight.BLDate == null || seaFreight.BLDate == defaultDate ? true : sf.BLDate >= seaFreight.BLDate && sf.BLDate <= seaFreight1.BLDate
                                       where seaFreight.CreatedDate == null || seaFreight.CreatedDate == defaultDate ? true : sf.CreatedDate >= seaFreight.CreatedDate && sf.CreatedDate <= seaFreight1.CreatedDate
                                       where seaFreight.LastUpdatedDate == null || seaFreight.LastUpdatedDate == defaultDate ? true : sf.LastUpdatedDate >= seaFreight.LastUpdatedDate && sf.LastUpdatedDate <= seaFreight1.LastUpdatedDate
                                       select new {
                                                        sf.Id,
                                                        sf.BLNumber,
                                                        sf.BLDate,
                                                        sf.OriginBusinessUnitId,
                                                        BusinessUnit1 = (from o in db.BusinessUnits 
                                                                    where o.Id == sf.OriginBusinessUnitId
                                                                    select new {
                                                                        o.Id,
                                                                        o.Name
                                                                    }

                                                                    ),//Origin
                                                        sf.DestinationBusinessUnitId,
                                                        BusinessUnit = (from d in db.BusinessUnits 
                                                                        where d.Id == sf.DestinationBusinessUnitId
                                                                        select new {
                                                                            d.Id,
                                                                            d.Name
                                                                        }

                                                                        ),//Destination
                                                        sf.VesselVoyageId,
                                                        VesselVoyage = (from vv in db.VesselVoyages 
                                                                            join v in db.Vessels on vv.VesselId equals v.Id 
                                                                                join s in db.ShippingLines on v.ShippingLineId equals s.Id
                                                                            where vv.Id == sf.VesselVoyageId
                                                                            select new {
                                                                                ShippingLineName = s.Name,
                                                                                VesselName = v.Name,
                                                                                vv.Id,
                                                                                vv.VoyageNo,
                                                                                vv.EstimatedArrivalDate,
                                                                                vv.EstimatedArrivalTime,
                                                                                vv.DepartureDate,
                                                                                vv.DepartureTime,
                                                                                vv.ArrivalDate,
                                                                                vv.ArrivalTime
                                                                            }
                                                                        ), 
                                                        sf.FreightCost,
                                                        sf.CreatedByUserId,
                                                        sf.CreatedDate,
                                                        sf.LastUpdatedByUserId,
                                                        sf.LastUpdatedDate
                                       })
                                       .OrderBy(sf => sf.Id).Skip(skip).Take(pageSize).ToArray();

            seaFreights = filteredSeaFreights;
        }
    }
}