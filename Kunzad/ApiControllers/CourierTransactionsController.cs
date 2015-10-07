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
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != courierTransaction.Id)
            {
                return BadRequest();
            }

            db.Entry(courierTransaction).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CourierTransactionExists(id))
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