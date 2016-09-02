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
    public class UserTypesController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();

        // GET: api/UserTypes
        public IQueryable<UserType> GetUserTypes()
        {
            return db.UserTypes;
        }

        // GET: api/UserTypes/5
        [ResponseType(typeof(UserType))]
        public IHttpActionResult GetUserType(int id)
        {
            UserType userType = db.UserTypes.Find(id);
            if (userType == null)
            {
                return NotFound();
            }

            return Ok(userType);
        }

        // PUT: api/UserTypes/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutUserType(int id, UserType userType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != userType.Id)
            {
                return BadRequest();
            }

            db.Entry(userType).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserTypeExists(id))
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

        // POST: api/UserTypes
        [ResponseType(typeof(UserType))]
        public IHttpActionResult PostUserType(UserType userType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.UserTypes.Add(userType);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = userType.Id }, userType);
        }

        // DELETE: api/UserTypes/5
        [ResponseType(typeof(UserType))]
        public IHttpActionResult DeleteUserType(int id)
        {
            UserType userType = db.UserTypes.Find(id);
            if (userType == null)
            {
                return NotFound();
            }

            db.UserTypes.Remove(userType);
            db.SaveChanges();

            return Ok(userType);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserTypeExists(int id)
        {
            return db.UserTypes.Count(e => e.Id == id) > 0;
        }
    }
}