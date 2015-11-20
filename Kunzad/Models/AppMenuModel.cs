using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Kunzad.Models
{
    public class AppMenuModel
    {
        public List<MenuGroup> MenuGroups = new List<MenuGroup>();

        public AppMenuModel()
        {
            MenuGroup menuGroup;
            MenuGroupItem m;

            // Transport Menu Group ////////////////////////////////////////////////////////////////////////
            menuGroup = new MenuGroup();
            menuGroup.Name = "TMS";
            menuGroup.MenuGroupItems = new List<MenuGroupItem>();

            // Shipment
            m = new MenuGroupItem();
            m.Name = "Shipment";
            m.Icon = "glyphicons glyphicons-cargo";
            m.IsSubMenu = true;
            m.Link = "#";
            m.MenuItems = new List<MenuItem>();
            m.MenuItems.Add(new MenuItem("Booking", "glyphicons glyphicons-circle_plus", "#/booking"));
            m.MenuItems.Add(new MenuItem("Documentation", "glyphicons glyphicons-circle_plus", "#/documentation"));
            menuGroup.MenuGroupItems.Add(m);

            // Transport
            m = new MenuGroupItem();
            m.Name = "Transport";
            m.Icon = "glyphicons glyphicons-move";
            m.IsSubMenu = true;
            m.Link = "#";
            m.MenuItems = new List<MenuItem>();
            m.MenuItems.Add(new MenuItem("Dispatching", "glyphicons glyphicons-truck", "#/trucking"));
            m.MenuItems.Add(new MenuItem("Trucking Info", "glyphicons glyphicons-truck", "#/truckingwb"));
            m.MenuItems.Add(new MenuItem("Sea Freight", "glyphicons glyphicons-boat", "#/seafreight"));
            m.MenuItems.Add(new MenuItem("Air Freight", "glyphicons glyphicons-airplane", "#/airfreight"));
            m.MenuItems.Add(new MenuItem("Courier Delivery", "glyphicons glyphicons-truck", "#/courierdelivery"));
            menuGroup.MenuGroupItems.Add(m);

            // Consolidate
            m = new MenuGroupItem();
            m.Name = "Consolidate";
            m.Icon = "glyphicons glyphicons-globe";
            m.IsSubMenu = true;
            m.Link = "#";
            m.MenuItems = new List<MenuItem>();
            m.MenuItems.Add(new MenuItem("Batching", "fa fa-th", "#/consolidation/batch"));
            m.MenuItems.Add(new MenuItem("Van Stuffing", "fa fa-th", "#/consolidation/vanstuff"));
            menuGroup.MenuGroupItems.Add(m);

            // Check In
            m = new MenuGroupItem();
            m.Name = "Check-In";
            m.Icon = "glyphicon glyphicon-check";
            m.IsSubMenu = true;
            m.Link = "#";
            m.MenuItems = new List<MenuItem>();
            m.MenuItems.Add(new MenuItem("Sea Freight Loading", "fa fa-th", "#/seafreightloading"));
            m.MenuItems.Add(new MenuItem("Sea Freight Arrival", "fa fa-th", "#/seafreightarrival"));
            m.MenuItems.Add(new MenuItem("Air Freight Loading", "fa fa-th", "#/airfreightloading"));
            m.MenuItems.Add(new MenuItem("Air Freight Arrival", "fa fa-th", "#/airfreightarrival"));
            m.MenuItems.Add(new MenuItem("Delivery", "glyphicons glyphicons-truck", "#/pod"));
            m.MenuItems.Add(new MenuItem("Delivery Exception", "glyphicons glyphicons-truck", "#/deliveryexception"));
            m.MenuItems.Add(new MenuItem("Delivery Exception-Batching", "glyphicons glyphicons-truck", "#/deliveryexceptionbatching"));
            menuGroup.MenuGroupItems.Add(m);

            MenuGroups.Add(menuGroup);


            // References Menu Group ////////////////////////////////////////////////////////////////////////
            menuGroup = new MenuGroup();
            menuGroup.Name = "References";
            menuGroup.MenuGroupItems = new List<MenuGroupItem>();

            // Customer
            m = new MenuGroupItem();
            m.Name = "Customer";
            m.Icon = "glyphicons fa fa-male";
            m.IsSubMenu = true;
            m.Link = "#";
            m.MenuItems = new List<MenuItem>();
            m.MenuItems.Add(new MenuItem("Customer", "glyphicons glyphicons-file", "#/customers"));
            m.MenuItems.Add(new MenuItem("Customer Group", "glyphicons glyphicons-file", "#/customergroups"));
            menuGroup.MenuGroupItems.Add(m);

            // Network
            m = new MenuGroupItem();
            m.Name = "Network";
            m.Icon = "glyphicons glyphicons-global";
            m.IsSubMenu = true;
            m.Link = "#";
            m.MenuItems = new List<MenuItem>();
            m.MenuItems.Add(new MenuItem("Business Unit", "fa fa-sitemap", "#businessunit"));
            m.MenuItems.Add(new MenuItem("Delivery Area", "fa fa-location-arrow", "#serviceablearea"));
            menuGroup.MenuGroupItems.Add(m);

            // Partners
            m = new MenuGroupItem();
            m.Name = "Partners";
            m.Icon = "glyphicons glyphicons-group";
            m.IsSubMenu = true;
            m.Link = "#";
            m.MenuItems = new List<MenuItem>();
            m.MenuItems.Add(new MenuItem("Airlines", "glyphicons glyphicons-airplane", "#/airlines"));
            m.MenuItems.Add(new MenuItem("Trucker", "glyphicons glyphicons-truck", "#/truckers"));
            m.MenuItems.Add(new MenuItem("Shipping Lines", "glyphicons glyphicons-boat", "#/shippinglines"));
            menuGroup.MenuGroupItems.Add(m);

            MenuGroups.Add(menuGroup);

            // Admin Menu Group ////////////////////////////////////////////////////////////////////////
            menuGroup = new MenuGroup();
            menuGroup.Name = "Admin";
            menuGroup.MenuGroupItems = new List<MenuGroupItem>();

            // Configure
            m = new MenuGroupItem();
            m.Name = "Configure";
            m.Icon = "glyphicons glyphicons-settings";
            m.IsSubMenu = true;
            m.Link = "#";
            m.MenuItems = new List<MenuItem>();
            m.MenuItems.Add(new MenuItem("Business Unit Type", "glyphicons glyphicons-file", "#/businessunittype"));
            m.MenuItems.Add(new MenuItem("Contact Number Type", "glyphicons glyphicons-file", "#/contactnotype"));
            m.MenuItems.Add(new MenuItem("Country", "glyphicons glyphicons-file", "#/country"));
            m.MenuItems.Add(new MenuItem("Courier", "glyphicons glyphicons-file", "#/courier"));
            m.MenuItems.Add(new MenuItem("Driver", "glyphicons glyphicons-file", "#/driver"));
            m.MenuItems.Add(new MenuItem("Industry", "glyphicons glyphicons-file", "#/industry"));
            m.MenuItems.Add(new MenuItem("Service Category", "glyphicons glyphicons-file", "#/servicecategory"));
            m.MenuItems.Add(new MenuItem("Shipment Type", "glyphicons glyphicons-file", "#/shipmenttype"));
            m.MenuItems.Add(new MenuItem("Truck Type", "glyphicons glyphicons-file", "#/trucktype"));
            menuGroup.MenuGroupItems.Add(m);

            // Security
            m = new MenuGroupItem();
            m.Name = "Security";
            m.Icon = "glyphicons glyphicons-security_camera";
            m.IsSubMenu = true;
            m.Link = "#";
            m.MenuItems = new List<MenuItem>();
            m.MenuItems.Add(new MenuItem("Users", "glyphicons glyphicons-user", "#"));
            m.MenuItems.Add(new MenuItem("Roles", "glyphicons glyphicons-file", "#"));
            menuGroup.MenuGroupItems.Add(m);

            MenuGroups.Add(menuGroup);

        }

    }

    public class MenuGroup
    {
        public string Name { get; set; }
        public List<MenuGroupItem> MenuGroupItems { get; set; }
    }

    public class MenuGroupItem
    {
        public string Name { get; set; }
        public string Icon { get; set; }
        public string Link { get; set; }
        public bool IsSubMenu { get; set; }
        public List<MenuItem> MenuItems { get; set; }
    }

    public class MenuItem
    {
        public string Name { get; set; }
        public string Icon {get; set; }
        public string Link {get; set; }

        public MenuItem(string name, string icon, string link)
        {
            this.Name = name;
            this.Icon = icon;
            this.Link = link;
            
        }
    }

}