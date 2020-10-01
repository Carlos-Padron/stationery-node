$(document).ready(function () {
    const SITE = 'localhost:3000/'


    var initializeDataTable = (tableID, data, columns) => {
        $(`#${tableID}`).DataTable({
            data: data,
            columns: columns,
            paging: true,
            info: true,
            searching: true,
            lengthChange: true,
            order: [],
            pageLength: true

        });

    }

});