using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Kunzad.Models
{
     static class Status
    {

         public enum TransportStatus : int
         {
             Open = 10,
             Partial = 20,
             Dispatch = 30,
             Close = 40,
             Cancel = 50
         }

         public enum TruckingType
         {
            PickUp = 10,
            TruckingDelivery = 20
         }

         public enum TruckingStatus { 
            Dispatch = 10,
            Waybill = 20,
            DeliveryUpdate = 30,
            Cancelled = 40
         }
    }
}