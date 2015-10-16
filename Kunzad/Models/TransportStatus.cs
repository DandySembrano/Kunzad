using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Kunzad.Models
{
     static class Status
    {

         //shipment status
         public enum TransportStatus : int
         {
             Open = 10,
             Partial = 20,
             Dispatch = 30,
             Close = 40,
             Cancel = 50
         }

         public enum TruckingType : int
         {
            PickUp = 10,
            TruckingDelivery = 20
         }

         //trucking wb status
         public enum TruckingStatus : int
         { 
            Dispatch = 10,
            Waybill = 20,
            DeliveryUpdate = 30,
            Cancelled = 40
         }

         //check if shipment is loaded or not
         public enum LoadingStatus : int
         { 
            Open = 10,
            Loaded = 20

         }


         
         public enum CheckInType : int
         { 
            SeaFreight = 10,  //Sea freight loading
            AirFreight = 20,  //Air
            Courier = 30,     //Courier
           
         }


    }
}