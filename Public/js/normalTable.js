class NormalTable {
  constructor(
    tableID,
    initialData,
    headers,
    btnNextID,
    btnPrevID,
    pageCounterID,
    colspan,
    nRows
  ) {
    this.currentPage = 1;

    this.table = document.querySelector(`#${tableID}`);
    this.headers = headers;
    this.data = initialData;
    this.next = document.querySelector(`#${btnNextID}`);
    this.prev = document.querySelector(`#${btnPrevID}`);
    this.pageCounter = document.querySelector(`#${pageCounterID}`);
    this.next.addEventListener("click", this.nextPage);
    this.prev.addEventListener("click", this.prevPage);
    this.colspan = colspan

    this.rows = nRows ?? 10;

  }

  nextPage = () => {
    if (this.currentPage < this.numPages()) {
      this.currentPage++;
      this.reloadTable(this.data);
    }
  };

  prevPage = () => {

    if (this.currentPage > 1) {
      this.currentPage--;
      this.reloadTable(this.data);
    }
  };

  reloadTable(newData) {
    // if (newData == undefined) {
    //   return;
    // }

    this.data = (newData.length > 0) ? newData : []

    // Validate page
    if (this.currentPage < 1) this.currentPage = 1;
    if (this.currentPage > this.numPages()) this.currentPage = this.numPages();

    let tbody = this.table.children[1];
    tbody.innerHTML = "";


    if (this.data.length > 0) {
      for (
        var i = (this.currentPage - 1) * this.rows;
        i < this.currentPage * this.rows && i < this.data.length;
        i++
      ) {
        let tr = document.createElement("tr");
        let currentObj = this.data[i];
  
        this.headers.forEach((header) => {
          Object.keys(currentObj).forEach((key) => {
            if (key === header.column) {
              let td = document.createElement("td");
              td.innerHTML = currentObj[key];
              td.className += header.class
              tr.appendChild(td);
            }
          });
        });
  
        tbody.appendChild(tr);
      }
    }else{
      let tr = document.createElement('tr')
      let td = document.createElement('td')
      td.setAttribute('colspan', this.colspan)
      td.classList.add('text-center')
      td.innerHTML = "No se encontró información para mostrar."

      tr.appendChild(td)

      tbody.appendChild(tr)

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
