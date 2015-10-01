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
    public class TruckingsController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private Response response = new Response();
        private int pageSize = 20;

        // GET: api/Truckings
        public IQueryable<Trucking> GetTruckings()
        { 
            return db.Truckings
                .Include(t => t.Driver)
                .Include(t=>t.Truck)
                .Include(t=>t.Trucker)
                .Include(t=>t.TruckingDeliveries);
        }
        // GET: api/Truckings?page=1
        [ResponseType(typeof(Trucking))]
        public IHttpActionResult GetTruckings(int page)
        {
            int skip;
            if (page > 1)
                skip = (page - 1) * pageSize;
            else
                skip = 0;

            var trucking = db.Truckings
                            .Include(t => t.ServiceableArea)
                            .Include(t => t.ServiceableArea1)
                            .Include(t => t.Trucker)
                            .Include(t => t.Truck)
                            .Include(t => t.Driver)
                            .OrderByDescending(t => t.CreatedDate)
                            .Skip(skip).Take(pageSize).ToArray();

            if (trucking.Length == 0)
                return Ok(trucking);

            for (int i = 0; i < trucking.Length; i++)
            {
                trucking[i].ServiceableArea.CityMunicipality = null;
                trucking[i].ServiceableArea1.CityMunicipality = null;
                trucking[i].ServiceableArea.Truckings = null;
                trucking[i].ServiceableArea.Truckings1 = null;
                trucking[i].ServiceableArea1.Truckings = null;
                trucking[i].ServiceableArea1.Truckings1 = null;
                trucking[i].Trucker.Truckings = null;
                trucking[i].Trucker.CityMunicipality = null;
                trucking[i].Truck.Trucker = null;
                trucking[i].Truck.TruckType = null;
                trucking[i].Truck.Truckings = null;
                trucking[i].Driver.Truckings = null;
            }

            return Ok(trucking);
        }


        // GET: api/Truckings/5
        [ResponseType(typeof(Trucking))]
        public IHttpActionResult GetTrucking(int id)
        {
            Trucking trucking = db.Truckings.Find(id);
            if (trucking == null)
            {
                return NotFound();
            }

            return Ok(trucking);
        }

        // PUT: api/Truckings/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutTrucking(int id, Trucking trucking)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid || id != trucking.Id)
            {
                response.message = "Bad request.";
                return Ok(response);
            }

            try
            {
                bool flag;
                var currentDeliveries = db.TruckingDeliveries.Where(truckingDeliveries => truckingDeliveries.TruckingId == trucking.Id);

                //delete truckingDelivery
                foreach (TruckingDelivery td in currentDeliveries)
                {
                    flag = false;
                    foreach (TruckingDelivery td2 in trucking.TruckingDeliveries)
                    {
                        if (td.Id == td2.Id)
                        {
                            flag = true;
                            break;
                        }
                    }

                    if (!flag)
                    {
                        var truckingDeliveryShipment = db.Shipments.Where(s => s.Id == td.ShipmentId);
                        foreach (Shipment shipment in truckingDeliveryShipment)
                        {
                            var shipmentHolder = db.Shipments.Find(shipment.Id);
                            shipment.TransportStatusId = (int)Status.TransportStatus.Open;
                            db.Entry(shipmentHolder).CurrentValues.SetValues(shipment);
                        }
                        db.TruckingDeliveries.Remove(td);

                    }

                }

                //insert truckingDelivery and update truckingDelivery
                foreach (TruckingDelivery td in trucking.TruckingDeliveries)
                {
                    //insert
                    if (td.Id == -1)
                    {
                        td.CreatedDate = DateTime.Now;
                        db.TruckingDeliveries.Add(td);

                        Shipment shipmentHolder = db.Shipments.Find(td.Shipment.Id);
                        td.Shipment.TransportStatusId = (int)Status.TransportStatus.Dispatch;
                        db.Entry(shipmentHolder).CurrentValues.SetValues(td.Shipment);

                        db.Entry(shipmentHolder).State = EntityState.Modified;
                    }
                    //update
                    else
                    {
                        TruckingDelivery tdHolder = db.TruckingDeliveries.Find(td.Id);
                        td.LastUpdatedDate = DateTime.Now;
                        db.Entry(tdHolder).CurrentValues.SetValues(td);
                        db.Entry(tdHolder).State = EntityState.Modified;
                    }
                       
                }
                Trucking truckingHolder = db.Truckings.Find(trucking.Id);
                trucking.LastUpdatedDate = DateTime.Now;
                db.Entry(truckingHolder).CurrentValues.SetValues(trucking);
                db.Entry(truckingHolder).State = EntityState.Modified;
                db.SaveChanges();
                response.status = "SUCCESS";
                response.objParam1 = trucking;
            }
            catch (Exception e)
            {
                if (!TruckingExists(id))
                {
                    response.message = "Trucking doesn't exist.";
                }
                else
                {
                    response.message = e.InnerException.InnerException.Message.ToString();
                }
            }

            return Ok(response);
        }

        // POST: api/Truckings
        [ResponseType(typeof(Trucking))]
        public IHttpActionResult PostTrucking(Trucking trucking)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad request.";
                return Ok(response);
            }
            try 
            {
                foreach (TruckingDelivery td in trucking.TruckingDeliveries)
                {
                    td.CreatedDate = DateTime.Now;
                    db.TruckingDeliveries.Add(td);
                    var truckingDeliveryShipment = db.Shipments.Where(s => s.Id == td.ShipmentId);
                    foreach (Shipment shipment in truckingDeliveryShipment)
                    {
                        var shipmentHolder = db.Shipments.Find(shipment.Id);
                        shipment.TransportStatusId = (int)Status.TransportStatus.Dispatch;
                        db.Entry(shipmentHolder).CurrentValues.SetValues(shipment);
                    }
                }
                trucking.CreatedDate = DateTime.Now;
                trucking.TruckingStatusId = (int)Status.TruckingStatus.Dispatch;
                trucking.TruckerCost = 0;
                db.Truckings.Add(trucking);
                db.SaveChanges();
                response.status = "SUCCESS";

                response.objParam1 = trucking;
            }
            catch (Exception e)
            {
                response.message = e.InnerException.InnerException.Message.ToString();
            }
            return Ok(response);
        }

        // DELETE: api/Truckings/5
        [ResponseType(typeof(Trucking))]
        public IHttpActionResult DeleteTrucking(int id)
        {
            Trucking trucking = db.Truckings.Find(id);

            if (trucking == null)
            {
                return NotFound();
            }

            db.Truckings.Remove(trucking);
            db.SaveChanges();
            
            return Ok(trucking);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TruckingExists(int id)
        {
            return db.Truckings.Count(e => e.Id == id) > 0;
        }
    }
}