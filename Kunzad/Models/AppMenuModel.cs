using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;

namespace Kunzad.Models
{
    public class AppMenuModel
    {
        public int UserId = 0;
        public List<MenuGroup> MenuGroups = new List<MenuGroup>();
        public KunzadDbEntities db = new KunzadDbEntities();

        public AppMenuModel()
        {
            MenuGroup menuGroup;
            MenuGroupItem menuGroupItem;
            var getMenuGroups = db.Menus.Where(menu => menu.ParentId == null).OrderBy(menu => menu.Sequence);
            foreach (Menu mg in getMenuGroups)
            {
                menuGroup = new MenuGroup();
                menuGroup.Id = mg.Id;
                menuGroup.Name = mg.Name;
                menuGroup.Sequence = mg.Sequence;
                menuGroup.ParentId = mg.ParentId;
                menuGroup.Description = mg.Description;
                menuGroup.Link = mg.Link == null ? "#" : mg.Link;
                menuGroup.Icon = mg.IconClass;
                menuGroup.IsParent = mg.IsParent;
                menuGroup.Status = mg.Status;

                var getMenuGroupItems = db.Menus.Where(menu => menu.ParentId == mg.Id).OrderBy(menu => menu.Sequence);
                menuGroup.MenuGroupItems = new List<MenuGroupItem>();

                foreach (Menu mgi in getMenuGroupItems) {
                    menuGroupItem = new MenuGroupItem();
                    menuGroupItem.Id = mgi.Id;
                    menuGroupItem.Name = mgi.Name;
                    menuGroupItem.Sequence = mgi.Sequence;
                    menuGroupItem.ParentId = mgi.ParentId;
                    menuGroupItem.Description = mgi.Description;
                    menuGroupItem.Link = mgi.Link == null ? "#" : mgi.Link;
                    menuGroupItem.Icon = mgi.IconClass;
                    menuGroupItem.IsParent = mgi.IsParent;
                    menuGroupItem.Status = mgi.Status;
                    menuGroupItem.MenuItems = new List<MenuItem>();
                    var getMenuItems = db.Menus.Where(menu => menu.ParentId == mgi.Id).OrderBy(menu => menu.Sequence);
                    foreach (Menu mi in getMenuItems)
                        menuGroupItem.MenuItems.Add(new MenuItem(mi.Id, mi.Sequence, mi.ParentId, mi.Name, mi.Description, mi.Link, mi.IconClass, mi.IsParent, mi.Status));
                    menuGroup.MenuGroupItems.Add(menuGroupItem);
                }
                MenuGroups.Add(menuGroup);
            }
        }
        public void setUserId(int userId)
        {
            this.UserId = userId;
        }

        public int getUserId()
        {
            return this.UserId;
        }
    }

    public class MenuGroup
    {
        public int Id { get; set; }
        public Nullable<int> Sequence { get; set; }
        public Nullable<int> ParentId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Link { get; set; }
        public string Icon { get; set; }
        public string IsParent { get; set; }
        public Nullable<int> Status { get; set; }
        public List<MenuGroupItem> MenuGroupItems { get; set; }
    }

    public class MenuGroupItem
    {
        public int Id { get; set; }
        public Nullable<int> Sequence { get; set; }
        public Nullable<int> ParentId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Link { get; set; }
        public string Icon { get; set; }
        public string IsParent { get; set; }
        public Nullable<int> Status { get; set; }
        public List<MenuItem> MenuItems { get; set; }
    }

    public class MenuItem
    {
        public int Id { get; set; }
        public Nullable<int> Sequence { get; set; }
        public Nullable<int> ParentId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Link { get; set; }
        public string Icon { get; set; }
        public string IsParent { get; set; }
        public Nullable<int> Status { get; set; }

        public MenuItem(int Id, int? Sequence, int? ParentId, string Name, string Description, string Link, string IconClass, string IsParent, int? Status)
        {
            this.Id = Id;
            this.Name = Name;
            this.Sequence = Sequence;
            this.ParentId = ParentId;
            this.Description = Description;
            this.Link = Link == null ? "#" : Link;
            this.Icon = IconClass;
            this.IsParent = IsParent;
            this.Status = Status;
        }
    }


}