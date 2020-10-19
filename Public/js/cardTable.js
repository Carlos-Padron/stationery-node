class CardTable{

    constructor(tableID, initialData, btnNextID, btnPrevID, pageCounterID){

        this.currentPage  = 1;
        this.rows         = 12

        this.table        = document.querySelector(`#${tableID}`)
        this.data         = initialData
        this.next         = document.querySelector(`#${btnNextID}`);
        this.prev         = document.querySelector(`#${btnPrevID}`)
        this.pageCounter  = document.querySelector(`#${pageCounterID}`)

        this.next.addEventListener('click', this.nextCardPage)
        this.prev.addEventListener('click', this.prevCardPage)
    }

    nextCardPage = () => {
        if (this.currentPage < this.numPages()) {
            this.currentPage++;
            this.reloadCardTable();
        }
    }
    
     prevCardPage = () => {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.reloadCardTable();
        }
    }

     reloadCardTable(newData) {

        if (newData != undefined) {
            this.data = newData
        }
        // Validate page
        if (this.currentPage < 1) this.currentPage = 1;
        if (this.currentPage > this.numPages()) this.currentPage = this.numPages();
    
        this.table.innerHTML = "";
    
    
        for (var i = (this.currentPage - 1) * this.rows; i < (this.currentPage * this.rows) && i < this.data.length; i++) {
    
            let card = document.createElement('div')
            card.classList.add('card', 'my-3')
    
            let image = document.createElement('img')
            image.classList.add('card-img-top')
            image.setAttribute('src', 'http://placehold.it/100x100')
    
            let cardBody = document.createElement('div')
            cardBody.classList.add('card-body')
    
            let h4 = document.createElement('h4')
            h4.classList.add('card-tile')
            h4.innerHTML = this.data[i]
    
            let p = document.createElement('p')
            p.classList.add('card-text')
            p.innerHTML = this.data[i]
    
            let btnContainer = document.createElement('div')
            btnContainer.classList.add('d-flex', 'justify-content-around')
    
            let editBtn = document.createElement('button')
            editBtn.classList.add('btn', 'btn-primary')
            editBtn.setAttribute('type', 'button')
            editBtn.textContent = 'Editar'
    
            let deleteBtn = document.createElement('button')
            deleteBtn.classList.add('btn', 'btn-primary')
            deleteBtn.setAttribute('type', 'button')
            deleteBtn.textContent = 'Borrar'
    
            btnContainer.appendChild(editBtn)
            btnContainer.appendChild(deleteBtn)
    
            cardBody.appendChild(h4)
            cardBody.appendChild(p)
            cardBody.appendChild(btnContainer)
    
            card.appendChild(image)
            card.appendChild(cardBody)
    
            this.table.appendChild(card)
    
        }
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
