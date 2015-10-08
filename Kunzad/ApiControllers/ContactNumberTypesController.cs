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
    public class ContactNumberTypesController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        Response response = new Response();

        // GET: api/ContactNumberTypes
        [CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
        public IQueryable<ContactNumberType> GetContactNumberTypes()
        {
            return db.ContactNumberTypes.AsNoTracking();
        }

        // GET: api/AirLines?page=1
        public IQueryable<ContactNumberType> GetContactNumberTypes(int page)
        {
            if (page > 1)
            {
                return db.ContactNumberTypes.AsNoTracking().OrderBy(c => c.Type).Skip((page - 1) * AppSettingsGet.PageSize).Take(AppSettingsGet.PageSize);
            }
            else
            {
                return db.ContactNumberTypes.AsNoTracking().OrderBy(c => c.Type).Take(AppSettingsGet.PageSize);
            }
        }

        // GET: api/ContactNumberTypes/5
        [ResponseType(typeof(ContactNumberType))]
        public IHttpActionResult GetContactNumberType(int id)
        {
            ContactNumberType contactNumberType = db.ContactNumberTypes.Find(id);
            if (contactNumberType == null)
            {
                return NotFound();
            }

            return Ok(contactNumberType);
        }

        // PUT: api/ContactNumberTypes/5
        [ResponseType(typeof(ContactNumberType))]
        public IHttpActionResult PutContactNumberType(int id, ContactNumberType contactNumberType)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad request.";
                return Ok(response);
            }

            if (id != contactNumberType.Id)
            {
                response.message = "Contact number type doesn't exist.";
                return Ok(response);
            }

            db.Entry(contactNumberType).State = EntityState.Modified;

            try
            {
                contactNumberType.LastUpdatedDate = DateTime.Now;
                db.SaveChanges();
                response.status = "SUCCESS";
                response.objParam1 = contactNumberType;
            }
            catch (Exception e)
            {
                if (!ContactNumberTypeExists(id))
                {
                    response.message = "Contact number type doesn't exist.";
                }
                else
                {
                    response.message = e.InnerException.InnerException.Message.ToString();
                }
            }

            return Ok(response);
        }

        // POST: api/ContactNumberTypes
        [ResponseType(typeof(ContactNumberType))]
        public IHttpActionResult PostContactNumberType(ContactNumberType contactNumberType)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad request.";
                return Ok(response);
            }
            try
            {
                contactNumberType.CreatedDate = DateTime.Now;
                db.ContactNumberTypes.Add(contactNumberType);
                db.SaveChanges();
                response.status = "SUCCESS";
                response.objParam1 = contactNumberType;
            }
            catch (Exception e) {
                response.message = e.InnerException.InnerException.Message.ToString();
            }
            return Ok(response);
        }

        // DELETE: api/ContactNumberTypes/5
        [ResponseType(typeof(ContactNumberType))]
        public IHttpActionResult DeleteContactNumberType(int id)
        {
            response.status = "FAILURE";
            ContactNumberType contactNumberType = db.ContactNumberTypes.Find(id);
            if (contactNumberType == null)
            {
                response.message = "Contact number type doesn't exist.";
                return Ok(response);
            }
            try
            {
                db.ContactNumberTypes.Remove(contactNumberType);
                db.SaveChanges();
                response.status = "SUCCESS";
            }
            catch (Exception e) {
                response.message = e.InnerException.InnerException.Message.ToString();
            }
            return Ok(response);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ContactNumberTypeExists(int id)
        {
            return db.ContactNumberTypes.Count(e => e.Id == id) > 0;
        }
    }
}