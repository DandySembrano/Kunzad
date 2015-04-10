using System.Web;
using System.Web.Optimization;

namespace Kunzad
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {

            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                        "~/Scripts/angular.js",
                        "~/Scripts/angular-ng-grid.js",
                        "~/Scripts/angular-resource.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/theme").Include(
                        "~/assets/js/utility/utility.js",
                        "~/assets/js/main.js",
                        "~/assets/js/demo.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/utils").Include(
                        "~/assets/js/datatable.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                        "~/Scripts/app/app.js",
                        "~/Scripts/ng-context-menu.js",
                        "~/Scripts/app/datatable.js",
                        "~/Scripts/app/customergroup-ctrl.js"
                        ));
        }
    }
}