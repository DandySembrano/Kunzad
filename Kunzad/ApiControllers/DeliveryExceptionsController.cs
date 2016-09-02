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
using Kunzad.ActionFilters;

namespace Kunzad.ApiControllers
{
    [AuthorizationRequired]
    public class DeliveryExceptionsController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private DbContextTransaction transaction;
        private Response response = new Response();
        private int pageSize = AppSettingsGet.PageSize;

        // GET: api/DeliveryExceptions
        public IQueryable<DeliveryException> GetDeliveryExceptions()
        {
            return db.DeliveryExceptions;
        }

        // GET: api/DeliveryExceptions/5
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

        //  GET: api/DeliveryExceptions?shipmentId=1&page=1
        public IHttpActionResult GetDeliveryException(int shipmentId, int page)
        {
            int skip;
            if (page > 1)
                skip = (page - 1) * pageSize;
            else
                skip = 0;

            var deliveryException = db.DeliveryExceptions
                .Include(de => de.DeliveryExceptionType)
                .Where(de => de.ShipmentId == shipmentId)
                .OrderBy(de => de.Id)
                .Skip(skip).Take(pageSize).AsNoTracking().ToArray();

            return Ok(deliveryException);
        }

        // PUT: api/DeliveryExceptions/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutDeliveryException(int id, List<DeliveryException> deliveryException)
        {
            int DexShipmentId = 0;
            response.status = "FAILURE";
            bool flag;
            if (!ModelState.IsValid)
            {
                response.message = "Bad request.";
                return Ok(response);
            }
            try
            {
                transaction = db.Database.BeginTransaction();
                DexShipmentId = deliveryException.FirstOrDefault().ShipmentId;

                Shipment shipment = db.Shipments.Find(DexShipmentId);

                CheckIn checkIn = new CheckIn();
                CheckInShipment checkInShipment = new CheckInShipment();
                CheckInsController checkInCtrl = new CheckInsController();

                var currentShipmentDex = db.DeliveryExceptions
                                         .Where(de => de.ShipmentId == DexShipmentId).ToArray();
                
                //DEX that are removed
                foreach(DeliveryException currentDex in currentShipmentDex)
                {
                    flag = false;
                    foreach(DeliveryException newDex in deliveryException)
                    {
                        if(currentDex.Id == newDex.Id)
                        {
                            flag = true;
                            break;
                        }
                    }
                    if (!flag)
                    {
                        var checkInHolder = db.CheckIns
                                            .Where(ci => ci.CheckInSourceId == currentDex.Id);
                        if (checkInHolder.Count() > 0)
                        {
                            foreach (CheckIn check in checkInHolder)
                                db.CheckIns.Remove(check);
                        }
                        db.DeliveryExceptions.Remove(currentDex);

                        db.SaveChanges();
                    }
                }
                //adding or updating DEX
                foreach (DeliveryException newDex in deliveryException)
                {
                    flag = false;
                    foreach (DeliveryException currentDex in currentShipmentDex)
                    {
                        if (newDex.Id == currentDex.Id)
                        {
                            flag = true;
                            //Set DEX changes
                            var dexHolder = db.DeliveryExceptions.Find(currentDex.Id);
                            currentDex.LastUpdatedDate = DateTime.Now;
                            db.Entry(dexHolder).CurrentValues.SetValues(currentDex);
                            db.Entry(dexHolder).State = EntityState.Modified;

                            db.SaveChanges();
                            break;
                        }
                    }
                    if (!flag)
                    {
                        //add new DEX
                        newDex.CreatedDate = DateTime.Now;

                        db.DeliveryExceptions.Add(newDex);
                        db.SaveChanges();

                        checkIn.CheckInTypeId = 6; //Delivery Exception
                        checkIn.CheckInDate = DateTime.Now;
                        checkIn.CheckInBusinessUnitId = shipment.BusinessUnitId;
                        checkIn.CheckInSourceId = newDex.Id;
                        db.CheckIns.Add(checkIn);

                        //checkInShipment.CheckInId = checkIn.Id;
                        checkInShipment.ShipmentId = DexShipmentId;
                        checkInShipment.IsDisplay = true;
                        db.CheckInShipments.Add(checkInShipment);

                        db.SaveChanges();
                        checkInCtrl.iterateShipment(checkInShipment, checkIn.Id, checkIn.CheckInTypeId);
                    }
                }

                transaction.Commit();

                response.status = "SUCCESS";
                response.objParam1 = deliveryException;
            }
            catch (Exception e)
            {
                response.message = e.InnerException.InnerException.Message.ToString();
                transaction.Rollback();
            }
            //catch (System.Data.Entity.Validation.DbEntityValidationException dbEx)
            //{
            //    Exception raise = dbEx;
            //    foreach (var validationErrors in dbEx.EntityValidationErrors)
            //    {
            //        foreach (var validationError in validationErrors.ValidationErrors)
            //        {
            //            string message = string.Format("{0}:{1}",
            //                validationErrors.Entry.Entity.ToString(),
            //                validationError.ErrorMessage);
            //            // raise a new exception nesting
            //            // the current instance as InnerException
            //            raise = new InvalidOperationException(message, raise);
            //        }
            //    }
            //    throw raise;
            //}
            transaction.Dispose();
            return Ok(response);
            
        }

