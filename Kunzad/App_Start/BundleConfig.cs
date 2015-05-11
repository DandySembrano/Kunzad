using System.Web;
using System.Web.Optimization;

namespace Kunzad
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            
            bundles.Add(new ScriptBundle("~/bundles/admin-ui").Include(
                        "~/assets/js/utility/utility.js",
                        "~/assets/js/main.js",
                        "~/assets/js/demo.js",
                        "~/vendor/plugins/magnific/jquery.magnific-popup.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                        "~/Scripts/angular.js",
                        "~/Scripts/angular-route.js",
                        "~/Scripts/angular-ng-grid.js",
                        "~/Scripts/angular-resource.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/utils").Include(
                        "~/Scripts/ng-context-menu.js",
                        "~/Scripts/spin.min.js",
                        "~/Scripts/ui-bootstrap-tpls-0.12.1.min.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                        "~/Scripts/app/app.js",
                        "~/Scripts/app/customer-ctrl.js",
                        "~/Scripts/app/customergroup-ctrl.js"
                        ));
        }
    }
}