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
            // Transport Menu Group
            MenuGroup menuGroup1 = new MenuGroup();
            menuGroup1.Name = "TMS";
            menuGroup1.MenuGroupItems = new List<MenuGroupItem>();
            MenuGroupItem m;
            
            // Shipment
            m = new MenuGroupItem();
            m.Name = "Shipment";
            m.Icon = "glyphicons glyphicons-cargo";
            m.IsSubMenu = true;
            m.Link = "#";
            m.MenuItems = new List<MenuItem>();
            m.MenuItems.Add(new MenuItem("Create New", "glyphicons glyphicons-circle_plus", "http://www.yahoo.com"));
            m.MenuItems.Add(new MenuItem("Outbound", "glyphicons glyphicons-inbox_out", "#"));
            m.MenuItems.Add(new MenuItem("Inbound", "glyphicons glyphicons-inbox_in", "#"));
            menuGroup1.MenuGroupItems.Add(m);

            // Transport
            m = new MenuGroupItem();
            m.Name = "Transport";
            m.Icon = "glyphicons glyphicons-move";
            m.IsSubMenu = true;
            m.Link = "#";
            m.MenuItems = new List<MenuItem>();
            m.MenuItems.Add(new MenuItem("Trucking", "glyphicons glyphicons-truck", "#"));
            m.MenuItems.Add(new MenuItem("Sea Freight", "glyphicons glyphicons-boat", "#"));
            m.MenuItems.Add(new MenuItem("Air Freight", "glyphicons glyphicons-airplane", "#"));
            menuGroup1.MenuGroupItems.Add(m);

            MenuGroups.Add(menuGroup1);

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