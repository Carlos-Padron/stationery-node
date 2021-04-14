class CardTable {
  constructor(
    tableID,
    initialData,
    btnNextID,
    btnPrevID,
    pageCounterID,
    rows = 12,
    fourCols = true
  ) {
    this.currentPage = 1;
    this.rows = rows;

    this.table = document.querySelector(`#${tableID}`);
    this.data = initialData;
    this.next = document.querySelector(`#${btnNextID}`);
    this.prev = document.querySelector(`#${btnPrevID}`);
    this.pageCounter = document.querySelector(`#${pageCounterID}`);

    this.next.addEventListener("click", this.nextCardPage);
    this.prev.addEventListener("click", this.prevCardPage);

    this.fourCols = fourCols ? true : false;
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
        if (this.fourCols == true) {
          cardContainer.classList.add(
            "col-12",
            "col-sm-6",
            "col-md-4",
            "col-lg-3"
          );
        } else {
          cardContainer.classList.add(
            "col-12",
            "col-sm-6",
            "col-md-4",
            "col-lg-4"
          );
        }

        let card = document.createElement("div");
        card.classList.add("card");

        let image = document.createElement("img");
        image.classList.add("card-img-top");
        image.setAttribute("src", `${this.data[i]?.imageRelativePath}`);
        image.style.height = "150px";
        image.style.objectFit = "cover";
        image.setAttribute("alt", " ");

        let cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        let productName = document.createElement("h4");
        productName.classList.add("card-tile");
        productName.innerHTML = this.data[i].name ?? "";

        let containerInfo = document.createElement("div");
        let quantityPriceRow = document.createElement("div");
        let brandTypeRow = document.createElement("div");

        quantityPriceRow.classList.add("d-flex", "justify-content-between");
        quantityPriceRow.innerHTML = `
          <p><strong>Cantidad:</strong> ${
            this.data[i]?.quantity ?? "cantidad"
          } </p>
          <p><strong>Precio:</strong>   $${
            this.data[i]?.price ?? "precio"
          } </p>`;

        brandTypeRow.classList.add("d-flex", "justify-content-between");
        brandTypeRow.innerHTML = `
          <p><strong>Tipo de artículo:</strong> ${
            this.data[i]?.articleType?.name ?? "tipo"
          } </p>
          <p><strong>Marca:</strong>   ${
            this.data[i]?.brand?.name ?? "marca"
          } </p>`;

        containerInfo.appendChild(quantityPriceRow);
        containerInfo.appendChild(brandTypeRow);

        let btnContainer = document.createElement("div");
        btnContainer.classList.add("d-flex", "justify-content-between");

        btnContainer.innerHTML = this.data[i].actions ?? "";

        cardBody.appendChild(productName);
        cardBody.appendChild(containerInfo);
        cardBody.appendChild(btnContainer);

        card.appendChild(image);
        card.appendChild(cardBody);

        cardContainer.appendChild(card);

        cardRow.push(cardContainer);

        if (this.fourCols == true) {
          if (cardRow.length == 4) {
            let row = document.createElement("div");
            row.classList.add("row");
            cardRow.forEach((elem) => {
              row.appendChild(elem);
            });

            cardRow = [];

            this.table.appendChild(row);
          }
        } else {
          if (cardRow.length == 3) {
            let row = document.createElement("div");
            row.classList.add("row");
            cardRow.forEach((elem) => {
              row.appendChild(elem);
            });

            cardRow = [];

            this.table.appendChild(row);
          }
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
      div.innerHTML =
        "<p class='d-flex justify-content-center'>No se encontró información para mostrar 😢. </p>";

      this.table.appendChild(div);
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
