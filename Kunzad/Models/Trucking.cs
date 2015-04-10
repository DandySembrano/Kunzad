//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Kunzad.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Trucking
    {
        public Trucking()
        {
            this.TruckingDeliveries = new HashSet<TruckingDelivery>();
        }
    
        public int Id { get; set; }
        public string DocumentNo { get; set; }
        public int TruckerId { get; set; }
        public int TruckId { get; set; }
        public int DriverId { get; set; }
        public int OriginServiceableAreaId { get; set; }
        public int DestinationServiceableAreaId { get; set; }
        public decimal TruckerCost { get; set; }
        public bool TruckingStatusId { get; set; }
        public Nullable<System.DateTime> TruckCallDate { get; set; }
        public Nullable<System.TimeSpan> TruckCallTime { get; set; }
        public Nullable<System.DateTime> DispatchDate { get; set; }
        public Nullable<System.TimeSpan> DispatchTime { get; set; }
        public Nullable<System.DateTime> CompletedDate { get; set; }
        public Nullable<System.TimeSpan> CompletedTime { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<System.DateTime> LastUpdatedDate { get; set; }
        public Nullable<int> CreatedByUserId { get; set; }
        public Nullable<int> LastUpdatedByUserId { get; set; }
    
        public virtual Driver Driver { get; set; }
        public virtual Truck Truck { get; set; }
        public virtual Trucker Trucker { get; set; }
        public virtual ICollection<TruckingDelivery> TruckingDeliveries { get; set; }
    }
}
