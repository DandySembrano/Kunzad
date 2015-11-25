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

namespace Kunzad.ApiControllers
{
    [AutoInvalidateCacheOutput]
    public class CheckInsController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private Response response = new Response();
        private DbContextTransaction dbTransaction;

        // GET: api/CheckIns
        public IQueryable<CheckIn> GetCheckIns()
        {
            return db.CheckIns;
        }

        // GET: api/CheckIns/5
        [ResponseType(typeof(CheckIn))]
        public IHttpActionResult GetCheckIn(int id)
        {
            CheckIn checkIn = db.CheckIns.Find(id);
            if (checkIn == null)
            {
                return NotFound();
            }

            return Ok(checkIn);
        }

        [HttpGet]
        //Dynamic filtering
        //[CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
        public IHttpActionResult GetCheckIn(string type, int param1, [FromUri]List<CheckIn> checkIn)
        {
            Object[] GetCheckIns = new Object[AppSettingsGet.PageSize];
            this.filterRecord(param1, type, checkIn.ElementAt(0), checkIn.ElementAt(1), ref GetCheckIns);

            if (GetCheckIns != null)
                return Ok(GetCheckIns);
            else
                return Ok();
        }

        // PUT: api/CheckIns/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutCheckIn(int id, CheckIn checkIn)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid || id != checkIn.Id)
            {
                response.message = "Bad request";
                return Ok(response);
            }

            try
            {
                var checkInRecord = db.CheckIns.Find(id);
                db.Entry(checkInRecord).CurrentValues.SetValues(checkIn);
                db.Entry(checkInRecord).State = EntityState.Modified;
                db.SaveChanges();
                response.status = "SUCCESS";
                response.objParam1 = checkIn;
            }
            catch (Exception e)
            {
               response.message = e.Message.ToString();
            }

