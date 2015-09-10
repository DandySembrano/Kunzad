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
    public class ShipmentsController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private Response response = new Response();
        private int pageSize = 20;
        // GET: api/Shipments
        public IQueryable<Shipment> GetShipments()
        {
            return db.Shipments;
        }

        // GET: api/Shipments?page=1
        public IHttpActionResult GetShipments(int page)
        {

            var shipment = db.Shipments
                .Include(s => s.Customer.CustomerAddresses)
                .Include(s => s.Customer.CustomerContacts)
                .ToArray();
            if (shipment.Length == 0)
                return Ok(shipment);
            for (int i = 0; i < shipment.Length; i++)
            {
                db.Entry(shipment[i]).Reference(s => s.BusinessUnit).Load();
                db.Entry(shipment[i]).Reference(s => s.Service).Load();
                db.Entry(shipment[i]).Reference(s => s.ShipmentType).Load();
                db.Entry(shipment[i]).Reference(s => s.Customer).Load();
                shipment[i].Customer.CustomerAddresses = shipment[i].Customer.CustomerAddresses.Where(ca => ca.Id == shipment[i].CustomerAddressId && ca.CustomerId == shipment[i].CustomerId).ToArray();
                shipment[i].Customer.CustomerContacts = shipment[i].Customer.CustomerContacts.Where(cc => cc.Id == shipment[i].CustomerContactId && cc.CustomerId == shipment[i].CustomerId).ToArray();

                foreach (var cc in shipment[i].Customer.CustomerContacts)
                    cc.Customer = null;
                foreach (var ca in shipment[i].Customer.CustomerAddresses)
                    ca.Customer = null;              
            }

            if (page > 1)
                return Ok(shipment.Skip((page - 1) * pageSize).Take(pageSize));
            else
                return Ok(shipment.Take(pageSize));
        }

        // GET: api/Shipments/5
        [ResponseType(typeof(Shipment))]
        public IHttpActionResult GetShipment(int id)
        {
            Shipment shipment = db.Shipments.Find(id);
            db.Entry(shipment).Reference(c => c.BusinessUnit).Load();
            db.Entry(shipment).Reference(c => c.Customer).Load();
            db.Entry(shipment).Reference(c => c.Service).Load();
            db.Entry(shipment).Reference(c => c.ShipmentType).Load();
            db.Entry(shipment).Collection(c => c.SeaFreightShipments).Load();
            if (shipment == null)
            {
                return NotFound();
            }

            return Ok(shipment);
        }

        // PUT: api/Shipments/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutShipment(int id, Shipment shipment)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid || id != shipment.Id)
            {
                response.message = "Bad request.";
                return Ok(response);
            }

            db.Entry(shipment).State = EntityState.Modified;

            try
            {
                shipment.LastUpdatedDate = DateTime.Now;
                db.SaveChanges();
                response.status = "SUCCESS";
                response.objParam1 = shipment;
            }
            catch (Exception e)
            {
                if (!ShipmentExists(id))
                {
                    response.message = "Shipment doesn't exist.";
                }
                else
                {
                    response.message = e.InnerException.InnerException.Message.ToString();
                }
            }

            return Ok(response);
        }

        // POST: api/Shipments
        [ResponseType(typeof(Shipment))]
        public IHttpActionResult PostShipment(Shipment shipment)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad request.";
                return Ok(response);
            }
            try
            {
                shipment.CreatedDate = DateTime.Now;
                db.Shipments.Add(shipment);
                db.SaveChanges();
                response.status = "SUCCESS";
                response.objParam1 = shipment;
            }
            catch (Exception e)
            {
                response.message = e.InnerException.InnerException.Message.ToString();
            }

            return Ok(response);
        }

        // DELETE: api/Shipments/5
        [ResponseType(typeof(Shipment))]
        public IHttpActionResult DeleteShipment(int id)
        {
            Shipment shipment = db.Shipments.Find(id);
            response.status = "FAILURE";
            if (shipment == null)
            {
                response.message = "Shipment doesn't exist.";
                return Ok(response);
            }
            try
            {
                db.Shipments.Remove(shipment);
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

        private bool ShipmentExists(int id)
        {
            return db.Shipments.Count(e => e.Id == id) > 0;
        }
    }
}