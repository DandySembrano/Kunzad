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
    public class ShipmentTypesController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private int pageSize = 20;
        Response response = new Response();
        // GET: api/ShipmentTypes
        public IQueryable<ShipmentType> GetShipmentTypes()
        {
            return db.ShipmentTypes;
        }

        // GET: api/ShipmentTypes?page=1
        public IQueryable<ShipmentType> GetShipmentTypes(int page)
        {
            if (page > 1)
            {
                return db.ShipmentTypes.OrderBy(c => c.Name).Skip((page - 1) * pageSize).Take(pageSize);
            }
            else
            {
                return db.ShipmentTypes.OrderBy(c => c.Name).Take(pageSize);
            }
        }

        // GET: api/ShipmentTypes/5
        [ResponseType(typeof(ShipmentType))]
        public IHttpActionResult GetShipmentType(int id)
        {
            ShipmentType shipmentType = db.ShipmentTypes.Find(id);
            if (shipmentType == null)
            {
                return NotFound();
            }

            return Ok(shipmentType);
        }

        // PUT: api/ShipmentTypes/5
        [ResponseType(typeof(ShipmentType))]
        public IHttpActionResult PutShipmentType(int id, ShipmentType shipmentType)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad request.";
                return Ok(response);
            }

            if (id != shipmentType.Id)
            {
                response.message = "Shipment Type doesn't exist.";
                return Ok(response);
            }

            db.Entry(shipmentType).State = EntityState.Modified;

            try
            {
                shipmentType.LastUpdatedDate = DateTime.Now;
                db.SaveChanges();
                response.status = "SUCCESS";
                response.objParam1 = shipmentType;
            }
            catch (Exception e)
            {
                if (!ShipmentTypeExists(id))
                {
                    response.message = "Shipment Type doesn't exist.";
                }
                else
                {
                    response.message = e.InnerException.InnerException.Message.ToString();
                }
            }
            return Ok(response);
        }

        // POST: api/ShipmentTypes
        [ResponseType(typeof(ShipmentType))]
        public IHttpActionResult PostShipmentType(ShipmentType shipmentType)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad request.";
                return Ok(response);
            }
            try
            {
                shipmentType.CreatedDate = DateTime.Now;
                db.ShipmentTypes.Add(shipmentType);
                db.SaveChanges();
                response.status = "SUCCESS";
                response.objParam1 = shipmentType;

            }
            catch (Exception e)
            {
                response.message = e.InnerException.InnerException.Message.ToString();
            }
            return Ok(response);
        }

        // DELETE: api/ShipmentTypes/5
        [ResponseType(typeof(ShipmentType))]
        public IHttpActionResult DeleteShipmentType(int id)
        {
            response.status = "FAILURE";
            ShipmentType shipmentType = db.ShipmentTypes.Find(id);
            if (shipmentType == null)
            {
                response.message = "Shipment Type doesn't exist.";
                return Ok(response);
            }
            try
            {
                db.ShipmentTypes.Remove(shipmentType);
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

        private bool ShipmentTypeExists(int id)
        {
            return db.ShipmentTypes.Count(e => e.Id == id) > 0;
        }
    }
}