            return Ok(response);
        }

        // POST: api/CheckIns
        [ResponseType(typeof(CheckIn))]
        public IHttpActionResult PostCheckIn(CheckIn checkIn)
        {
            
            if (!ModelState.IsValid)
            {
                response.status = "FAILURE";
                response.message = "Bad request.";
                return Ok(response);
            }
            try
            {
                response.status = "SUCCESS";
                dbTransaction = db.Database.BeginTransaction();
                db.CheckIns.Add(checkIn);

                //Sea freight arrival
                if (checkIn.CheckInTypeId == 3)
                {
                    var voyage = db.VesselVoyages.Find(checkIn.CheckInSourceId);
                    var voyageEdited = voyage;
                    voyageEdited.ArrivalDate = checkIn.CheckInDate;
                    voyageEdited.ArrivalTime = checkIn.CheckInTime;
                    db.Entry(voyage).CurrentValues.SetValues(voyageEdited);
                    db.Entry(voyage).State = EntityState.Modified;
                }
                //Air freight arrival
                else if (checkIn.CheckInTypeId == 4)
                {
                    var airFreight = db.AirFreights.Find(checkIn.CheckInSourceId);
                    var airFreightEdited = airFreight;
                    airFreightEdited.ArrivalDate = checkIn.CheckInDate;
                    airFreightEdited.ArrivalTime = checkIn.CheckInTime;
                    db.Entry(airFreight).CurrentValues.SetValues(airFreightEdited);
                    db.Entry(airFreight).State = EntityState.Modified;
                }

                db.SaveChanges();

                foreach (CheckInShipment checkInShipments in checkIn.CheckInShipments)
                {
                    checkInShipments.IsDisplay = true;
                    iterateShipment(checkInShipments, checkIn.Id);
                }
                dbTransaction.Commit();
            }
            catch(Exception e)
            {
                response.status = "FAILURE";
                response.message = e.Message.ToString();
            }
            if (response.status != "FAILURE")
                response.objParam1 = checkIn;
            else
                dbTransaction.Rollback();
            dbTransaction.Dispose();
            return Ok(response);
        }

        // DELETE: api/CheckIns/5
        [ResponseType(typeof(CheckIn))]
        public IHttpActionResult DeleteCheckIn(int id)
        {
            CheckIn checkIn = db.CheckIns.Find(id);
            if (checkIn == null)
            {
                return NotFound();
            }

            db.CheckIns.Remove(checkIn);
            db.SaveChanges();

            return Ok(checkIn);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CheckInExists(int id)
        {
            return db.CheckIns.Count(e => e.Id == id) > 0;
        }

        public void iterateShipment(CheckInShipment checkInShipment, int checkInId)
        {

            //Save parent shipment
            if (!checkInShipment.IsDisplay)
            {
                checkInShipment.CheckInId = checkInId;
                db.CheckInShipments.Add(checkInShipment);
                db.SaveChanges();
            }
            //Update parent shipment last check-in id
            var shipment = db.Shipments.Find(checkInShipment.ShipmentId);
            var shipmentEdited = shipment;
            shipment.LastCheckInId = checkInId;
            shipment.LoadingStatusId = (int)Status.LoadingStatus.Open;
            db.Entry(shipment).CurrentValues.SetValues(shipmentEdited);
            db.Entry(shipment).State = EntityState.Modified;
            db.SaveChanges();

            //Save Child  Shipment
            var checkIfParent = db.Shipments.Where(s => s.ParentShipmentId == checkInShipment.ShipmentId).Count();
            if (checkIfParent > 0)
            {
                CheckInShipment childShipmentForCheckIn = new CheckInShipment();

                //Get child shipments
                var childShipments = db.Shipments.Where(s => s.ParentShipmentId == checkInShipment.ShipmentId);
                childShipmentForCheckIn = checkInShipment;
                foreach (Shipment child in childShipments)
                {
                    childShipmentForCheckIn.ShipmentId = child.Id;
                    childShipmentForCheckIn.CheckInId = checkInId;
                    childShipmentForCheckIn.IsDisplay = false;
                    iterateShipment(childShipmentForCheckIn, checkInId);
                }
            }
        }

        public void filterRecord(int param1, string type, CheckIn checkIn, CheckIn checkIn1, ref Object[] checkIns)
        {
            /*
             * If date is not nullable in table equate to "1/1/0001 12:00:00 AM" else null
             * If integer value is not nullable in table equate to 0 else null
             * Use modified date if filtered data type is date
             */
            DateTime defaultDate = new DateTime(0001, 01, 01, 00, 00, 00);
            int skip;
            checkIns = null;
            if (type.Equals("paginate"))
            {
                if (param1 > 1)
                    skip = (param1 - 1) * AppSettingsGet.PageSize;
                else
                    skip = 0;
            }
            else
                skip = param1;

            var filteredCheckIns = db.CheckIns
                 .Include(ci => ci.BusinessUnit)
                 .Include(ci => ci.CheckInType)
                 .Where(ci => checkIn.Id == null || checkIn.Id == 0 ? true : ci.Id == checkIn.Id)
                 .Where(ci => checkIn.CheckInSourceId == null ? true : ci.CheckInSourceId == checkIn.CheckInSourceId)
                 .Where(ci => checkIn.CheckInDate == null || checkIn.CheckInDate == defaultDate ? true : ci.CheckInDate >= checkIn.CheckInDate && ci.CheckInDate <= checkIn1.CheckInDate)
                 .Where(ci => checkIn.CheckInTypeId == null || checkIn.CheckInTypeId == 0 ? true : ci.CheckInTypeId == checkIn.CheckInTypeId)
                 .Where(ci => checkIn.CheckInBusinessUnitId == null || checkIn.CheckInBusinessUnitId == 0 ? true : ci.CheckInBusinessUnitId == checkIn.CheckInBusinessUnitId)
                 .Where(ci => checkIn.Status == null || checkIn.Status == 0 ? true : ci.Status == checkIn.Status)
                 .OrderBy(ci => ci.Id)
                 .Skip(skip).Take(AppSettingsGet.PageSize).AsNoTracking().ToArray();
            checkIns = filteredCheckIns;
        }
    }
}