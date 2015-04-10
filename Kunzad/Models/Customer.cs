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
    
    public partial class Customer
    {
        public Customer()
        {
            this.CustomerAddresses = new HashSet<CustomerAddress>();
            this.CustomerContacts = new HashSet<CustomerContact>();
            this.Shipments = new HashSet<Shipment>();
            this.TruckingDeliveries = new HashSet<TruckingDelivery>();
        }
    
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public int CustomerGroupId { get; set; }
        public string TIN { get; set; }
        public int IndustryId { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<System.DateTime> LastUpdatedDate { get; set; }
        public Nullable<int> CreatedByUserId { get; set; }
        public Nullable<int> LastUpdatedByUserId { get; set; }
    
        public virtual CustomerGroup CustomerGroup { get; set; }
        public virtual Industry Industry { get; set; }
        public virtual ICollection<CustomerAddress> CustomerAddresses { get; set; }
        public virtual ICollection<CustomerContact> CustomerContacts { get; set; }
        public virtual ICollection<Shipment> Shipments { get; set; }
        public virtual ICollection<TruckingDelivery> TruckingDeliveries { get; set; }
    }
}
