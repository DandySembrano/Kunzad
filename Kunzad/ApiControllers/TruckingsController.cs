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
    public class TruckingsController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private Response response = new Response();
        private int pageSize = 20;

        // GET: api/Truckings
        [CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
        public IQueryable<Trucking> GetTruckings()
        { 
            return db.Truckings
                .Include(t => t.Driver)
                .Include(t=>t.Truck)
                .Include(t=>t.Trucker)
                .Include(t=>t.TruckingDeliveries);
        }
        
        // GET: api/Truckings?page=1
        [CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
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

        [CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
        public IHttpActionResult GetTruckings(string type, int param1, [FromUri]List<Trucking> trucking)
        {
            Trucking[] truckings = new Trucking[AppSettingsGet.PageSize];
            this.filterRecord(param1, type, trucking.ElementAt(0), trucking.ElementAt(1), ref truckings);

            if (truckings != null)
                return Ok(truckings);
            else
                return Ok();
        }

        // GET: api/Truckings/5
        [CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
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
                bool flag,flag1;
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
                    //remove truckig delivery then set the shipment transprotStatus back to Open
                    if (!flag || trucking.TruckingStatusId == (int)Status.TruckingStatus.Cancelled)
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

                //if TruckingStatus is not cancelled then proceed 
                if (trucking.TruckingStatusId != (int)Status.TruckingStatus.Cancelled)
                {
                    //insert truckingDelivery and update truckingDelivery
                    foreach (TruckingDelivery td in trucking.TruckingDeliveries)
                    {
                        flag = false;
                        foreach (TruckingDelivery td1 in currentDeliveries)
                        {
                            if (td.Id == td1.Id)
                            {
                                flag = true;
                                var tdHolder = db.TruckingDeliveries.Find(td.Id);
                                td.LastUpdatedDate = DateTime.Now;
                                db.Entry(tdHolder).CurrentValues.SetValues(td);
                                db.Entry(tdHolder).State = EntityState.Modified;

                                var currentTDShipment = db.TruckingDeliveries.Where(truckingDeliveries => truckingDeliveries.TruckingId == td.TruckingId);
                                //check if shipment was replaced
                                foreach (TruckingDelivery tds in currentTDShipment)
                                {
                                    flag1 = false;

                                    foreach (TruckingDelivery tds1 in trucking.TruckingDeliveries)
                                    {
                                        if (tds.ShipmentId == tds1.ShipmentId)
                                        {
                                            flag1 = true;
                                            //change shipment transportStatus to DISPATCH 
                                            Shipment shipmentHolder = db.Shipments.Find(tds1.ShipmentId);

                                            if (shipmentHolder.TransportStatusId == (int)Status.TransportStatus.Open)
                                            {
                                                shipmentHolder.TransportStatusId = (int)Status.TransportStatus.Dispatch;
                                                db.Entry(shipmentHolder).CurrentValues.SetValues(shipmentHolder);
                                                db.Entry(shipmentHolder).State = EntityState.Modified;
                                            }
                                            break;
                                        }
                                    }
                                    //change shipment transportStatus back to OPEN
                                    if (!flag1)
                                    {
                                        Shipment shipmentHolder = db.Shipments.Find(tds.ShipmentId);
                                        shipmentHolder.TransportStatusId = (int)Status.TransportStatus.Open;
                                        db.Entry(shipmentHolder).CurrentValues.SetValues(shipmentHolder);

                                        db.Entry(shipmentHolder).State = EntityState.Modified;
                                    }
                                }
                                break;
                            }

                        }
                        //new trucking delivery
                        if (!flag)
                        {
                            td.CreatedDate = DateTime.Now;
                            td.TruckingId = trucking.Id;
                            db.TruckingDeliveries.Add(td);

                            Shipment shipmentHolder = db.Shipments.Find(td.ShipmentId);
                            Shipment shipmentHolder1 = db.Shipments.Find(td.ShipmentId);
                            shipmentHolder1.TransportStatusId = (int)Status.TransportStatus.Dispatch;
                            db.Entry(shipmentHolder).CurrentValues.SetValues(shipmentHolder1);

                            db.Entry(shipmentHolder).State = EntityState.Modified;
                        }
                    }
                }
                var truckingHolder = db.Truckings.Find(trucking.Id);
                trucking.TruckerCost = 0;
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

        public void filterRecord(int param1, string type, Trucking trucking, Trucking trucking1, ref Trucking[] truckings)
        {

            /*
             * If date is not nullable in table equate to "1/1/0001 12:00:00 AM" else null
             * If integer value is not nullable in table equate to 0 else null
             * Use modified date if filtered data type is date
             */
            DateTime defaultDate = new DateTime(0001, 01, 01, 00, 00, 00);
            TimeSpan defaultTime = new TimeSpan(23, 00, 00);
            int skip;

            if (type.Equals("paginate"))
            {
                if (param1 > 1)
                    skip = (param1 - 1) * AppSettingsGet.PageSize;
                else
                    skip = 0;
            }
            else
                skip = param1;
                
            var filteredTruckings = db.Truckings
                .Include(t => t.Truck)
                .Include(t => t.Trucker)
                .Include(t => t.Driver)
                .Include(t => t.ServiceableArea)
                .Include(t => t.ServiceableArea1)
                .Where(t => trucking.Id == null || trucking.Id == 0 ? true : t.Id == trucking.Id)
                .Where(t => trucking.TruckingTypeId == null || trucking.TruckingTypeId == 0 ? true : t.TruckingTypeId == trucking.TruckingTypeId)
                .Where(t => trucking.TruckingStatusId == null || trucking.TruckingStatusId == 0 ? true : t.TruckingStatusId == trucking.TruckingStatusId)
                .Where(t => trucking.CreatedDate == null || trucking.CreatedDate == defaultDate ? true : t.CreatedDate >= trucking.CreatedDate && t.CreatedDate <= trucking1.CreatedDate)
                .OrderBy(d => d.Id).Skip(skip).Take(AppSettingsGet.PageSize).AsNoTracking().ToArray();
            truckings = filteredTruckings;
        }
    }
}