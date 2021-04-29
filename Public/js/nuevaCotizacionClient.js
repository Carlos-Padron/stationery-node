window.addEventListener("DOMContentLoaded", () => {
  let $fields = [
    "name",
    "brand",
    "articleType",
    "discount",
    "concept",
    "service",
  ];

  let routes = {
    showProducts: "/getProductsWithStock",
    registerQuote: "/registrar-cotizacion",
  };

  let productsData = [];
  let shoppingCart = [];
  let subTotal = 0;
  let total = 0;

  const searchBtn = document.querySelector("#btnSearch");
  const searchForm = document.querySelector("#searchForm");
  const btnClearSearch = document.querySelector("#btnClearSearch");
  const registerQuoteBtn = document.querySelector("#registerQuote");
  const mainCardTable = document.querySelector("#productsTable");
  const cartTable = document.querySelector("#cart-table");
  const discountInput = document.querySelector("#discount");
  const serviceInput = document.querySelector("#service");

  searchBtn.addEventListener("click", search);
  btnClearSearch.addEventListener("click", clearSearch);
  registerQuoteBtn.addEventListener("click", registerQuoteBtnClick);
  discountInput.addEventListener("input", validateDiscount);
  serviceInput.addEventListener("input", validateService);
  mainCardTable.addEventListener("click", mainCardTableRowClicked);
  cartTable.addEventListener("click", cartTableRowClicked);

  //Search products
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
          <button title="Agregar" type="button" class="btn btn-sm btn-icon btn-warning add w-100" data-index="${index}" data-id="${elem._id}" > <i class="uil uil-plus-circle"></i> Agregar</button>
      `;
      });

      productsTable.reloadCardTable(productsData);
      unblockElem(searchForm);
    } catch (error) {
      unblockElem(searchForm);
      errorNotification("Error interno del servidor");
      console.error(error);
    }
  }

  async function registerQuote(quoteInfo) {
    try {
      disableButton(
        registerQuoteBtn,
        "Registrando cotización",
        "justify-content-center"
      );

      console.log(quoteInfo);
      let body = JSON.stringify(quoteInfo);

      let request = await fetch(routes.registerQuote, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          credentials: "same-origin",
        },
        body,
      });

      let json = await request.json();

      console.log("json", json);
      if (json.error) {
        if (Array.isArray(json.message)) {
          let messages = "";
          json.message.forEach((msg) => {
            messages += `<strong>*${msg}</strong> <br>`;
          });
          enableButton(registerQuoteBtn, "Realizar cotización");

          modalAlert("warning", "Aviso", messages);
          return;
        } else {
          modalAlert(
            "warning",
            "Aviso",
            `<strong>${json.message}</strong> <br>`
          );
          enableButton(registerQuoteBtn, "Realizar cotización");

          return;
        }
      }
      enableButton(registerQuoteBtn, "Realizar cotización");

      resetForm("shopping-cart");

      modalAlert(
        "success",
        "Aviso ",
        `<strong>${json.message}</strong> <br>`,
        () => {
          $("#main_modal").modal("hide");
          window.location = `/cotizaciones/detalle/${json.response}`;
        }
      );
    } catch (error) {
      errorNotification("Error interno del servidor");
      enableButton(registerQuoteBtn, "Realizar cotización");
      console.error(error);
    }
  }

  function resetForm(form) {
    switch (form) {
      case "shopping-cart":
        shoppingCart = [];
        populateTable();
        search();
        document.querySelector(`#concept`).value = "";
        document.querySelector(`#discount`).value = "";
        break;
      case "searchForm":
        document.querySelector("#searchForm").reset();
        break;
    }
  }

  function clearSearch() {
    resetForm("searchForm");
  }

  function registerQuoteBtnClick() {
    if (shoppingCart.length === 0) {
      errorNotification(
        "No tienes productos en la cotización. Agrega productos para realizar la cotización"
      );
      return;
    }

    if (total < 0) {
      errorNotification(
        "El total de la cotización no puede ser menor a 0. Revisa la cotización y el descuento que hayas ingresado."
      );
      return;
    }

    resetCartFormValidation();
    let response = validateCartForm();

    if (response.valid === false) {
      return;
    }

    registerQuoteConfirmation(response.body);
  }

  function registerQuoteConfirmation(quoteInfo) {
    confirmationAlert("Se registrará la cotización", () => {
      registerQuote(quoteInfo);
    });
  }

  function validateCartForm() {
    let body = {};
    let valid = true;

    $fields.forEach((elem) => {
      let data;
      let msg;

      switch (elem) {
        case "discount":
          data = document.querySelector(`#${elem}`);
          body[elem] = data.value ?? 0;
          break;

        case "concept":
          data = document.querySelector(`#${elem}`);
          msg = document.querySelector(`#${elem}Msg`);

          if (!data.value) {
            data.classList.add("invalid-input");
            msg.innerHTML += "El concepto es requerido.";
            valid = false;
          }
          body[elem] = data.value;
          break;

        case "service":
          data = document.querySelector(`#${elem}`);
          body[elem] = data.value;
          break;
      }
    });

    let quoteDetail = [];

    console.log(shoppingCart);
    shoppingCart.forEach((elem) => {
      quoteDetail.push({
        productID: elem.id,
        productName: elem.productName,
        quantity: elem.quantity,
        unitPrice: elem.unitPrice,
        changed: false,
        add: false,
      });
    });

    body.quoteDetail = quoteDetail;
    body.total = total;

    return {
      valid,
      body,
    };
  }

  function resetCartFormValidation() {
    $fields.forEach((elem) => {
      switch (elem) {
        case "concept":
          data = document.querySelector(`#${elem}`);
          msg = document.querySelector(`#${elem}Msg`);

          data.classList.remove("invalid-input");
          msg.innerHTML = "";

          break;
      }
    });
  }

  //Listen when an element from the tablie is clicked
  function mainCardTableRowClicked(e) {
    if (e.target && e.target.classList.contains("add")) {
      if (e.target.tagName === "I") {
        let button = e.target.parentElement;
        let index = button.getAttribute("data-index");
        //Agregar al carrito
        addToCart(productsData[index]);
      } else {
        let button = e.target;
        let index = button.getAttribute("data-index");
        //Agregar al carrito
        addToCart(productsData[index]);
      }
    }
  }

  //Listen when an element from the tablie is clicked
  function cartTableRowClicked(e) {
    if (e.target.classList.contains("add")) {
      if (e.target.tagName === "I") {
        let button = e.target.parentElement;
        let index = button.getAttribute("data-index");
        addMoreProduct(index);
      } else {
        let button = e.target;
        let index = button.getAttribute("data-index");
        addMoreProduct(index);
      }
    }
    if (e.target.classList.contains("remove")) {
      if (e.target.tagName === "I") {
        let button = e.target.parentElement;
        let index = button.getAttribute("data-index");
        removeProduct(index);
      } else {
        let button = e.target;
        let index = button.getAttribute("data-index");
        removeProduct(index);
      }
    }
  }

  //Increases the number of products of the same article
  function addMoreProduct(productIndex) {
    if (
      shoppingCart[productIndex].quantity ==
      shoppingCart[productIndex].totalStock
    ) {
      return;
    }
    shoppingCart[productIndex].quantity++;
    shoppingCart[productIndex].total += shoppingCart[productIndex].unitPrice;

    populateTable();
  }

  //reduces or removes products
  function removeProduct(productIndex) {
    shoppingCart[productIndex].quantity--;
    shoppingCart[productIndex].total -= shoppingCart[productIndex].unitPrice;

    if (shoppingCart[productIndex].quantity == 0) {
      shoppingCart.splice(productIndex, 1);
    }

    populateTable();
  }

  //add products to the cart
  function addToCart(product) {
    if (shoppingCart.length == 0) {
      shoppingCart.push({
        id: product._id,
        productName: product.name,
        unitPrice: product.price,
        quantity: 1,
        total: product.price,
        totalStock: product.quantity,
      });
    } else {
      let productIndex = shoppingCart.findIndex(
        (prod) => prod.id === product._id
      );

      if (productIndex != -1) {
        if (shoppingCart[productIndex].quantity == product.quantity) {
          return;
        }
        shoppingCart[productIndex].quantity++;
        shoppingCart[productIndex].total +=
          shoppingCart[productIndex].unitPrice;
      } else {
        shoppingCart.push({
          id: product._id,
          productName: product.name,
          unitPrice: product.price,
          quantity: 1,
          total: product.price,
          totalStock: product.quantity,
        });
      }
    }

    populateTable();
  }

  //cartTableFunction
  //populate the cart table
  function populateTable() {
    if (shoppingCart.length == 0) {
      cartTable.innerHTML = `<tr>
          <td class="text-center w-100"> Aun no tienes productos. <br> Agrega productos a la
          cotización   🛍
          </td>
      </tr>`;
      total = 0;
      subTotal = 0;
      document.querySelector("#discount").value = "";
      updateQuoteTotals();
      validateDiscount();

      return;
    }

    let tableBody = "";
    shoppingCart.forEach((product, index) => {
      tableBody += `<tr>
          <td style="white-space:normal"> 
            ${product.quantity} x  ${product.productName}
          </td>
          <td class="text-center">$${product.total.toFixed(2)}</td>
          <td> <button type="button"
                  class="btn btn-sm btn-outline-secondary text-info add" data-index="${index}"  data-id="${
        product._id
      }"  ><i class="uil uil-plus add "></i></button>
              <button type="button"
                  class="btn btn-sm btn-outline-secondary text-danger remove" data-index="${index}"  data-id="${
        product._id
      }"><i class="uil uil-minus remove"></i></button>
          </td>
      </tr>`;
    });

    cartTable.innerHTML = tableBody;
    updateQuoteTotals();
    validateDiscount();
  }

  function updateQuoteTotals() {
    subTotal = 0;
    let discount = document.querySelector("#discount");
    shoppingCart.forEach((prod) => (subTotal += prod.total));
    subTotal = !isNaN(parseFloat(serviceInput.value))
      ? subTotal + parseFloat(serviceInput.value)
      : subTotal;

    total = subTotal - discount.value;

    console.log(total);
    document.querySelector("#subTotal").innerHTML = `$${subTotal.toFixed(2)}`;
    document.querySelector("#total").innerHTML = `$${total.toFixed(2)}`;
  }

  //Validators
  //Prevent the discount to be greater than the quote
  function validateDiscount() {
    let subTotal = document.querySelector("#subTotal").innerHTML;
    let discount = document.querySelector("#discount");
    let discountMsg = document.querySelector("#discountMsg");

    subTotal = subTotal.includes("$")
      ? subTotal.substr(1, subTotal.length - 1)
      : subTotal;

    subTotal = isNaN(parseFloat(subTotal)) ? 0 : parseFloat(subTotal);

    if (
      subTotal - (discount.value ?? 0) < 0 ||
      isNaN(subTotal - (discount.value ?? 0))
    ) {
      discountMsg.innerHTML =
        "El subtotal menos el descuento no debe ser menor a 0.";
      discount.classList.add("border", "border-danger");
      updateQuoteTotals();
      return false;
    } else {
      discountMsg.innerHTML = "";
      discount.classList.remove("border", "border-danger");
      updateQuoteTotals();

      return true;
    }
  }

  function validateService() {
    validateDiscount();
  }

  //Initial Actions
  let productsTable = new CardTable(
    "productsTable",
    productsData,
    "btnNext",
    "btnPrev",
    "pageCounter",
    "6",
    false
  );
  productsTable.reloadCardTable(productsData);
});
