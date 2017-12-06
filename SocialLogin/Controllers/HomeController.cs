using System;
using System.Web.Mvc;

namespace SocialLogin.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.UserName = Convert.ToString(Session["UserName"]);
            return View();
        }

        [HttpPost, ValidateJsonAntiForgeryToken]
        public JsonResult Login(string name, string email)
        {
            Session["UserName"] = email;
            return Json(new { success = "True" });
        }

        [HttpPost, ValidateJsonAntiForgeryToken]
        public JsonResult LogOut()
        {
            Session.Abandon();
            return Json(new { success = "True" });
        }
    }


}