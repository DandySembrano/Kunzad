using System.Web;
using System.Web.Optimization;

namespace Kunzad
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/vendor/jquery/jquery-1.11.1.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
                        "~/vendor/jquery/jquery_ui/jquery-ui.min.js"));


            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                        "~/Scripts/angular.js",
                        "~/Scripts/angular-ng-grid.js",
                        "~/Scripts/angular-resource.js",
                        "~/Scripts/angular-route.js"));

            bundles.Add(new ScriptBundle("~/bundles/plugins").Include(
                        "~/vendor/plugins/daterange/daterangepicker.js",
                        "~/vendor/plugins/datepicker/js/bootstrap-datetimepicker.min.js",
                        "~/vendor/plugins/colorpicker/js/bootstrap-colorpicker.min.js",
                        "~/vendor/plugins/jquerymask/jquery.maskedinput.min.js",
                        "~/vendor/plugins/tagmanager/tagmanager.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/theme").Include(
                        "~/assets/js/utility/utility.js",
                        "~/assets/js/main.js",
                        "~/assets/js/demo.js"));

            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                        "~/Scripts/app/app.js",
                        "~/Scripts/app/services.js",
                        "~/Scripts/app/directives.js",
                        "~/Scripts/app/main.js",
                        "~/Scripts/app/contact.js",
                        "~/Scripts/app/about.js",
                        "~/Scripts/app/demo.js"
                        ));
        }
    }
}