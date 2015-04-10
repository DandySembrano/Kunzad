// Open modal form
function openModalForm() {
    jQuery.magnificPopup.open({
        removalDelay: 500, //delay removal by X to allow out-animation,
        items: { src: "#modal-panel" },
        callbacks: {
            beforeOpen: function (e) {
                var Animation = "mfp-flipInY";
                this.st.mainClass = Animation;
            }
        },
        midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
    })
}

function initDataTables() {
    // Init Datatables with Tabletools Addon    
    jQuery('#datatable').dataTable({
        "aoColumnDefs": [{
            'bSortable': false,
            'aTargets': [-1]
        }],
        "oLanguage": {
            "oPaginate": {
                "sPrevious": "",
                "sNext": ""
            }
        },
        "iDisplayLength": 5,
        "aLengthMenu": [
            [5, 10, 25, 50, -1],
            [5, 10, 25, 50, "All"]
        ],
        "sDom": 't<"dt-panelfooter clearfix"ip>',
        "oTableTools": {
            "sSwfPath": "vendor/plugins/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf"
        }
    });

    jQuery('#datatable2').dataTable({
        "aoColumnDefs": [{
            'bSortable': false,
            'aTargets': [-1]
        }],
        "oLanguage": {
            "oPaginate": {
                "sPrevious": "",
                "sNext": ""
            }
        },
        "iDisplayLength": 5,
        "aLengthMenu": [
            [5, 10, 25, 50, -1],
            [5, 10, 25, 50, "All"]
        ],
        "sDom": '<"dt-panelmenu clearfix"lfr>t<"dt-panelfooter clearfix"ip>',
        "oTableTools": {
            "sSwfPath": "vendor/plugins/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf"
        }
    });

    jQuery('#datatable3').dataTable({
        "aoColumnDefs": [{
            'bSortable': false,
            'aTargets': [-1]
        }],
        "oLanguage": {
            "oPaginate": {
                "sPrevious": "",
                "sNext": ""
            }
        },
        "iDisplayLength": 5,
        "aLengthMenu": [
            [5, 10, 25, 50, -1],
            [5, 10, 25, 50, "All"]
        ],
        "sDom": '<"dt-panelmenu clearfix"Tfr>t<"dt-panelfooter clearfix"ip>',
        "oTableTools": {
            "sSwfPath": "vendor/plugins/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf"
        }
    });

    jQuery('#datatable4').dataTable({
        "aoColumnDefs": [{
            'bSortable': false,
            'aTargets': [-1]
        }],
        "oLanguage": {
            "oPaginate": {
                "sPrevious": "",
                "sNext": ""
            }
        },
        "iDisplayLength": 5,
        "aLengthMenu": [
            [5, 10, 25, 50, -1],
            [5, 10, 25, 50, "All"]
        ],
        "sDom": 'T<"panel-menu dt-panelmenu"lfr><"clearfix">tip',

        "oTableTools": {
            "sSwfPath": "vendor/plugins/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf"
        }
    });

    // Multi-Column Filtering
    jQuery('#datatable5 thead th').each(function () {
        var title = jQuery('#datatable5 tfoot th').eq(jQuery(this).index()).text();
        jQuery(this).html('<input type="text" class="form-control" placeholder="Search ' + title + '" />');
    });

    // DataTable
    var table5 = jQuery('#datatable5').DataTable({
        "sDom": 't<"dt-panelfooter clearfix"ip>',
        "ordering": false
    });

    // Apply the search
    table5.columns().eq(0).each(function (colIdx) {
        jQuery('input', table5.column(colIdx).header()).on('keyup change', function () {
            table5
                .column(colIdx)
                .search(this.value)
                .draw();
        });
    });


    // ABC FILTERING
    var table6 = jQuery('#datatable6').DataTable({
        "sDom": 't<"dt-panelfooter clearfix"ip>',
        "ordering": false
    });

    var alphabet = jQuery('<div class="dt-abc-filter"/>').append('<span class="abc-label">Search: </span> ');
    var columnData = table6.column(0).data();
    var bins = bin(columnData);

    jQuery('<span class="active"/>')
        .data('letter', '')
        .data('match-count', columnData.length)
        .html('None')
        .appendTo(alphabet);

    for (var i = 0; i < 26; i++) {
        var letter = String.fromCharCode(65 + i);

        jQuery('<span/>')
            .data('letter', letter)
            .data('match-count', bins[letter] || 0)
            .addClass(!bins[letter] ? 'empty' : '')
            .html(letter)
            .appendTo(alphabet);
    }

    jQuery('#datatable6').parents('.panel').find('.panel-menu').addClass('dark').html(alphabet);

    alphabet.on('click', 'span', function () {
        alphabet.find('.active').removeClass('active');
        jQuery(this).addClass('active');

        _alphabetSearch = jQuery(this).data('letter');
        table6.draw();
    });

    var info = jQuery('<div class="alphabetInfo"></div>')
        .appendTo(alphabet);

    var _alphabetSearch = '';

    jQuery.fn.dataTable.ext.search.push(function (settings, searchData) {
        if (!_alphabetSearch) {
            return true;
        }
        if (searchData[0].charAt(0) === _alphabetSearch) {
            return true;
        }
        return false;
    });

    function bin(data) {
        var letter, bins = {};
        for (var i = 0, ien = data.length; i < ien; i++) {
            letter = data[i].charAt(0).toUpperCase();

            if (bins[letter]) {
                bins[letter]++;
            } else {
                bins[letter] = 1;
            }
        }
        return bins;
    }

    // ROW GROUPING
    var table7 = jQuery('#datatable7').DataTable({
        "columnDefs": [{
            "visible": false,
            "targets": 2
        }],
        "order": [
            [2, 'asc']
        ],
        "sDom": 't<"dt-panelfooter clearfix"ip>',
        "displayLength": 25,
        "drawCallback": function (settings) {
            var api = this.api();
            var rows = api.rows({
                page: 'current'
            }).nodes();
            var last = null;

            api.column(2, {
                page: 'current'
            }).data().each(function (group, i) {
                if (last !== group) {
                    jQuery(rows).eq(i).before(
                        '<tr class="row-label ' + group.replace(/ /g, '').toLowerCase() + '"><td colspan="5">' + group + '</td></tr>'
                    );
                    last = group;
                }
            });
        }
    });

    // Order by the grouping
    jQuery('#datatable7 tbody').on('click', 'tr.row-label', function () {
        var currentOrder = table7.order()[0];
        if (currentOrder[0] === 2 && currentOrder[1] === 'asc') {
            table7.order([2, 'desc']).draw();
        } else {
            table7.order([2, 'asc']).draw();
        }
    });


    // MISC DATATABLE HELPER FUNCTIONS

    // Add Placeholder text to datatables filter bar
    jQuery('.dataTables_filter input').attr("placeholder", "Enter Terms...");

}

