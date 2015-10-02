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
    
    public partial class Address
    {
        public Address()
        {
            this.Shipments = new HashSet<Shipment>();
            this.Shipments1 = new HashSet<Shipment>();
            this.TruckingDeliveries = new HashSet<TruckingDelivery>();
        }
    
        public int Id { get; set; }
        public string Line1 { get; set; }
        public string Line2 { get; set; }
        public int CityMunicipalityId { get; set; }
        public string PostalCode { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<System.DateTime> LastUpdatedDate { get; set; }
        public Nullable<int> CreatedByUserId { get; set; }
        public Nullable<int> LastUpdatedByUserId { get; set; }
    
        public virtual CityMunicipality CityMunicipality { get; set; }
        public virtual ICollection<Shipment> Shipments { get; set; }
        public virtual ICollection<Shipment> Shipments1 { get; set; }
        public virtual ICollection<TruckingDelivery> TruckingDeliveries { get; set; }
    }
}
