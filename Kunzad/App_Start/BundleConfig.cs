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
                        "~/vendor/plugins/magnific/jquery.magnific-popup.js",
                        //for datetime picker---------------------------------------------
                        "~/vendor/plugins/moment/moment.js",
                        "~/vendor/plugins/datepicker/js/bootstrap-datetimepicker.min.js",
                        //----------------------------------------------------------------
                        // for textfield price formatting --------------------------------
                        "~/vendor/plugins/priceFormat/price_format.js"
                        // ---------------------------------------------------------------
                        ));

            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                        "~/Scripts/angular.js",
                        "~/Scripts/angular-route.js",
                        "~/Scripts/angular-ng-grid.js",
                        "~/Scripts/angular-resource.js",
                        "~/Scripts/localforage.min.js",
                        "~/Scripts/angular-localForage.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/utils").Include(
                        "~/Scripts/ng-context-menu.js",
                        "~/Scripts/spin.min.js",
                        "~/Scripts/ui-bootstrap-tpls-0.12.1.min.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                        "~/vendor/plugins/uigrid/js/ui-grid.js",
                        "~/vendor/plugins/uigrid/js/csv.js",
                        "~/vendor/plugins/uigrid/js/pdfmake.js",
                        "~/vendor/plugins/uigrid/js/vfs_fonts.js",
                        "~/Scripts/app/app.js",
                        "~/Scripts/filter/filter.js",
                        "~/Scripts/service/restAPI.js",
                        "~/Scripts/directive/scrollableContainer.js",
                        "~/Scripts/directive/dataFiltering.js",
                        "~/Scripts/directive/addressModal.js",
                        "~/Scripts/directive/vesselVoyageModal.js",
                        "~/Scripts/directive/dataGrid1.js",
                        "~/Scripts/directive/dataGrid2.js",
                        "~/Scripts/directive/dataExport.js",
                        "~/Scripts/directive/ngEnter.js",
                        "~/Scripts/app/booking-ctrl.js",
                        "~/Scripts/app/seafreight-ctrl.js",
                        "~/Scripts/app/customer-ctrl.js",
                        "~/Scripts/app/customergroup-ctrl.js",
                        "~/Scripts/app/courier-ctrl.js",
                        "~/Scripts/app/airline-ctrl.js",
                        "~/Scripts/app/trucker-ctrl.js",
                        "~/Scripts/app/trucking-ctrl.js",
                        "~/Scripts/app/trucktype-ctrl.js",
                        "~/Scripts/app/industry-ctrl.js",
                        "~/Scripts/app/businessunittype-ctrl.js",
                        "~/Scripts/app/shipmenttype-ctrl.js",
                        "~/Scripts/app/servicecategory-ctrl.js",
                        "~/Scripts/app/contactnotype-ctrl.js",
                        "~/Scripts/app/driver-ctrl.js",
                        "~/Scripts/app/country-ctrl.js",
                        "~/Scripts/app/shippinglines-ctrl.js",
                        "~/Scripts/app/businessunit-ctrl.js",
                        "~/Scripts/app/serviceablearea-ctrl.js",
                        "~/Scripts/app/truckingwb-ctrl.js",
                        "~/Scripts/app/airfreight-ctrl.js",
                        "~/Scripts/app/courierdelivery-ctrl.js",
                        "~/Scripts/app/consolidation-ctrl.js",
                        "~/Scripts/app/documentation-ctrl.js",
                        "~/Scripts/app/seafreightloading-ctrl.js",
                        "~/Scripts/app/seafreightarrival-ctrl.js",
                        "~/Scripts/app/airfreightloading-ctrl.js",
                        "~/Scripts/app/airfreightarrival-ctrl.js",
                        "~/Scripts/app/pod-ctrl.js"
                        ));
        }
    }
}