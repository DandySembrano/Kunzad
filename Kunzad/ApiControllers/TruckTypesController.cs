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
    public class TruckTypesController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private int pageSize = 20;
        Response response = new Response();
        // GET: api/TruckTypes
        public IQueryable<TruckType> GetTruckTypes()
        {
            return db.TruckTypes;
        }
        // GET: api/TruckTypes?page=1
        public IQueryable<TruckType> GetTruckTypes(int page)
        {
            if (page > 1)
            {
                return db.TruckTypes.OrderBy(c => c.Type).Skip((page - 1) * pageSize).Take(pageSize);
            }
            else
            {
                return db.TruckTypes.OrderBy(c => c.Type).Take(pageSize);
            }
        }

        // GET: api/TruckTypes/5
        [ResponseType(typeof(TruckType))]
        public IHttpActionResult GetTruckType(int id)
        {
            TruckType truckType = db.TruckTypes.Find(id);
            if (truckType == null)
            {
                return NotFound();
            }

            return Ok(truckType);
        }

        // PUT: api/TruckTypes/5
        [ResponseType(typeof(TruckType))]
        public IHttpActionResult PutTruckType(int id, TruckType truckType)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad request.";
                return Ok(response);
            }

            if (id != truckType.Id)
            {
                response.message = "Truck Type doesn't exist.";
                return Ok(response);
            }

            db.Entry(truckType).State = EntityState.Modified;

            try
            {
                truckType.LastUpdatedDate = DateTime.Now;
                db.SaveChanges();
                response.status = "SUCCESS";
                response.objParam1 = truckType;
            }
            catch (Exception e)
            {
                if (!TruckTypeExists(id))
                {
                    response.message = "Truck Type doesn't exist.";
                }
                else
                {
                    response.message = e.InnerException.InnerException.Message.ToString();
                }
            }
            return Ok(response);
        }

        // POST: api/TruckTypes
        [ResponseType(typeof(TruckType))]
        public IHttpActionResult PostTruckType(TruckType truckType)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad request.";
                return Ok(response);
            }
            try
            {
                truckType.CreatedDate = DateTime.Now;
                db.TruckTypes.Add(truckType);
                db.SaveChanges();
                response.status = "SUCCESS";
                response.objParam1 = truckType;
            }
            catch (Exception e)
            {
                response.message = e.InnerException.InnerException.Message.ToString();
            }
            return Ok(response);
        }

        // DELETE: api/TruckTypes/5
        [ResponseType(typeof(TruckType))]
        public IHttpActionResult DeleteTruckType(int id)
        {
            response.status = "FAILURE";
            TruckType truckType = db.TruckTypes.Find(id);
            if (truckType == null)
            {
                response.message = "Truck Type doesn't exist.";
                return Ok(response);
            }
            try {
                db.TruckTypes.Remove(truckType);
                db.SaveChanges();
                response.status = "SUCCESS";
            }
            catch (Exception e)
            {
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

        private bool TruckTypeExists(int id)
        {
            return db.TruckTypes.Count(e => e.Id == id) > 0;
        }
    }
}