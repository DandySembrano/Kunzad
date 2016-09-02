using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Kunzad.Controllers
{
    public class AuthenticationController : Controller
    {
        // GET: Authentication
        public ActionResult Denied()
        {
            return View();
        }
    }
}