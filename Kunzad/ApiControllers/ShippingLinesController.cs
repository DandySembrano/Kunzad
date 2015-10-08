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
    public class ShippingLinesController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        Response response = new Response();

        // GET: api/ShippingLines
        [CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
        public IQueryable<ShippingLine> GetShippingLines()
        {
            return db.ShippingLines.AsNoTracking();
        }
        // GET: api/ShippingLines?page=1
        public IQueryable<ShippingLine> GetShippingLines(int page)
        {
            if (page > 1)
            {
                return db.ShippingLines
                    //.Include(s => s.Vessels.Select(v => v.VesselVoyages))
                    .Include(s => s.Vessels).AsNoTracking()
                    .OrderBy(s => s.Name).Skip((page - 1) * AppSettingsGet.PageSize).Take(AppSettingsGet.PageSize);
            }
            else
            {
                return db.ShippingLines
                    //.Include(s => s.Vessels.Select(v => v.VesselVoyages))
                    .Include(s => s.Vessels)
                    .OrderBy(s => s.Name).Take(AppSettingsGet.PageSize);
            }
        }

        // GET: api/ShippingLines/5
        [ResponseType(typeof(ShippingLine))]
        public IHttpActionResult GetShippingLine(int id)
        {
            ShippingLine shippingLine = db.ShippingLines.Find(id);
            if (shippingLine == null)
            {
                return NotFound();
            }

            return Ok(shippingLine);
        }

        [HttpGet]
        //Dynamic filtering
        public IHttpActionResult GetShippingLine(string type, int param1, [FromUri]List<ShippingLine> shippingLine)
        {
            Object[] shippingLines = new Object[AppSettingsGet.PageSize];
            this.filterRecord(param1, type, shippingLine.ElementAt(0), shippingLine.ElementAt(1), ref shippingLines);

            if (shippingLines != null)
                return Ok(shippingLines);
            else
                return Ok();
        }

        // PUT: api/ShippingLines/5
        [ResponseType(typeof(ShippingLine))]
        public IHttpActionResult PutShippingLine(int id, ShippingLine shippingLine)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad Request.";
                return Ok(response);
            }

            if (id != shippingLine.Id)
            {
                response.message = "Shipping Line doesn't exist.";
                return Ok(response);
            }

            try
            {
                bool flag, vvFlag;
                //get Vessels of a specific Shipping Line
                var currentVessels = db.Vessels.Where(vessel => vessel.ShippingLineId == shippingLine.Id);

                //Check if Vessel is for delete
                foreach (Vessel v in currentVessels)
                {
                    flag = false;
                    foreach (Vessel v1 in shippingLine.Vessels)
                    {
                        if (v.Id == v1.Id)
                        {
                            flag = true;
                            break;
                        }
                    }
                    if (!flag)
                    {
                        var removeVoyages = db.VesselVoyages.Where(vv => vv.VesselId == v.Id);
                        //remove vessel voyages
                        db.VesselVoyages.RemoveRange(removeVoyages);
                        //remove deleted Vessel(s)
                        db.Vessels.Remove(v);
                    }
                }

                //Check if Vessel is for Add or Edit
                foreach (Vessel v in shippingLine.Vessels)
                {
                    flag = false;
                    foreach (Vessel v1 in currentVessels)
                    {
                        if (v.Id == v1.Id)
                        {
                            flag = true;
                            //Set changes for Vessels info for edit
                            var vesselHolder = db.Vessels.Find(v.Id);
                            v.LastUpdatedDate = DateTime.Now;
                            db.Entry(vesselHolder).CurrentValues.SetValues(v);
                            db.Entry(vesselHolder).State = EntityState.Modified;

                            var currentVoyages = db.VesselVoyages.Where(vv => vv.VesselId == v.Id);
                            //Check if Voyage is for delete
                            foreach (VesselVoyage vv in currentVoyages)
                            {
                                vvFlag = false;
                                foreach (VesselVoyage vv1 in v.VesselVoyages)
                                {
                                    if (vv.Id == vv1.Id)
                                    {
                                        vvFlag = true;
                                        break;
                                    }
                                }
                                if (!vvFlag)
                                    //remove Voyage
                                    db.VesselVoyages.Remove(vv);
                            }
                            //Check if Voyage is for Add/Edit
                            foreach (VesselVoyage vv in v.VesselVoyages)
                            {
                                vvFlag = false;
                                foreach (VesselVoyage vv1 in currentVoyages)
                                {
                                    if (vv.Id == vv1.Id)
                                    {
                                        vvFlag = true;
                                        //set changes Voyage
                                        var voyagesHolder = db.VesselVoyages.Find(vv.Id);
                                        vv.LastUpdatedDate = DateTime.Now;
                                        db.Entry(voyagesHolder).CurrentValues.SetValues(vv);
                                        db.Entry(voyagesHolder).State = EntityState.Modified;
                                        break;
                                    }
                                }
                                if (!vvFlag)
                                {
                                    //Add Voyage
                                    vv.CreatedDate = DateTime.Now;
                                    db.VesselVoyages.Add(vv);
                                }
                            }
                            break;
                        }
                    }
                    if (!flag)
                    {
                        //add Vessel
                        v.CreatedDate = DateTime.Now;
                        v.ShippingLineId = shippingLine.Id;
                        db.Vessels.Add(v);
                        foreach (VesselVoyage vv in v.VesselVoyages)
                        {
                            //add Voyages
                            vv.CreatedDate = DateTime.Now;
                            db.VesselVoyages.Add(vv);
                        }
                    }
                }
                var shippingLineHolder = db.ShippingLines.Find(shippingLine.Id);
                shippingLine.LastUpdatedDate = DateTime.Now;
                db.Entry(shippingLineHolder).CurrentValues.SetValues(shippingLine);
                db.Entry(shippingLineHolder).State = EntityState.Modified;
                db.SaveChanges();

                //var modifiedShippingLine = db.ShippingLines.Find(shippingLine.Id);
                response.status = "SUCCESS";
                response.objParam1 = shippingLine;
            }
            catch (Exception e)
            {
                if (!ShippingLineExists(id))
                {
                    response.message = "Shipping Line doesn't exist.";
                }
                else
                {
                    response.message = e.InnerException.InnerException.Message.ToString();
                }
            }
            return Ok(response);
        }

        // POST: api/ShippingLines
        [ResponseType(typeof(ShippingLine))]
        public IHttpActionResult PostShippingLine(ShippingLine shippingLine)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad request.";
                return Ok(response);
            }

            try
            {
                foreach (Vessel v in shippingLine.Vessels)
                {
                    v.CreatedDate = DateTime.Now;
                    db.Vessels.Add(v);
                    foreach (VesselVoyage vv in v.VesselVoyages)
                    {
                        vv.CreatedDate = DateTime.Now;
                        db.VesselVoyages.Add(vv);
                    }
                }
                shippingLine.CreatedDate = DateTime.Now;
                db.ShippingLines.Add(shippingLine);
                db.SaveChanges();
                response.status = "SUCCESS";
                response.objParam1 = shippingLine;
            }
            catch (Exception e)
            {
                if (ShippingLineExists(shippingLine.Id))
                {
                    response.message = "Shipping Line already Exist.";
                }
                else
                {
                    response.message = e.InnerException.InnerException.Message.ToString();
                }
            }
            return Ok(response);
        }

        // DELETE: api/ShippingLines/5
        [ResponseType(typeof(ShippingLine))]
        public IHttpActionResult DeleteShippingLine(int id)
        {
            response.status = "FAILURE";
            ShippingLine shippingLine = db.ShippingLines.Find(id);
            if (shippingLine == null)
            {
                response.message = "Bad request.";
                return Ok(response);
            }
            try
            {

                var deleteVoyages = db.VesselVoyages.Where(vv => vv.Vessel.ShippingLineId == id);
                var deleteVessels = db.Vessels.Where(v => v.ShippingLineId == id);
                db.VesselVoyages.RemoveRange(deleteVoyages);
                db.Vessels.RemoveRange(deleteVessels);
                db.ShippingLines.Remove(shippingLine);
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

        private bool ShippingLineExists(int id)
        {
            return db.ShippingLines.Count(e => e.Id == id) > 0;
        }
        public void filterRecord(int param1, string type, ShippingLine shippingLine, ShippingLine shippingLine1, ref Object[] shippingLines)
        {
            /*If date is not nullable in table equate to "1/1/0001 12:00:00 AM" else null
            if integer value is not nullable in table equate to 0 else null*/
            DateTime defaultDate = new DateTime(0001, 01, 01, 00, 00, 00);
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

            var filteredShippingLines = (from s in db.ShippingLines
                                           select new
                                           {
                                               s.Id,
                                               s.Name,
                                               s.CreatedByUserId,
                                               s.CreatedDate,
                                               s.LastUpdatedByUserId,
                                               s.LastUpdatedDate
                                           })
                                        .Where(s => shippingLine.Id == null || shippingLine.Id == 0 ? true : s.Id == shippingLine.Id)
                                        .Where(s => shippingLine.Name == null ? !shippingLine.Name.Equals("") : (s.Name.ToLower().Equals(shippingLine.Name)))
                                        .OrderBy(s => s.Id)
                                        .Skip(skip).Take(AppSettingsGet.PageSize).ToArray();

            shippingLines = filteredShippingLines;
        }
    }
}