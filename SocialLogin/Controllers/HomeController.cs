using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SocialLogin.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost, ValidateJsonAntiForgeryToken]
        public ActionResult AccessUser(string name, string email)
        {

            return Json(new { UserName = "khanhthuy@gmail.com" });
        }
    }
}