        // POST: api/DeliveryExceptions
        [ResponseType(typeof(DeliveryException))]
        public IHttpActionResult PostDeliveryException(DeliveryException deliveryException)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.DeliveryExceptions.Add(deliveryException);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = deliveryException.Id }, deliveryException);

            //int DexShipmentId = 0;
            //response.status = "FAILURE";
            //if (!ModelState.IsValid)
            //{
            //    response.message = "Bad request.";
            //    return Ok(response);
            //}
            //try
            //{
            //    transaction = db.Database.BeginTransaction();
            //    DexShipmentId = deliveryException.FirstOrDefault().ShipmentId;

            //    Shipment shipment = db.Shipments.Find(DexShipmentId);

            //    CheckIn checkIn = new CheckIn();
            //    CheckInShipment checkInShipment = new CheckInShipment();
            //    CheckInsController checkInCtrl = new CheckInsController();

            //    foreach(DeliveryException de in deliveryException)
            //    {
            //        de.CreatedDate = DateTime.Now;
                    
            //        db.DeliveryExceptions.Add(de);

            //        checkIn.CheckInTypeId = 6; //Delivery Exception
            //        checkIn.CheckInDate = DateTime.Now;
            //        checkIn.CheckInBusinessUnitId = shipment.BusinessUnitId;
            //        checkIn.CheckInSourceId = de.Id;
            //        db.CheckIns.Add(checkIn);

            //        //checkInShipment.CheckInId = checkIn.Id;
            //        checkInShipment.ShipmentId = DexShipmentId;
            //        checkInShipment.IsDisplay = true;
            //        db.CheckInShipments.Add(checkInShipment);

            //        checkInCtrl.iterateShipment(checkInShipment, checkIn.Id);

            //    }


            //    db.SaveChanges();


            //    transaction.Commit();

            //    response.status = "SUCCESS";
            //    response.objParam1 = deliveryException;
            //}
            ////catch (Exception e)
            ////{
            ////    response.message = e.InnerException.InnerException.Message.ToString();
            ////    transaction.Rollback();
            ////}
            //catch (System.Data.Entity.Validation.DbEntityValidationException dbEx)
            //{
            //    Exception raise = dbEx;
            //    foreach (var validationErrors in dbEx.EntityValidationErrors)
            //    {
            //        foreach (var validationError in validationErrors.ValidationErrors)
            //        {
            //            string message = string.Format("{0}:{1}",
            //                validationErrors.Entry.Entity.ToString(),
            //                validationError.ErrorMessage);
            //            // raise a new exception nesting
            //            // the current instance as InnerException
            //            raise = new InvalidOperationException(message, raise);
            //        }
            //    }
            //    throw raise;
            //}

            //return Ok(response);
        }

        // DELETE: api/DeliveryExceptions/5
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