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
    
    public partial class ShipmentDimension
    {
        public int Id { get; set; }
        public int ShipmentId { get; set; }
        public decimal Length { get; set; }
        public decimal Width { get; set; }
        public decimal Height { get; set; }
        public decimal VolumetricWeight { get; set; }
        public short Quantity { get; set; }
        public decimal TotalCBM { get; set; }
        public string Description { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<System.DateTime> LastUpdatedDate { get; set; }
        public Nullable<int> CreatedByUserId { get; set; }
        public Nullable<int> LastUpdatedByUserId { get; set; }
    
        public virtual Shipment Shipment { get; set; }
    }
}
