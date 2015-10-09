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
    public class CourierTransactionDetailsController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();

        // GET: api/CourierTransactionDetails
        public IQueryable<CourierTransactionDetail> GetCourierTransactionDetails()
        {
            return db.CourierTransactionDetails;
        }

        // GET: api/CourierTransactionDetails/5
        [ResponseType(typeof(CourierTransactionDetail))]
        public IHttpActionResult GetCourierTransactionDetail(int id)
        {
            CourierTransactionDetail courierTransactionDetail = db.CourierTransactionDetails.Find(id);
            if (courierTransactionDetail == null)
            {
                return NotFound();
            }

            return Ok(courierTransactionDetail);
        }

        // GET: api/CourierTransactionDetails?length=0&masterId=1
        public IHttpActionResult GetCourierTransactionDetails(int length, int masterId) {
            var ctd = db.CourierTransactionDetails
                        .Include(ctd1 => ctd1.Shipment)
                        .Include(ctd1 => ctd1.Shipment.Address.CityMunicipality.StateProvince)
                        .Include(ctd1 => ctd1.Shipment.Address1)
                        .Include(ctd1 => ctd1.Shipment.Address1.CityMunicipality.StateProvince)
                        .Include(ctd1 => ctd1.Shipment.BusinessUnit)
                        .Include(ctd1 => ctd1.Shipment.BusinessUnit1)
                        .Include(ctd1 => ctd1.Shipment.Service)
                        .Include(ctd1 => ctd1.Shipment.ShipmentType)
                        .Include(ctd1 => ctd1.Shipment.Customer)
                        .Include(ctd1 => ctd1.Shipment.Customer.CustomerAddresses)
                        .Include(ctd1 => ctd1.Shipment.Customer.CustomerAddresses.Select(ca => ca.CityMunicipality))
                        .Include(ctd1 => ctd1.Shipment.Customer.CustomerAddresses.Select(ca => ca.CityMunicipality.StateProvince))
                        .Include(ctd1 => ctd1.Shipment.Customer.CustomerContacts)
                        .Include(ctd1 => ctd1.Shipment.Customer.CustomerContacts.Select(cc => cc.Contact))
                        .Include(ctd1 => ctd1.Shipment.Customer.CustomerContacts.Select(cc => cc.Contact.ContactPhones))
                        .Where(ctd1 => ctd1.CourierTransactionId == masterId)
                        .OrderBy(ctd1 => ctd1.Id)
                        .Skip(length).Take(AppSettingsGet.PageSize)
                        .AsNoTracking().ToArray();
            return Ok(ctd);
        }

        // PUT: api/CourierTransactionDetails/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutCourierTransactionDetail(int id, CourierTransactionDetail courierTransactionDetail)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != courierTransactionDetail.Id)
            {
                return BadRequest();
            }

            db.Entry(courierTransactionDetail).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CourierTransactionDetailExists(id))
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

        // POST: api/CourierTransactionDetails
        [ResponseType(typeof(CourierTransactionDetail))]
        public IHttpActionResult PostCourierTransactionDetail(CourierTransactionDetail courierTransactionDetail)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.CourierTransactionDetails.Add(courierTransactionDetail);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = courierTransactionDetail.Id }, courierTransactionDetail);
        }

        // DELETE: api/CourierTransactionDetails/5
        [ResponseType(typeof(CourierTransactionDetail))]
        public IHttpActionResult DeleteCourierTransactionDetail(int id)
        {
            CourierTransactionDetail courierTransactionDetail = db.CourierTransactionDetails.Find(id);
            if (courierTransactionDetail == null)
            {
                return NotFound();
            }

            db.CourierTransactionDetails.Remove(courierTransactionDetail);
            db.SaveChanges();

            return Ok(courierTransactionDetail);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CourierTransactionDetailExists(int id)
        {
            return db.CourierTransactionDetails.Count(e => e.Id == id) > 0;
        }
    }
}