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
            foreach (DeliveryException de in deliveryException)
            {
                de.CreatedDate = DateTime.Now;
                db.DeliveryExceptions.Add(de);
            }
            db.SaveChanges();

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