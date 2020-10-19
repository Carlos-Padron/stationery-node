class NormalTable{

    constructor(tableID, headers, initialData, btnNextID, btnPrevID, pageCounterID){

        this.currentPage  = 1;
        this.rows         = 10

        this.headers      = headers
        this.table        = document.querySelector(`#${tableID}`)
        this.data         = initialData
        this.next         = document.querySelector(`#${btnNextID}`);
        this.prev         = document.querySelector(`#${btnPrevID}`)
        this.pageCounter  = document.querySelector(`#${pageCounterID}`)

        this.next.addEventListener('click', this.nextPage)
        this.prev.addEventListener('click', this.prevPage)
    }

    nextPage = () => {
        if (this.currentPage < this.numPages()) {
            this.currentPage++;
            this.reloadTable();
        }
    }
    
     prevPage = () => {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.reloadTable();
        }
    }

     reloadTable(newData) {

        if (newData != undefined) {
            this.data = newData
        }
        // Validate page
        if (this.currentPage < 1) this.currentPage = 1;
        if (this.currentPage > this.numPages()) this.currentPage = this.numPages();
    
        this.table.innerHTML = "";
    
        let tableContainer = document.createElement('div')
        tableContainer.classList.add('table-responsive')

        let table = document.createElement('table')
        table.classList.add('table', 'align-items-center')

        let thead = document.createElement('thead')
        thead.classList.add('thead-light')

        let tr = document.createElement('tr')

        this.headers.forEach(elem => {
            let th = document.createElement('th')
            th.innerHTML = elem
            tr.appendChild(th)
        });


        //TODO: Finish NormaTable implentation
        thead.appendChild(tr)
        table.appendChild(thead)
        tableContainer.appendChild(table)
    
        for (var i = (this.currentPage - 1) * this.rows; i < (this.currentPage * this.rows) && i < this.data.length; i++) {
    
            //TODO: render table body
            
        }
        
        this.table.appendChild(tableContainer)

        this.pageCounter.innerHTML = this.currentPage + "/" + this.numPages();
    
        if (this.currentPage == 1) {
            this.prev.style.visibility = "hidden";
        } else {
            this.prev.style.visibility = "visible";
        }
    
        if (this.currentPage == this.numPages()) {
            this.next.style.visibility = "hidden";
        } else {
            this.next.style.visibility = "visible";
        }
    }
    
    numPages() {
        return Math.ceil(this.data.length / this.rows);
    }
    
}
