class NormalTable {
  constructor(
    tableID,
    initialData,
    headers,
    btnNextID,
    btnPrevID,
    pageCounterID
  ) {
    this.currentPage = 1;
    this.rows = 10;

    this.table = document.querySelector(`#${tableID}`);
    this.headers = headers;
    this.data = initialData;
    this.next = document.querySelector(`#${btnNextID}`);
    this.prev = document.querySelector(`#${btnPrevID}`);
    this.pageCounter = document.querySelector(`#${pageCounterID}`);

    this.next.addEventListener("click", this.nextPage);
    this.prev.addEventListener("click", this.prevPage);
  }

  nextPage = () => {
    if (this.currentPage < this.numPages()) {
      this.currentPage++;
      this.reloadTable();
    }
  };

  prevPage = () => {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.reloadTable();
    }
  };

  reloadTable(newData) {
    if (newData == undefined) {
      return;
    }
    this.data = newData;

    // Validate page
    if (this.currentPage < 1) this.currentPage = 1;
    if (this.currentPage > this.numPages()) this.currentPage = this.numPages();

    let tbody = this.table.children[1];
    tbody.innerHTML = "";

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
