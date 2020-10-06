let currentPage = 1;
let rows = 5
let table;
let data;
let next;
let prev;
let pageCounter;

var initTable = (tableID, initialData, btnNextID, btnPrevID, pageCounterID) => {
    next = document.querySelector(`#${btnNextID}`);
    prev = document.querySelector(`#${btnPrevID}`)
    table = document.querySelector(`#${tableID}`)
    pageCounter = document.querySelector(`#${pageCounterID}`)
    data = initialData


    next.addEventListener('click', nextPage)
    prev.addEventListener('click', prevPage)
}


function nextPage() {
    if (currentPage < numPages()) {
        currentPage++;
        reloadTable();
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;

        reloadTable();

    }
}


var reloadTable = (newData) => {

    if (newData != undefined) {
        data = newData
    }
    // Validate page
    if (currentPage < 1) currentPage = 1;
    if (currentPage > numPages()) currentPage = numPages();

    table.innerHTML = "";

    console.log(currentPage);

    for (var i = (currentPage - 1) * rows; i < (currentPage * rows) && i < data.length; i++) {

        let card = document.createElement('div')
        card.classList.add('card', 'my-3')

        let image = document.createElement('img')
        image.classList.add('card-img-top')
        image.setAttribute('src', 'http://placehold.it/100x100')

        let cardBody = document.createElement('div')
        cardBody.classList.add('card-body')

        let h4 = document.createElement('h4')
        h4.classList.add('card-tile')
        h4.innerHTML = data[i]

        let p = document.createElement('p')
        p.classList.add('card-text')
        p.innerHTML = data[i]

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

        table.appendChild(card)

    }
    pageCounter.innerHTML = currentPage + "/" + numPages();

    if (currentPage == 1) {
        prev.style.visibility = "hidden";
    } else {
        prev.style.visibility = "visible";
    }

    if (currentPage == numPages()) {
        next.style.visibility = "hidden";
    } else {
        next.style.visibility = "visible";
    }
}

function numPages() {
    return Math.ceil(data.length / rows);
}