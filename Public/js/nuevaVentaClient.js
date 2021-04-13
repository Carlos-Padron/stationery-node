window.addEventListener("DOMContentLoaded", () => {
  let $fields = ["name", "brand", "articleType"];

  let routes = {
    showProducts: "/getProducts",
  };

  let productsData = [];
  let shoppingCart = [];
  let subTotal = 0;

  const searchBtn = document.querySelector("#btnSearch");
  const searchForm = document.querySelector("#searchForm");
  const btnClearSearch = document.querySelector("#btnClearSearch");
  const registerSaleBtn = document.querySelector("#registerSale");
  const mainCardTable = document.querySelector("#productsTable");
  const cartTable = document.querySelector("#cart-table");
  const discountInput = document.querySelector("#discount");

  searchBtn.addEventListener("click", search);
  btnClearSearch.addEventListener("click", clearSearch);
  registerSaleBtn.addEventListener("click", registerSaleBtnClick);
  discountInput.addEventListener("input", validateDiscount);
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
              venta  😊
          </td>
      </tr>`;
      updateSaleTotals();
      validateDiscount();

      return;
    }

    let tableBody = "";
    shoppingCart.forEach((product, index) => {
      tableBody += `<tr>
          <td style="white-space:normal"> 
            ${product.quantity} x  ${product.productName}
          </td>
          <td>$${product.total.toFixed(2)}</td>
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
    updateSaleTotals();
    validateDiscount();
  }

  function updateSaleTotals() {
    let subTotal = 0;
    let discount = document.querySelector("#discount");
    shoppingCart.forEach((prod) => (subTotal += prod.total));
    let total = subTotal - discount.value;
    console.log(subTotal);
    console.log(discount.value);
    console.log(total);

    document.querySelector("#subTotal").innerHTML = `$${subTotal.toFixed(2)}`;
    document.querySelector("#total").innerHTML = `$${total.toFixed(2)}`;
  }

  //Validators
  //Prevent the discount to be greater than the sale
  function validateDiscount() {
    let subTotal = document.querySelector("#subTotal").innerHTML;
    let discount = document.querySelector("#discount");
    let discountMsg = document.querySelector("#discountMsg");

    subTotal = subTotal.includes("$")
      ? subTotal.substr(1, subTotal.length - 1)
      : subTotal;
    console.log(subTotal);
    subTotal = isNaN(parseFloat(subTotal)) ? 0 : parseFloat(subTotal);

    console.log("subTotal", subTotal);
    console.log("discount.value", discount.value);
    console.log("subtract", subTotal - discount.value);

    if (
      subTotal - (discount.value ?? 0) < 0 ||
      isNaN(subTotal - (discount.value ?? 0))
    ) {
      discountMsg.innerHTML =
        "El subtotal menos el descuento no debe ser menor a 0.";
      discount.classList.add("border", "border-danger");
      updateSaleTotals();
      return false;
    } else {
      discountMsg.innerHTML = "";
      discount.classList.remove("border", "border-danger");
      updateSaleTotals();

      return true;
    }
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
