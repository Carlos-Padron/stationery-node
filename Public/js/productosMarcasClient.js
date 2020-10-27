document.addEventListener('DOMContentLoaded', () => {

    



    var data = [
        { "campo1": "valor1", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor1", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor1", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor1", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor1", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor1", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor1", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor1", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor1", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor1", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor1", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor2", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor2", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor2", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor2", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor2", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor2", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor2", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor2", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor2", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor2", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor2", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor2", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor2", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor3", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor3", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor3", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor3", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor3", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor3", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor3", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor3", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor3", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor3", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor3", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor3", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor3", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor3", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor3", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor3", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor3", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor3", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor4", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor4", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor4", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor1", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor1", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor1", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor1", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor1", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor1", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor1", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor1", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor1", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor1", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor1", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor1", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor1", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor1", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor1", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor1", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor1", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor1", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor1", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor1", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor1", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor1", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor1", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor1", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor1", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },
        { "campo1": "valor1", "campo2": "valor2", "campo3": "valor3", "campo4": "valor4", "campo5": "valor5", "campo6": '<button type="button" class="btn btn-dark">Dark</button>' },

    ]

    //Initial Actions
    //initTable('mainTable', data, 'btnNext', 'btnPrev', 'pageCounter')
    //reloadTable()

    let normalTable = new NormalTable('mainTable', ['col1', 'col2', 'col3', 'col1', 'col2', 'col3'], data, 'btnNext', 'btnPrev', 'pageCounter')
    normalTable.reloadTable()


})