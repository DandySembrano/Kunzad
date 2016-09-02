using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Kunzad.Controllers
{
    public class LandingPageController : Controller
    {
        // GET: LandingPage
        public ActionResult Index()
        {
            return View();
        }
    }
}
