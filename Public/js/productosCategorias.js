document.addEventListener('DOMContentLoaded', () => {
    console.log('get ready');

    const main_columns = [
        { data: '...', className: 'text-center' },
        { data: '..', className: 'text-center' },
        { data: '.', className: 'text-center' }
    ];

    var data = []
    const dataTableConfig =  {
        "sProcessing": "Procesando...",
        "sLengthMenu": "Mostrar _MENU_ registros",
        "sZeroRecords": "No se encontraron resultados",
        "sEmptyTable": "Ningún dato disponible en esta tabla =(",
        "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
        "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
        "sInfoPostFix": "",
        "sSearch": "Buscar:",
        "sUrl": "",
        "sInfoThousands": ",",
        "sLoadingRecords": "Cargando...",
        "oPaginate": {
            "sFirst": "Primero",
            "sLast": "Último",
            "sNext": "<b>><b>",
            "sPrevious": "<b><<b>"
        }
    }

    var initializeDataTable = (tableID, data, columns) => {
        $(`#${tableID}`).DataTable({
            data: data,
            columns: columns,
            paging: true,
            info: true,
            searching: true,
            lengthChange: true,
            order: [],
            pageLength: 10,
            language: dataTableConfig


        });

    }


    initializeDataTable('mainTable', data, main_columns)
})