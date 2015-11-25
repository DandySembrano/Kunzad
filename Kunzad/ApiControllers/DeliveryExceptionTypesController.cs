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
    public class DeliveryExceptionTypesController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();

        // GET: api/DeliveryExceptionTypes
        public IQueryable<DeliveryExceptionType> GetDeliveryExceptionTypes()
        {
            return db.DeliveryExceptionTypes.OrderBy(d => d.Name).AsNoTracking();
        }

        // GET: api/DeliveryExceptionTypes/5
        [ResponseType(typeof(DeliveryExceptionType))]
        public IHttpActionResult GetDeliveryExceptionType(int id)
        {
            DeliveryExceptionType deliveryExceptionType = db.DeliveryExceptionTypes.Find(id);
            if (deliveryExceptionType == null)
            {
                return NotFound();
            }

            return Ok(deliveryExceptionType);
        }

        // PUT: api/DeliveryExceptionTypes/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutDeliveryExceptionType(int id, DeliveryExceptionType deliveryExceptionType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != deliveryExceptionType.Id)
            {
                return BadRequest();
            }

            db.Entry(deliveryExceptionType).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DeliveryExceptionTypeExists(id))
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

        // POST: api/DeliveryExceptionTypes
        [ResponseType(typeof(DeliveryExceptionType))]
        public IHttpActionResult PostDeliveryExceptionType(DeliveryExceptionType deliveryExceptionType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.DeliveryExceptionTypes.Add(deliveryExceptionType);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = deliveryExceptionType.Id }, deliveryExceptionType);
        }

        // DELETE: api/DeliveryExceptionTypes/5
        [ResponseType(typeof(DeliveryExceptionType))]
        public IHttpActionResult DeleteDeliveryExceptionType(int id)
        {
            DeliveryExceptionType deliveryExceptionType = db.DeliveryExceptionTypes.Find(id);
            if (deliveryExceptionType == null)
            {
                return NotFound();
            }

            db.DeliveryExceptionTypes.Remove(deliveryExceptionType);
            db.SaveChanges();

            return Ok(deliveryExceptionType);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool DeliveryExceptionTypeExists(int id)
        {
            return db.DeliveryExceptionTypes.Count(e => e.Id == id) > 0;
        }
    }
}