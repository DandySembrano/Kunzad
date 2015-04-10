using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Kunzad.Controllers
{
    public class ReferencesController : Controller
    {
        // GET: References
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult _CustomerGroups()
        {
            ViewBag.PanelTitle = "Customer Group";
            return View();
        }

        public ActionResult _Airlines()
        {
            return View();
        }

        public ActionResult _DataTables()
        {
            return View();
        }


    }
}