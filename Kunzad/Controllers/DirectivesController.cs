using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Kunzad.Controllers
{
    public class DirectivesController : Controller
    {
        // GET: Directives
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult DataGrid1()
        {
            return View();
        }
        public ActionResult DataGrid2()
        {
            return View();
        }
        public ActionResult DataFiltering()
        {
            return View();
        }

        public ActionResult AddressModal()
        {
            return View();
        }
    }
}