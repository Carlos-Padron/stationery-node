const SITE = 'localhost:3000/'

const dataTableConfig = {
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

var blockElem = (elem) => {
    const div = document.createElement('div')
    div.classList.add('overlay')

    const spinnerDiv = document.createElement('div')
    spinnerDiv.classList.add('sk-folding-cube')

    const spinner1 = document.createElement('div')
    spinner1.classList.add('sk-cube1', 'sk-cube')

    const spinner2 = document.createElement('div')
    spinner2.classList.add('sk-cube2', 'sk-cube')

    const spinner4 = document.createElement('div')
    spinner4.classList.add('sk-cube3', 'sk-cube')

    const spinner3 = document.createElement('div')
    spinner3.classList.add('sk-cube4', 'sk-cube')

    spinnerDiv.appendChild(spinner1)
    spinnerDiv.appendChild(spinner2)
    spinnerDiv.appendChild(spinner3)
    spinnerDiv.appendChild(spinner4)

    div.appendChild(spinnerDiv)

    elem.append(div)
}

var unblockElem = () => {

    const elem = document.querySelector('overlay')
    elem.remove()

}


