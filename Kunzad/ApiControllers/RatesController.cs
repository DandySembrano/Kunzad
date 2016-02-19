using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Kunzad.Models;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;

namespace Kunzad.ApiControllers
{
    public class RatesController : ApiController
    {
        KunzadDbEntities dbEntity = new KunzadDbEntities();
        Response response = new Response();
        public IQueryable<RatesMaster> GetRates() 
        {
            return dbEntity.RatesMasters.AsNoTracking();
        }

        public IHttpActionResult PostRates(RatesMaster pRatesMaster) 
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad request.";
                return Ok(response);
            }

            try{
                foreach(RatesDetail ratesDtl in pRatesMaster.RatesDetails)
                {
                    ratesDtl.CreatedDate = DateTime.Now;
                    dbEntity.RatesDetails.Add(ratesDtl);
                }
                pRatesMaster.CreatedDate = DateTime.Now;
                dbEntity.RatesMasters.Add(pRatesMaster);
                dbEntity.SaveChanges();
                response.status = "SUCCESS";
            }catch(Exception ex){
                response.message = ex.InnerException.InnerException.Message.ToString();
            }
            return Ok(response);
        }

        public IHttpActionResult PutRates(int id, RatesMaster pRatesMaster)
        {
            try {
                //get all ratedetail in db
                var rateDetailonDb = (from pRateDetail in dbEntity.RatesDetails where pRateDetail.RateMasterId == id select pRateDetail);

                //remove detail not found in current parameter
                bool found;
                foreach (var rateDetail in rateDetailonDb)
                {
                     found = false;
                    foreach(var rateDetailOnParameter in pRatesMaster.RatesDetails)
                    {
                        if(rateDetail.Id == rateDetailOnParameter.Id ){
                            found = true;
                            break;
                        }
                    }
                    if(!found){
                        dbEntity.RatesDetails.Remove(rateDetail);                    
                    }
                }

                //add, update detail which is not found on db
                foreach (var rateDetailOnParameter in pRatesMaster.RatesDetails) {
                    found = false;
                    foreach (var rateDetail in rateDetailonDb) { 
                        if(rateDetailOnParameter.Id == rateDetail.Id ){ //if parameter found in db then update
                            var rate = dbEntity.RatesDetails.Find(rateDetailOnParameter.Id);
                            rate.ModifiedByUserId = 2;
                            rate.LastUpdateDate = DateTime.Now;
                            dbEntity.Entry(rate).CurrentValues.SetValues(rateDetailOnParameter);
                            dbEntity.Entry(rate).State = EntityState.Modified;
                            found = true;
                        }
                    }
                    if(!found){ //add if not found on db
                        rateDetailOnParameter.Id = id;
                        rateDetailOnParameter.CreatedByUserId = 1;
                        rateDetailOnParameter.CreatedDate = DateTime.Now;
                        dbEntity.RatesDetails.Add(rateDetailOnParameter);
                    }
                }

                var rateMaster = dbEntity.RatesMasters.Find(id);
                rateMaster.ModifiedByUserId = 2;
                rateMaster.LastUpdateDate = DateTime.Now;
                dbEntity.Entry(rateMaster).State = EntityState.Modified;
                dbEntity.Entry(rateMaster).CurrentValues.SetValues(pRatesMaster);
                dbEntity.SaveChanges();

                return CreatedAtRoute("DefaultApi", new { id = rateMaster.Id }, rateMaster);
            }catch (Exception ex){
                ModelState.AddModelError("", ex.Message);
            }
            return BadRequest(ModelState);
        }

    }
}
