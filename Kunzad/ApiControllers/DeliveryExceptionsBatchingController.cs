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
    public class DeliveryExceptionsBatchingController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private DbContextTransaction dbTransaction;
        private Response response = new Response();

        // GET: api/DeliveryExceptionsBatching
        public IQueryable<DeliveryException> GetDeliveryExceptions()
        {
            return db.DeliveryExceptions;
        }

        // GET: api/DeliveryExceptionsBatching/5
        [ResponseType(typeof(DeliveryException))]
        public IHttpActionResult GetDeliveryException(int id)
        {
            DeliveryException deliveryException = db.DeliveryExceptions.Find(id);
            if (deliveryException == null)
            {
                return NotFound();
            }

            return Ok(deliveryException);
        }

        // PUT: api/DeliveryExceptionsBatching/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutDeliveryException(int id, DeliveryException deliveryException)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != deliveryException.Id)
            {
                return BadRequest();
            }

            db.Entry(deliveryException).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DeliveryExceptionExists(id))
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

        // POST: api/DeliveryExceptionsBatching
        [ResponseType(typeof(DeliveryException))]
        public IHttpActionResult PostDeliveryException(List<DeliveryException> deliveryException)
        {
            dbTransaction = db.Database.BeginTransaction();
            foreach (DeliveryException de in deliveryException)
            {
                de.CreatedDate = DateTime.Now;
                db.DeliveryExceptions.Add(de);
                db.SaveChanges();

                CheckIn checkIn = new CheckIn();
                CheckInShipment checkInShipment = new CheckInShipment();
                Shipment shipment = db.Shipments.Find(de.ShipmentId);

                checkIn.CheckInDate = DateTime.Now;
                checkIn.CheckInTime = DateTime.Now.TimeOfDay;
                checkIn.CheckInTypeId = 6;
                checkIn.CheckInBusinessUnitId = shipment.BusinessUnitId;
                checkIn.CheckInSourceId = de.Id;
                checkIn.Remarks = "Delivery Exception";
                //Initialize check in  checkin shipment
                checkInShipment.ShipmentId = shipment.Id;
                checkInShipment.IsDisplay = true;

                db.CheckIns.Add(checkIn);
                checkIn.CheckInShipments.Add(checkInShipment);
                db.SaveChanges();

                iterateShipment(checkInShipment, checkIn.Id);

            }
            
            dbTransaction.Commit();
            dbTransaction.Dispose();
            return Ok();
        }

        // DELETE: api/DeliveryExceptionsBatching/5
        [ResponseType(typeof(DeliveryException))]
        public IHttpActionResult DeleteDeliveryException(int id)
        {
            DeliveryException deliveryException = db.DeliveryExceptions.Find(id);
            if (deliveryException == null)
            {
                return NotFound();
            }

            db.DeliveryExceptions.Remove(deliveryException);
            db.SaveChanges();

            return Ok(deliveryException);
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

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool DeliveryExceptionExists(int id)
        {
            return db.DeliveryExceptions.Count(e => e.Id == id) > 0;
        }
    }
}