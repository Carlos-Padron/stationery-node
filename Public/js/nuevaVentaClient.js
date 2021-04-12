window.addEventListener("DOMContentLoaded", () => {
  let $fields = ["name", "brand", "articleType"];

  let routes = {
    showProducts: "/getProducts",
  };

  let productsData = [];
  let shoppingCart = [];

  const searchBtn = document.querySelector("#btnSearch");
  const searchForm = document.querySelector("#searchForm");
  const btnClearSearch = document.querySelector("#btnClearSearch");
  const registerSaleBtn = document.querySelector("#registerSale");
  const mainCardTable = document.querySelector("#productsTable");

  searchBtn.addEventListener("click", search);
  btnClearSearch.addEventListener("click", clearSearch);
  registerSaleBtn.addEventListener("click", registerSaleBtnClick);
  mainCardTable.addEventListener("click", mainCardTableRowClicked);

  async function search() {
    blockElem(searchForm);
    let body = {};

    $fields.forEach((elem) => {
      let elemData = document.querySelector(`[data-search="${elem}"]`);

      if (elemData != undefined) {
        let data = elemData.value.trim();
        body[elem] = data;
      }
    });

    try {
      body = JSON.stringify(body);

      let request = await fetch(routes.showProducts, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          credentials: "same-origin",
        },
        body,
      });

      let json = await request.json();
      if (json.error) {
        if (Array.isArray(json.message)) {
          let messages = "";
          json.message.forEach((msg) => {
            messages += `<strong>*${msg}</strong> <br>`;
          });
          modalAlert("warning", "Aviso", messages);
          unblockElem(searchForm);
          return;
        } else {
          modalAlert(
            "warning",
            "Aviso",
            `<strong>*${json.message}</strong> <br>`
          );
          unblockElem(searchForm);
          return;
        }
      }

      productsData = json.response;
      console.log(productsData);

      productsData.forEach((elem, index) => {
        elem.actions = `
          <button title="Editar"   type="button" class="btn btn-sm btn-icon btn-info   show"     data-index="${index}" data-id="${elem._id}" > <i class="uil uil-pen show"></i> Editar</button>
          <button title="Deshabilitar" type="button" class="btn btn-sm btn-icon btn-danger delete"   data-index="${index}" data-id="${elem._id}" > <i class="uil uil-multiply delete"></i> Deshabilitar</button>
      `;
      });

      productsTable.reloadCardTable(productsData);
      unblockElem(searchForm);
    } catch (error) {
      unblockElem(searchForm);
      warningNotification("Error interno del servidor");
      console.error(error);
    }
  }

  function registerSale() {}

  function resetForm(form) {
    switch (form) {
      case "shopping-cart":
        //clear shopping card
        break;
      case "searchForm":
        document.querySelector("#searchForm").reset();
        break;
    }
  }

  function clearSearch() {
    resetForm("searchForm");
  }

  function registerSaleBtnClick() {}

  function registerSaleConfirmation() {
    confirmationAlert("Se registrará la venta", () => {
      registerSale();
    });
  }

  function mainCardTableRowClicked(e) {
    if (e.target && e.target.classList.contains("show")) {
      if (e.target.tagName === "I") {
        let button = e.target.parentElement;
        let index = button.getAttribute("data-index");
        //Agregar al carrito
      } else {
        let button = e.target;
        let index = button.getAttribute("data-index");
        //Agregar al carrito
      }
    }
  }

  //Initial Actions
  let productsTable = new CardTable(
    "productsTable",
    productsData,
    "btnNext",
    "btnPrev",
    "pageCounter",
    false
  );
  productsTable.reloadCardTable(productsData);
});
