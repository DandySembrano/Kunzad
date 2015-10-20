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
    public class CourierTransactionsController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private Response response = new Response();
        // GET: api/CourierTransactions
        public IQueryable<CourierTransaction> GetCourierTransactions()
        {
            return db.CourierTransactions;
        }

        // GET: api/CourierTransactions/5
        [ResponseType(typeof(CourierTransaction))]
        public IHttpActionResult GetCourierTransaction(int id)
        {
            CourierTransaction courierTransaction = db.CourierTransactions.Find(id);
            if (courierTransaction == null)
            {
                return NotFound();
            }

            return Ok(courierTransaction);
        }

        [HttpGet]
        //Dynamic filtering
        public IHttpActionResult GetCourierTransaction(string type, int param1, [FromUri]List<CourierTransaction> courierTransaction)
        {
            Object[] courierTransactions = new Object[AppSettingsGet.PageSize];
            this.filterRecord(param1, type, courierTransaction.ElementAt(0), courierTransaction.ElementAt(1), ref courierTransactions);

            if (courierTransactions != null)
                return Ok(courierTransactions);
            else
                return Ok();
        }

        // PUT: api/CourierTransactions/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutCourierTransaction(int id, CourierTransaction courierTransaction)
        {
            response.status = "FAILURE";
            if (courierTransaction.CourierTransactionDetails.ElementAt(0).Id != 0)
            {
                if ((!ModelState.IsValid || id != courierTransaction.Id))
                {
                    response.message = "Bad request.";
                    return Ok(response);
                }
            }

            try
            {
                bool flag;
                var currentCourierTransactionDetails = db.CourierTransactionDetails.Where(ctd => ctd.CourierTransactionId == courierTransaction.Id);
                foreach (CourierTransactionDetail ctd in currentCourierTransactionDetails)
                {
                    flag = false;
                    //check if current Courier Transaction Details exist in truck list
                    foreach (CourierTransactionDetail ctd1 in courierTransaction.CourierTransactionDetails)
                    {
                        if (ctd.Id == ctd1.Id)
                        {
                            flag = true;
                            break;
                        }
                    }
                    if (!flag)
                    {
                        //Update shipment status to Open
                        var shipment = db.Shipments.Find(ctd.ShipmentId);
                        var shipmentEdited = shipment;
                        shipmentEdited.LoadingStatusId = (int)Status.LoadingStatus.Open;
                        //remove deleted Courier Transaction Detail(s)
                        db.CourierTransactionDetails.Remove(ctd);
                    }
                }

                foreach (CourierTransactionDetail ctd in courierTransaction.CourierTransactionDetails)
                {
                    flag = false;
                    foreach (CourierTransactionDetail ctd1 in currentCourierTransactionDetails)
                    {
                        if (ctd.Id == ctd1.Id)
                        {
                            flag = true;

                            //Set changes for courier transaction detail info for edit
                            var courierTransactionDetailHolder = db.CourierTransactionDetails.Find(ctd.Id);
                            ctd.LastUpdatedDate = DateTime.Now;
                            db.Entry(courierTransactionDetailHolder).CurrentValues.SetValues(ctd);
                            db.Entry(courierTransactionDetailHolder).State = EntityState.Modified;
                            break;
                        }
                    }
                    //add courier transaction detail
                    if (!flag && ctd.ShipmentId != 0)
                    {
                        ctd.CreatedDate = DateTime.Now;
                        db.CourierTransactionDetails.Add(ctd);
                        //Update shipment loading status to Loaded
                        var shipment = db.Shipments.Find(ctd.ShipmentId);
                        var shipmentEdited = shipment;
                        shipmentEdited.LoadingStatusId = (int)Status.LoadingStatus.Loaded;
                        db.Entry(shipment).CurrentValues.SetValues(shipmentEdited);
                        db.Entry(shipment).State = EntityState.Modified;
                    }
                }

                //Set changes for courier transaction info
                var courierTransactionHolder = db.CourierTransactions.Find(courierTransaction.Id);
                courierTransaction.LastUpdatedDate = DateTime.Now;
                db.Entry(courierTransactionHolder).CurrentValues.SetValues(courierTransaction);
                db.Entry(courierTransactionHolder).State = EntityState.Modified;

                db.SaveChanges();
                response.status = "SUCCESS";
                response.objParam1 = courierTransaction;
            }
            catch (Exception e)
            {
                if (!CourierTransactionExists(id))
                {
                    response.message = "Courier Transaction doesn't exist.";
                }
                else
                {
                    response.message = e.ToString();
                }
            }

            return Ok(response);
        }

        // POST: api/CourierTransactions
        [ResponseType(typeof(CourierTransaction))]
        public IHttpActionResult PostCourierTransaction(CourierTransaction courierTransaction)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad request.";
                return Ok(response);
            }
            try
            {
                courierTransaction.CreatedDate = DateTime.Now;
                db.CourierTransactions.Add(courierTransaction);

                foreach (CourierTransactionDetail ctd in courierTransaction.CourierTransactionDetails)
                {
                    ctd.CreatedDate = DateTime.Now;
                    db.CourierTransactionDetails.Add(ctd);

                    //Update shipment loading status to Loaded
                    var shipment = db.Shipments.Find(ctd.ShipmentId);
                    var shipmentEdited = shipment;
                    shipmentEdited.LoadingStatusId = (int)Status.LoadingStatus.Loaded;
                    db.Entry(shipment).CurrentValues.SetValues(shipmentEdited);
                    db.Entry(shipment).State = EntityState.Modified;
                }

                db.SaveChanges();
                response.status = "SUCCESS";
                response.objParam1 = courierTransaction;
            }
            catch (Exception e) {
                response.message = e.InnerException.InnerException.Message.ToString();
            }
            return Ok(response);
        }

        // DELETE: api/CourierTransactions/5
        [ResponseType(typeof(CourierTransaction))]
        public IHttpActionResult DeleteCourierTransaction(int id)
        {
            CourierTransaction courierTransaction = db.CourierTransactions.Find(id);
            if (courierTransaction == null)
            {
                return NotFound();
            }

            db.CourierTransactions.Remove(courierTransaction);
            db.SaveChanges();

            return Ok(courierTransaction);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CourierTransactionExists(int id)
        {
            return db.CourierTransactions.Count(e => e.Id == id) > 0;
        }

        public void filterRecord(int param1, string type, CourierTransaction courierTransaction, CourierTransaction courierTransaction1, ref Object[] courierTransactions)
        {
            /*
             * If date is not nullable in table equate to "1/1/0001 12:00:00 AM" else null
             * If integer value is not nullable in table equate to 0 else null
             * Use modified date if filtered data type is date
             */
            DateTime defaultDate = new DateTime(0001, 01, 01, 00, 00, 00);
            int skip;
            courierTransactions = null;
            if (type.Equals("paginate"))
            {
                if (param1 > 1)
                    skip = (param1 - 1) * AppSettingsGet.PageSize;
                else
                    skip = 0;
            }
            else
                skip = param1;

            var filteredCtrans = (from ct in db.CourierTransactions
                                  where courierTransaction.Id == null || courierTransaction.Id == 0 ? true : ct.Id == courierTransaction.Id
                                  where courierTransaction.CreatedDate == null || courierTransaction.CreatedDate == defaultDate ? true : ct.CreatedDate >= courierTransaction.CreatedDate && ct.CreatedDate <= courierTransaction1.CreatedDate
                                  where courierTransaction.CourierId == null || courierTransaction.CourierId == 0 ? true : ct.CourierId == courierTransaction.CourierId
                                  where courierTransaction.BusinessUnitId == null || courierTransaction.BusinessUnitId == 0 ? true : ct.BusinessUnitId == courierTransaction.BusinessUnitId
                                  where courierTransaction.CallDate == null || courierTransaction.CallDate == defaultDate ? true : ct.CallDate >= courierTransaction.CallDate && ct.CallDate <= courierTransaction1.CallDate
                                  select new {
                                      ct.Id,
                                      ct.CourierId,
                                      ct.BusinessUnitId,
                                      ct.CourierCost,
                                      ct.CallDate,
                                      ct.CallTime,
                                      ct.CompletedDate,
                                      ct.CompletedTime,
                                      ct.CreatedDate,
                                      Courier = (from c in db.Couriers where c.Id == ct.CourierId select c),
                                      BusinessUnit = (from bu in db.BusinessUnits where bu.Id == ct.BusinessUnitId select bu)
                                  }).OrderBy(ct => ct.Id).Skip(skip).Take(AppSettingsGet.PageSize).ToArray();
            courierTransactions = filteredCtrans;
        }
    }
}