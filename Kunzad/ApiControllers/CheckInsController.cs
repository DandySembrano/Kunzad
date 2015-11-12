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
    public class CheckInsController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private Response response = new Response();
        private DbContextTransaction dbTransaction;
        private int lastCheckInId = 0;
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
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != checkIn.Id)
            {
                return BadRequest();
            }

            db.Entry(checkIn).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CheckInExists(id))
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

        // POST: api/CheckIns
        [ResponseType(typeof(CheckIn))]
        public IHttpActionResult PostCheckIn(CheckIn checkIn)
        {
            
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                response.status = "SUCCESS";
                dbTransaction = db.Database.BeginTransaction();
                checkInShipment(checkIn, "Dummy");
                dbTransaction.Commit();
                if (response.status != "FAILURE")
                    response.objParam1 = checkIn;
            }
            catch(Exception e)
            {
                dbTransaction.Rollback();
                response.status = "FAILURE";
                response.message = e.InnerException.InnerException.Message.ToString();
            }

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

        public void checkInShipment(CheckIn checkIn, string dummy)
        {
            //Save Parent Shipment
            if (checkIn.CheckInTypeId == 1) //CheckInTypeId for seafreight is 1
            {
                //get seaFreightId
                var getSeaFreight = db.SeaFreightShipments.Where(sfs => sfs.ShipmentId == checkIn.ShipmentId).ToArray();
                if (getSeaFreight.Length == 0) {
                    response.message = "Please cargo load shipment in Sea Freight module under Transport.";
                    response.status = "FAILURE";
                    return;
                }
                var checkInSourceId = getSeaFreight.ElementAt(0).SeaFreightId;
                checkIn.CheckInSourceId = checkInSourceId;
                //Save parent shipment
                db.CheckIns.Add(checkIn);
                db.SaveChanges();
                lastCheckInId = checkIn.Id;

                //Update parent shipment last check-in id
                var shipment = db.Shipments.Find(checkIn.ShipmentId);
                var shipmentEdited = shipment;
                shipment.LastCheckInId = lastCheckInId;
                shipment.LoadingStatusId = (int)Status.LoadingStatus.Open;
                db.Entry(shipment).CurrentValues.SetValues(shipmentEdited);
                db.Entry(shipment).State = EntityState.Modified;
                db.SaveChanges();
            }

            //Save Child  Shipment
            var checkIfParent = db.Shipments.Where(s => s.ParentShipmentId == checkIn.ShipmentId).Count();
            if (checkIfParent > 0)
            {
                CheckIn childShipmentForCheckIn = new CheckIn();
                childShipmentForCheckIn = checkIn;
                //Get child shipments in consolidation
                var childShipments = db.Shipments.Where(s => s.ParentShipmentId == checkIn.ShipmentId);

                foreach (Shipment child in childShipments)
                {
                    childShipmentForCheckIn.ShipmentId = child.Id;
                    checkInShipment(childShipmentForCheckIn, "Dummy");
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
                .Include(ci => ci.Shipment.Address.CityMunicipality.StateProvince)
                .Include(ci => ci.Shipment.Address1)
                .Include(ci => ci.Shipment.Address1.CityMunicipality.StateProvince)
                .Include(ci => ci.Shipment.BusinessUnit)
                .Include(ci => ci.Shipment.BusinessUnit1)
                .Include(ci => ci.Shipment.Service)
                .Include(ci => ci.Shipment.ShipmentType)
                .Include(ci => ci.Shipment.Customer)
                .Include(ci => ci.Shipment.Customer.CustomerAddresses)
                .Include(ci => ci.Shipment.Customer.CustomerAddresses.Select(ca => ca.CityMunicipality))
                .Include(ci => ci.Shipment.Customer.CustomerAddresses.Select(ca => ca.CityMunicipality.StateProvince))
                .Include(ci => ci.Shipment.Customer.CustomerContacts)
                .Include(ci => ci.Shipment.Customer.CustomerContacts.Select(cc => cc.Contact))
                .Include(ci => ci.Shipment.Customer.CustomerContacts.Select(cc => cc.Contact.ContactPhones))
                .Where(ci => checkIn.Id == null || checkIn.Id == 0 ? true : ci.Id == checkIn.Id)
                .Where(ci => checkIn.CheckInDate == null || checkIn.CheckInDate == defaultDate ? true : ci.CheckInDate >= checkIn.CheckInDate && ci.CheckInDate <= checkIn1.CheckInDate)
                .Where(ci => checkIn.CheckInTypeId == null || checkIn.CheckInTypeId == 0 ? true : ci.CheckInTypeId == checkIn.CheckInTypeId)
                .Where(ci => checkIn.CheckInBusinessUnitId == null || checkIn.CheckInBusinessUnitId == 0 ? true : ci.CheckInBusinessUnitId == checkIn.CheckInBusinessUnitId)
                .Where(ci => checkIn.ShipmentId == null || checkIn.ShipmentId == 0 ? true : ci.ShipmentId == checkIn.ShipmentId)
                .OrderBy(ci => ci.Id)
                .Skip(skip).Take(AppSettingsGet.PageSize).AsNoTracking().ToArray();
            checkIns = filteredCheckIns;
        }
    }
}