﻿using System;
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
    public class SeaFreightShipmentsController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private Response response = new Response();
        private int pageSize = (int)AppSettingsGet.PageSize;

        // GET: api/SeaFreightShipments
        public IQueryable<SeaFreightShipment> GetSeaFreightShipments()
        {
            return db.SeaFreightShipments;
        }

        // GET: api/SeaFreightShipments?seaFreightId=1&page=1
        public IHttpActionResult GetSeaFreightShipments(int seaFreightId,int page)
        {
            int skip;
            if (page > 1)
                skip = (page - 1) * pageSize;
            else
                skip = 0;

            var seaFreightShipment = db.SeaFreightShipments
                      .Include(sfs => sfs.Shipment)
                      .Include(sfs => sfs.Shipment.Address)
                      .Include(sfs => sfs.Shipment.Address.CityMunicipality.StateProvince)
                      .Include(sfs => sfs.Shipment.Address1)
                      .Include(sfs => sfs.Shipment.Address1.CityMunicipality.StateProvince)
                      .Include(sfs => sfs.Shipment.BusinessUnit)
                      .Include(sfs => sfs.Shipment.BusinessUnit1)
                      .Include(sfs => sfs.Shipment.Service)
                      .Include(sfs => sfs.Shipment.ShipmentType)
                      .Include(sfs => sfs.Shipment.Customer)
                      .Include(sfs => sfs.Shipment.Customer.CustomerAddresses)
                      .Include(sfs => sfs.Shipment.Customer.CustomerAddresses.Select(ca => ca.CityMunicipality))
                      .Include(sfs => sfs.Shipment.Customer.CustomerAddresses.Select(ca => ca.CityMunicipality.StateProvince))
                      .Include(sfs => sfs.Shipment.Customer.CustomerContacts)
                      .Include(sfs => sfs.Shipment.Customer.CustomerContacts.Select(cc => cc.Contact))
                      .Include(sfs => sfs.Shipment.Customer.CustomerContacts.Select(cc => cc.Contact.ContactPhones))
                      .Where(sfs => sfs.SeaFreightId == seaFreightId)
                      .OrderBy(sfs => sfs.Id)
                      .Skip(skip).Take(pageSize)
                      .AsNoTracking().ToArray();
            return Ok(seaFreightShipment);


            //var seaFreightShipment = db.SeaFreightShipments
            //                .Include(sfs => sfs.SeaFreight)
            //                .Include(sfs => sfs.Shipment)
            //                .Include(sfs => sfs.Shipment.BusinessUnit)
            //                .Include(sfs => sfs.Shipment.BusinessUnit1)
            //                .Include(sfs => sfs.Shipment.Address)
            //                .Include(sfs => sfs.Shipment.Address1)
            //                .Include(sfs => sfs.Shipment.Service)
            //                .Include(sfs => sfs.Shipment.ShipmentType)
            //                .Include(sfs => sfs.Shipment.Customer)
            //                .Include(sfs => sfs.Shipment.Customer.CustomerAddresses.Select(ca => ca.CityMunicipality))
            //                .Include(sfs => sfs.Shipment.Customer.CustomerContacts)
            //                .Include(sfs => sfs.Shipment.Customer.CustomerContacts.Select(cc => cc.Contact))
            //                .Include(sfs => sfs.Shipment.Customer.CustomerContacts.Select(cc => cc.Contact.ContactPhones))
            //                .Where(sfs => sfs.SeaFreightId == seaFreightId)
            //                .OrderBy(sfs => sfs.Id)
            //                .Skip(skip).Take(pageSize).ToArray();

            //if (seaFreightShipment.Length == 0)
            //    return Ok(seaFreightShipment);
            //for (int i = 0; i < seaFreightShipment.Length; i++)
            //{
            //    seaFreightShipment[i].SeaFreight = null;
            //    seaFreightShipment[i].Shipment.CourierTransactionDetails = null;
            //    seaFreightShipment[i].Shipment.Address.Shipments = null;
            //    seaFreightShipment[i].Shipment.TruckingDeliveries = null;
            //    seaFreightShipment[i].Shipment.AirFreightShipments = null;
            //    seaFreightShipment[i].Shipment.SeaFreightShipments = null;
            //    seaFreightShipment[i].Shipment.ShipmentCharges = null;
            //    seaFreightShipment[i].Shipment.ShipmentDimensions = null;
            //    seaFreightShipment[i].Shipment.BusinessUnit.AirFreights = null;
            //    seaFreightShipment[i].Shipment.BusinessUnit.AirFreights1 = null;
            //    seaFreightShipment[i].Shipment.BusinessUnit.BusinessUnitContacts = null;
            //    seaFreightShipment[i].Shipment.BusinessUnit.BusinessUnitType = null;
            //    seaFreightShipment[i].Shipment.BusinessUnit.CourierTransactions = null;
            //    seaFreightShipment[i].Shipment.BusinessUnit.SeaFreights = null;
            //    seaFreightShipment[i].Shipment.BusinessUnit.SeaFreights1 = null;
            //    seaFreightShipment[i].Shipment.BusinessUnit.Shipments = null;
            //    seaFreightShipment[i].Shipment.BusinessUnit1.AirFreights = null;
            //    seaFreightShipment[i].Shipment.BusinessUnit1.AirFreights1 = null;
            //    seaFreightShipment[i].Shipment.BusinessUnit1.BusinessUnitContacts = null;
            //    seaFreightShipment[i].Shipment.BusinessUnit1.BusinessUnitType = null;
            //    seaFreightShipment[i].Shipment.BusinessUnit1.CourierTransactions = null;
            //    seaFreightShipment[i].Shipment.BusinessUnit1.SeaFreights = null;
            //    seaFreightShipment[i].Shipment.BusinessUnit1.SeaFreights1 = null;
            //    seaFreightShipment[i].Shipment.BusinessUnit1.Shipments = null;
            //    seaFreightShipment[i].Shipment.Service.ServiceCategory = null;
            //    seaFreightShipment[i].Shipment.Service.ServiceCharges = null;
            //    seaFreightShipment[i].Shipment.Service.Shipments = null;
            //    seaFreightShipment[i].Shipment.ShipmentType.Shipments = null;
            //    seaFreightShipment[i].Shipment.Customer.CustomerGroup = null;
            //    seaFreightShipment[i].Shipment.Customer.Industry = null;
            //    seaFreightShipment[i].Shipment.Customer.Shipments = null;
            //    seaFreightShipment[i].Shipment.Customer.TruckingDeliveries = null;

            //    seaFreightShipment[i].Shipment.Customer.CustomerContacts = seaFreightShipment[i].Shipment.Customer.CustomerContacts.Where(cc => cc.Id == seaFreightShipment[i].Shipment.CustomerContactId).ToArray();
            //    foreach (var cc in seaFreightShipment[i].Shipment.Customer.CustomerContacts)
            //    {
            //        cc.Customer = null;
            //        cc.Contact.BusinessUnitContacts = null;
            //        cc.Contact.CustomerContacts = null;
            //        cc.Contact.ContactPhones = cc.Contact.ContactPhones.Where(ccp => ccp.Id == seaFreightShipment[i].Shipment.CustomerContactPhoneId).ToArray();
            //        foreach (var ccp in cc.Contact.ContactPhones)
            //        {
            //            ccp.Contact = null;
            //            ccp.ContactNumberType = null;
            //        }
            //    }

            //    //shipment[i].Customer.CustomerAddresses = shipment[i].Customer.CustomerAddresses.Where(ca => ca.Id == shipment[i].CustomerAddressId).ToArray();
            //    foreach (var ca in seaFreightShipment[i].Shipment.Customer.CustomerAddresses)
            //    {
            //        ca.CityMunicipality.Couriers = null;
            //        ca.CityMunicipality.CustomerAddresses = null;
            //        ca.CityMunicipality.ServiceableAreas = null;
            //        ca.CityMunicipality.StateProvince = null;
            //    }

            //}

            //return Ok(seaFreightShipment);

        }

        // GET: api/SeaFreightShipments/5
        [ResponseType(typeof(SeaFreightShipment))]
        public IHttpActionResult GetSeaFreightShipment(int id)
        {
            SeaFreightShipment seaFreightShipment = db.SeaFreightShipments.Find(id);
            if (seaFreightShipment == null)
            {
                return NotFound();
            }

            return Ok(seaFreightShipment);
        }

        // PUT: api/SeaFreightShipments/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutSeaFreightShipment(int id, SeaFreightShipment seaFreightShipment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != seaFreightShipment.Id)
            {
                return BadRequest();
            }

            db.Entry(seaFreightShipment).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SeaFreightShipmentExists(id))
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

        // POST: api/SeaFreightShipments
        [ResponseType(typeof(SeaFreightShipment))]
        public IHttpActionResult PostSeaFreightShipment(SeaFreightShipment seaFreightShipment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.SeaFreightShipments.Add(seaFreightShipment);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = seaFreightShipment.Id }, seaFreightShipment);
        }

        // DELETE: api/SeaFreightShipments/5
        [ResponseType(typeof(SeaFreightShipment))]
        public IHttpActionResult DeleteSeaFreightShipment(int id)
        {
            SeaFreightShipment seaFreightShipment = db.SeaFreightShipments.Find(id);
            if (seaFreightShipment == null)
            {
                return NotFound();
            }

            db.SeaFreightShipments.Remove(seaFreightShipment);
            db.SaveChanges();

            return Ok(seaFreightShipment);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SeaFreightShipmentExists(int id)
        {
            return db.SeaFreightShipments.Count(e => e.Id == id) > 0;
        }
    }
}