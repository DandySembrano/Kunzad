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
    
    public partial class RatesMaster
    {
        public RatesMaster()
        {
            this.RatesDetails = new HashSet<RatesDetail>();
        }
    
        public int Id { get; set; }
        public string Description { get; set; }
        public Nullable<int> ServiceId { get; set; }
        public Nullable<int> ShipmentTypeId { get; set; }
        public Nullable<int> OriginId { get; set; }
        public Nullable<int> DestinationId { get; set; }
        public Nullable<int> CustomerId { get; set; }
        public Nullable<decimal> InExcessOf { get; set; }
        public Nullable<decimal> ValuationPercentage { get; set; }
        public Nullable<bool> AllowExpiration { get; set; }
        public Nullable<System.DateTime> DateExpired { get; set; }
        public Nullable<System.DateTime> EffictivityDate { get; set; }
        public Nullable<int> Status { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<System.DateTime> LastUpdateDate { get; set; }
        public Nullable<int> CreatedByUserId { get; set; }
        public Nullable<int> ModifiedByUserId { get; set; }
    
        public virtual Address Address { get; set; }
        public virtual Address Address1 { get; set; }
        public virtual Customer Customer { get; set; }
        public virtual ICollection<RatesDetail> RatesDetails { get; set; }
        public virtual RatesMaster RatesMaster1 { get; set; }
        public virtual RatesMaster RatesMaster2 { get; set; }
        public virtual Service Service { get; set; }
        public virtual ShipmentType ShipmentType { get; set; }
    }
}
