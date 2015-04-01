jQuery(document).ready(function () {

        "use strict";

        // Init Theme Core
        Core.init();

        // Init Demo JS
        Demo.init();

        // daterange plugin options
        var rangeOptions = {
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
                'Last 7 Days': [moment().subtract('days', 6), moment()],
                'Last 30 Days': [moment().subtract('days', 29), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
            },
            startDate: moment().subtract('days', 29),
            endDate: moment()
        }

        // Init daterange plugin
        $('#daterangepicker1').daterangepicker();

        // Init daterange plugin
        $('#daterangepicker2').daterangepicker(
            rangeOptions,
            function (start, end) {
                $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            }
        );

        // Init daterange plugin
        $('#inline-daterange').daterangepicker(
            rangeOptions,
            function (start, end) {
                $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            }
        );

        // Init datetimepicker - fields
        $('#datetimepicker1').datetimepicker();
        $('#datetimepicker2').datetimepicker();


        // Init datetimepicker - inline + range detection
        $('#datetimepicker3').datetimepicker({
            defaultDate: "9/4/2014",
            inline: true,
        });

        // Init datetimepicker - fields + Date disabled (only time picker)
        $('#datetimepicker5').datetimepicker({
            defaultDate: "9/25/2014",
            pickDate: false,
        });
        // Init datetimepicker - fields + Date disabled (only time picker)
        $('#datetimepicker6').datetimepicker({
            defaultDate: "9/25/2014",
            pickDate: false,
        });
        // Init datetimepicker - inline + Date disabled (only time picker)
        $('#datetimepicker7').datetimepicker({
            defaultDate: "9/25/2014",
            pickDate: false,
            inline: true
        });

        // Init colorpicker plugin
        $('#demo_apidemo').colorpicker({
            color: bgPrimary
        });
        $('.demo-auto').colorpicker();

        // Init jQuery Tags Manager
        $(".tm-input").tagsManager({
            tagsContainer: '.tags',
            prefilled: ["Miley Cyrus", "Apple", "A Long Tag", "Na uh"],
            tagClass: 'tm-tag-info',
        });

        // Init Boostrap Multiselect
        $('#multiselect1').multiselect();
        $('#multiselect2').multiselect({
            includeSelectAllOption: true
        });
        $('#multiselect3').multiselect();
        $('#multiselect4').multiselect({
            enableFiltering: true,
        });
        $('#multiselect5').multiselect({
            buttonClass: 'multiselect dropdown-toggle btn btn-default btn-primary'
        });
        $('#multiselect6').multiselect({
            buttonClass: 'multiselect dropdown-toggle btn btn-default btn-info'
        });
        $('#multiselect7').multiselect({
            buttonClass: 'multiselect dropdown-toggle btn btn-default btn-success'
        });
        $('#multiselect8').multiselect({
            buttonClass: 'multiselect dropdown-toggle btn btn-default btn-warning'
        });

        // Init jQuery spinner init - default
        $("#spinner1").spinner();

        // Init jQuery spinner init - currency
        $("#spinner2").spinner({
            min: 5,
            max: 2500,
            step: 25,
            start: 1000,
            //numberFormat: "C"
        });

        // Init jQuery spinner init - decimal
        $("#spinner3").spinner({
            step: 0.01,
            numberFormat: "n"
        });

        // jQuery Time Spinner settings
        $.widget("ui.timespinner", $.ui.spinner, {
            options: {
                // seconds
                step: 60 * 1000,
                // hours
                page: 60
            },
            _parse: function (value) {
                if (typeof value === "string") {
                    // already a timestamp
                    if (Number(value) == value) {
                        return Number(value);
                    }
                    return +Globalize.parseDate(value);
                }
                return value;
            },

            _format: function (value) {
                return Globalize.format(new Date(value), "t");
            }
        });
        // Init jQuery Time Spinner
        $("#spinner4").timespinner();


        // Init jQuery masked inputs
        $('.date').mask('99/99/9999');
        $('.time').mask('99:99:99');
        $('.date_time').mask('99/99/9999 99:99:99');
        $('.zip').mask('99999-999');
        $('.phone').mask('(999) 999-9999');
        $('.phoneext').mask("(999) 999-9999 x99999");
        $(".money").mask("999,999,999.999");
        $(".product").mask("999.999.999.999");
        $(".tin").mask("99-9999999");
        $(".ssn").mask("999-99-9999");
        $(".ip").mask("9ZZ.9ZZ.9ZZ.9ZZ");
        $(".eyescript").mask("~9.99 ~9.99 999");
        $(".custom").mask("9.99.999.9999");

    });