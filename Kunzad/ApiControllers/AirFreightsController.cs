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
    public class AirFreightsController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private Response response = new Response();
        private int pageSize = AppSettingsGet.PageSize;

        // GET: api/AirFreights
        public IQueryable<AirFreight> GetAirFreights()
        {
            return db.AirFreights
                .Include(a => a.AirLine)
                .Include(a => a.BusinessUnit1)
                .Include(a => a.BusinessUnit)
                .Include(a => a.AirFreightShipments);
        }

        // GET: api/AirFreights/5
        [ResponseType(typeof(AirFreight))]
        public IHttpActionResult GetAirFreight(int id)
        {
            AirFreight airFreight = db.AirFreights.Find(id);
            if (airFreight == null)
            {
                return NotFound();
            }

            return Ok(airFreight);
        }

        // PUT: api/AirFreights/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutAirFreight(int id, AirFreight airFreight)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != airFreight.Id)
            {
                return BadRequest();
            }

            db.Entry(airFreight).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AirFreightExists(id))
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

        // POST: api/AirFreights
        [ResponseType(typeof(AirFreight))]
        public IHttpActionResult PostAirFreight(AirFreight airFreight)
        {
            response.status = "FAILURE";
            //if (!ModelState.IsValid)
            //{
            //    return BadRequest(ModelState);
            //}
            try
            {
                foreach (AirFreightShipment afs in airFreight.AirFreightShipments)
                {
                    afs.CreatedDate = DateTime.Now;
                    db.AirFreightShipments.Add(afs);
                }
                airFreight.CreatedDate = DateTime.Now;
                db.AirFreights.Add(airFreight);
                db.SaveChanges();
                response.status = "SUCCESS";

                response.objParam1 = airFreight;
            }
            catch (Exception e)
            {
                response.message = e.InnerException.InnerException.Message.ToString();
            }
            return Ok(response);
            //return CreatedAtRoute("DefaultApi", new { id = airFreight.Id }, airFreight);
        }

        // DELETE: api/AirFreights/5
        [ResponseType(typeof(AirFreight))]
        public IHttpActionResult DeleteAirFreight(int id)
        {
            AirFreight airFreight = db.AirFreights.Find(id);
            if (airFreight == null)
            {
                return NotFound();
            }

            db.AirFreights.Remove(airFreight);
            db.SaveChanges();

            return Ok(airFreight);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool AirFreightExists(int id)
        {
            return db.AirFreights.Count(e => e.Id == id) > 0;
        }

        public void filterRecord(int param1, string type, AirFreight airFreight, AirFreight airFreight1, ref Object[] airFreights)
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

            var filteredAirFreights = (from af in db.AirFreights
                                       where airFreight.Id == null || airFreight.Id == 0 ? true : af.Id == airFreight.Id
                                       where airFreight.AirWaybillNumber == null ? !airFreight.AirWaybillNumber.Equals("") : (af.AirWaybillNumber.ToLower().Equals(airFreight.AirWaybillNumber) || af.AirWaybillNumber.ToLower().Contains(airFreight.AirWaybillNumber))
                                       where airFreight.AirWaybillDate == null || airFreight.AirWaybillDate == defaultDate ? true : af.AirWaybillDate >= airFreight.AirWaybillDate && af.AirWaybillDate <= airFreight1.AirWaybillDate
                                       //where airFreight.CreatedDate == null || airFreight.CreatedDate == defaultDate ? true : af.CreatedDate >= airFreight.CreatedDate && af.CreatedDate <= airFreight1.CreatedDate
                                       //where airFreight.LastUpdatedDate == null || airFreight.LastUpdatedDate == defaultDate ? true : af.LastUpdatedDate >= airFreight.LastUpdatedDate && af.LastUpdatedDate <= airFreight1.LastUpdatedDate
                                       select new
                                       {
                                           af.Id,
                                           af.AirWaybillNumber,
                                           af.AirWaybillDate,
                                           af.OriginBusinessUnitId,
                                           BusinessUnit1 = (from o in db.BusinessUnits
                                                            where o.Id == af.OriginBusinessUnitId
                                                            select new
                                                            {
                                                                o.Id,
                                                                o.Name
                                                            }

                                                       ),//Origin
                                           af.DestinationBusinessUnitId,
                                           BusinessUnit = (from d in db.BusinessUnits
                                                           where d.Id == af.DestinationBusinessUnitId
                                                           select new
                                                           {
                                                               d.Id,
                                                               d.Name
                                                           }

                                                           ),//Destination
                                           //af.VesselVoyageId,
                                           //VesselVoyage = (from vv in db.VesselVoyages
                                           //                join v in db.Vessels on vv.VesselId equals v.Id
                                           //                join s in db.ShippingLines on v.ShippingLineId equals s.Id
                                           //                where vv.Id == af.VesselVoyageId
                                           //                select new
                                           //                {
                                           //                    ShippingLineName = s.Name,
                                           //                    VesselName = v.Name,
                                           //                    vv.Id,
                                           //                    vv.VoyageNo,
                                           //                    vv.EstimatedArrivalDate,
                                           //                    vv.EstimatedArrivalTime,
                                           //                    vv.DepartureDate,
                                           //                    vv.DepartureTime,
                                           //                    vv.ArrivalDate,
                                           //                    vv.ArrivalTime
                                           //                }
                                           //                ),
                                           af.AirLineId,
                                           Airline = (from a in db.AirLines
                                                      where a.Id == af.AirLineId
                                                      select new { 
                                                        a.Id,
                                                        a.Name
                                                      }
                                                      ),
                                           af.CreatedByUserId,
                                           af.CreatedDate,
                                           af.LastUpdatedByUserId,
                                           af.LastUpdatedDate
                                       })
                                       .OrderBy(af => af.Id).Skip(skip).Take(pageSize).ToArray();

            airFreights = filteredAirFreights;
        }
    }
}