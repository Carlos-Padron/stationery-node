class CardTable {
  constructor(tableID, initialData, btnNextID, btnPrevID, pageCounterID) {
    this.currentPage = 1;
    this.rows = 12;

    this.table = document.querySelector(`#${tableID}`);
    this.data = initialData;
    this.next = document.querySelector(`#${btnNextID}`);
    this.prev = document.querySelector(`#${btnPrevID}`);
    this.pageCounter = document.querySelector(`#${pageCounterID}`);

    this.next.addEventListener("click", this.nextCardPage);
    this.prev.addEventListener("click", this.prevCardPage);
  }

  nextCardPage = () => {
    if (this.currentPage < this.numPages()) {
      this.currentPage++;
      this.reloadCardTable(this.data);
    }
  };

  prevCardPage = () => {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.reloadCardTable(this.data);
    }
  };

  reloadCardTable(newData) {
    /* if (newData != undefined) {
      this.data = newData;
    } */

    this.data = newData.length > 0 ? newData : [];

    // Validate page
    if (this.currentPage < 1) this.currentPage = 1;
    if (this.currentPage > this.numPages()) this.currentPage = this.numPages();

    this.table.innerHTML = "";

    if (this.data.length > 0) {
      let cardRow = [];

      for (
        var i = (this.currentPage - 1) * this.rows;
        i < this.currentPage * this.rows && i < this.data.length;
        i++
      ) {
        let cardContainer = document.createElement("div");
        cardContainer.classList.add("col-md-3", "col-sm-6", "col-12");

        let card = document.createElement("div");
        card.classList.add("card");

        let image = document.createElement("img");
        image.classList.add("card-img-top");
        image.setAttribute("src", this.data[i].imgURL);

        let cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        let h4 = document.createElement("h4");
        h4.classList.add("card-tile");
        h4.innerHTML = this.data[i].name ?? "";

        let desc = document.createElement("p");
        desc.classList.add("card-text");
        desc.innerHTML = this.data[i].description ?? "";

        let price = document.createElement("p");
        price.classList.add("card-text");
        price.innerHTML = this.data[i].price ?? "";

        let btnContainer = document.createElement("div");
        btnContainer.classList.add("d-flex", "justify-content-around");

        btnContainer.innerHTML = this.data[i].actions ?? "";

        cardBody.appendChild(h4);
        cardBody.appendChild(desc);
        cardBody.appendChild(price);
        cardBody.appendChild(btnContainer);

        card.appendChild(image);
        card.appendChild(cardBody);

        cardContainer.appendChild(card);

        cardRow.push(cardContainer);

        if (cardRow.length == 4) {
          let row = document.createElement("div");
          row.classList.add("row");
          cardRow.forEach((elem) => {
            row.appendChild(elem);
          });

          cardRow = [];

          this.table.appendChild(row);
        }

        if (i + 1 == this.data.length) {
          let row = document.createElement("div");
          row.classList.add("row");
          cardRow.forEach((elem) => {
            row.appendChild(elem);
          });

          cardRow = [];

          this.table.appendChild(row);
        }
      }
    } else {
      let div = document.createElement("div");
      div.innerHTML = "<p class='d-flex justify-content-center'>No se encontró información para mostrar. </p>";

      this.table.appendChild(div)
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
