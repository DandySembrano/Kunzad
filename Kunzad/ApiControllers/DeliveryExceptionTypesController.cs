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
    public class DeliveryExceptionTypesController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private int pageSize = AppSettingsGet.PageSize;

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

        [HttpGet]
        //Dynamic Filtering
        public IHttpActionResult GetDeliveryExceptionType(string type, int param1, [FromUri]List<DeliveryExceptionType> deliveryExceptionType)
        {
            Object[] dexTypes = new Object[pageSize];
            this.filterRecord(param1, type, deliveryExceptionType.ElementAt(0), deliveryExceptionType.ElementAt(1), ref dexTypes);

            if (dexTypes != null)
                return Ok(dexTypes);
            else
                return Ok();
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

        public void filterRecord(int param1, string type, DeliveryExceptionType dexType, DeliveryExceptionType dexType1, ref Object[] dexTypes)
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

            var filteredDexTypes = (from dt in db.DeliveryExceptionTypes
                                    where dexType.Name == null ? !dexType.Name.Equals("") : (dt.Name.ToLower().Equals(dexType.Name) || dt.Name.ToLower().Contains(dexType.Name))
                                       select new
                                       {
                                           dt.Id,
                                           dt.Name,
                                           dt.Status
                                       })
                                       .OrderBy(dt => dt.Id).Skip(skip).Take(pageSize).ToArray();

            dexTypes = filteredDexTypes;
        }
    }
}