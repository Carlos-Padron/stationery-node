window.addEventListener("DOMContentLoaded", () => {
  //Variables & Elements
  let $fields = [
    "_id",
    "name",
    "barcode",
    "image",
    "price",
    "quantity",
    "brand",
    "articleType",
  ];
  let routes = {
    get: "/getProducts",
    add: "/addProduct",
    show: "/showProduct",
    update: "/updateProduct",
    delete: "/deleteProduct",
    enable: "/enableProduct",
    printAllProducts: "/printAllProducts",
    printLowStockProducts: "/printLowStockProducts",
  };

  let productsData = [];
  let historialData = [];
  let historialColumns = [
    { column: "action", class: "text-center" },
    { column: "date", class: "text-center" },
    { column: "quantity", class: "text-center" },
    { column: "description", class: "text-center" },
    { column: "madeBy", class: "text-center" },
  ];

  //Img elements
  const imgFileInput = document.createElement("input");
  const image = document.querySelector("#image");
  const dropZone = document.querySelectorAll(".dropZone");
  const imgOverlay = document.querySelector("#imgOverlay");
  const uploadImgElem = document.querySelector("#uploadImgElem");
  const removeImgElem = document.querySelector("#removeImgElem");

  // Img Listeners
  imgFileInput.addEventListener("input", inputChanged);
  removeImgElem.addEventListener("click", clearImg);
  uploadImgElem.addEventListener("click", openFileExplorer);
  dropZone.forEach((elem) => {
    elem.addEventListener("dragenter", preventtDefault);
    elem.addEventListener("dragleave", preventtDefault);
    elem.addEventListener("dragover", preventtDefault);
    elem.addEventListener("drop", dropZoneDrop);
  });

  //Seach and main form elements
  const searchBtn = document.querySelector("#btnSearch");
  const btnPrintAll = document.querySelector("#btnPrintAll");
  const btnPrintLowStock = document.querySelector("#btnPrintLowStock");
  const searchForm = document.querySelector("#searchForm");
  const btnClearSearch = document.querySelector("#btnClearSearch");
  const addBtn = document.querySelector("#btnAdd");
  const btnAddProduct = document.querySelector("#btnAddProduct");
  const btnUpdateProduct = document.querySelector("#btnUpdateProduct");
  const mainCardTable = document.querySelector("#mainTable");

  //Listeners
  searchBtn.addEventListener("click", search);
  btnPrintAll.addEventListener("click", printProductsReport);
  btnPrintLowStock.addEventListener("click", printProductsReport);
  addBtn.addEventListener("click", showMainModalAdd);
  btnClearSearch.addEventListener("click", clearSearch);
  btnAddProduct.addEventListener("click", addProductBtnClick);
  btnUpdateProduct.addEventListener("click", updateProductClick);
  mainCardTable.addEventListener("click", rowClicked);

  //functions
  async function search() {
    blockElem(searchForm);
    let body = {};

    $fields.forEach((elem) => {
      let elemData = document.querySelector(`[data-search="${elem}"]`);

      if (elemData != undefined) {
        switch (elem) {
          case "disabled":
            body[elem] = elemData.checked;
            break;

          default:
            let data = elemData.value.trim();
            body[elem] = data;
            break;
        }
      }
    });

    try {
      body = JSON.stringify(body);

      let request = await fetch(routes.get, {
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

      let role = localStorage.getItem("role");

      productsData.forEach((elem, index) => {
        if (role == "admin") {
          if (elem.disabled) {
            elem.actions = `
            <button title="Habilitar"   type="button" class="btn btn-sm btn-icon btn-warning   enable" ;"  data-index="${index}" data-id="${elem._id}" > <i class="uil uil-refresh enable "></i> Habilitar</button>
          `;
          } else {
            elem.actions = `
          <button title="Editar"   type="button" class="btn btn-sm btn-icon btn-info   show"     data-index="${index}" data-id="${elem._id}" > <i class="uil uil-pen show"></i> Editar</button>
          <button title="Deshabilitar" type="button" class="btn btn-sm btn-icon btn-danger delete"   data-index="${index}" data-id="${elem._id}" > <i class="uil uil-multiply delete"></i> Deshabilitar</button>
          `;
          }
        } else {
          elem.actions = `
          <button title="Editar"   type="button" class="btn btn-sm btn-icon btn-info   show"     data-index="${index}" data-id="${elem._id}" > <i class="uil uil-pen show"></i> Editar</button>
          <button title="Deshabilitar" type="button" class="btn btn-sm btn-icon btn-danger delete"   data-index="${index}" data-id="${elem._id}" > <i class="uil uil-multiply delete"></i> Deshabilitar</button>
        `;
        }
      });

      mainTable.reloadCardTable(productsData);
      unblockElem(searchForm);
    } catch (error) {
      unblockElem(searchForm);
      errorNotification("Error interno del servidor");
      console.error(error);
    }
  }

  async function save(route) {
    resetFormValidation();

    let response = validateForm();

    if (response.valid === false) {
      return;
    }
    console.log(response.body);
    disableButton(
      btnAddProduct,
      route == "/updateProduct" ? "Actualizando" : "Agregando"
    );

    try {
      let body = JSON.stringify(response.body);

      let request = await fetch(route, {
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
          enableButton(
            btnAddProduct,
            route == "/updateProduct" ? "Actualizar" : "Agregar"
          );

          modalAlert("warning", "Aviso", messages);
          return;
        } else {
          modalAlert(
            "warning",
            "Aviso",
            `<strong>${json.message}</strong> <br>`
          );
          enableButton(
            btnAddProduct,
            route == "/updateProduct" ? "Actualizar" : "Agregar"
          );

          return;
        }
      }
      enableButton(
        btnAddProduct,
        route == "/updateProduct" ? "Actualizar" : "Agregar"
      );

      modalAlert(
        "success",
        "Aviso ",
        `<strong>${json.message}</strong> <br>`,
        () => {
          $("#main_modal").modal("hide");
          search();
        }
      );
    } catch (error) {
      errorNotification("Error interno del servidor");
      enableButton(
        btnAddProduct,
        route == "/updateProduct" ? "Actualizar" : "Agregar"
      );
      console.error(error);
    }
  }

  async function destroy(_id) {
    blockElem(mainCardTable);
    let body = JSON.stringify({ _id });

    try {
      let request = await fetch(routes.delete, {
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
            messages += `<strong>*${msg}</strong>`;
          });
          unblockElem(mainCardTable);
          modalAlert("warning", "Aviso", messages);
          return;
        } else {
          unblockElem(mainCardTable);
          modalAlert(
            "warning",
            "Aviso",
            `<strong>*${json.message}</strong> <br>`
          );
          return;
        }
      }

      modalAlert(
        "success",
        "Aviso ",
        `<strong>${json.message}</strong> <br>`,
        () => {
          search();
        }
      );
    } catch (error) {
      alert(error);
      errorNotification(error);
      unblockElem(mainCardTable);
      console.error(error);
    }
  }

  async function enable(_id) {
    blockElem(mainCardTable);
    let body = JSON.stringify({ _id });

    try {
      let request = await fetch(routes.enable, {
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
            messages += `<strong>*${msg}</strong>`;
          });
          unblockElem(mainCardTable);
          modalAlert("warning", "Aviso", messages);
          return;
        } else {
          unblockElem(mainCardTable);
          modalAlert(
            "warning",
            "Aviso",
            `<strong>*${json.message}</strong> <br>`
          );
          return;
        }
      }

      modalAlert(
        "success",
        "Aviso ",
        `<strong>${json.message}</strong> <br>`,
        () => {
          search();
        }
      );
    } catch (error) {
      alert(error);
      errorNotification(error);
      unblockElem(mainCardTable);
      console.error(error);
    }
  }

  function validateForm() {
    let body = {};
    let valid = true;

    $fields.forEach((elem) => {
      let data;
      let msg;
      switch (elem) {
        case "_id":
          data = document.querySelector(`#${elem}`);
          body[elem] = data.value;
          break;

        case "barcode":
          data = document.querySelector(`#${elem}`);
          msg = document.querySelector(`#${elem}Msg`);

          if (data.value === "") {
            data.classList.add("invalid-input");
            msg.innerHTML += "El código es requerido.";
            msg.classList.add("text-danger");
            valid = false;
          }
          body[elem] = data.value;
          break;

        case "name":
          data = document.querySelector(`#${elem}`);
          msg = document.querySelector(`#${elem}Msg`);

          if (data.value === "") {
            data.classList.add("invalid-input");
            msg.innerHTML += "El nombre es requerido.";
            msg.classList.add("text-danger");
            valid = false;
          }
          body[elem] = data.value;
          break;
        case "image":
          data = document.querySelector(`#${elem}`);

          body[elem] =
            data.src === "" ||
            data.src === undefined ||
            data.src === DEFAULT_ROUTE_PRODUCTS
              ? null
              : data.src;
          break;
        case "price":
          data = document.querySelector(`#${elem}`);
          msg = document.querySelector(`#${elem}Msg`);

          if (data.value === "") {
            data.classList.add("invalid-input");
            msg.innerHTML += "El precio es requerido.";
            msg.classList.add("text-danger");
            valid = false;
          }
          body[elem] = data.value;
          break;
        case "quantity":
          data = document.querySelector(`#${elem}`);
          msg = document.querySelector(`#${elem}Msg`);

          if (data.value === "") {
            data.classList.add("invalid-input");
            msg.innerHTML += "La cantidad total de producto es requerida.";
            msg.classList.add("text-danger");
            valid = false;
          }
          body[elem] = data.value;
          break;
        case "brand":
          data = document.querySelector(`#${elem}`);
          msg = document.querySelector(`#${elem}Msg`);

          if (data.value === "") {
            data.classList.add("invalid-input");
            msg.innerHTML += "La marca es requerida.";
            msg.classList.add("text-danger");
            valid = false;
          }
          body[elem] = data.value;
          break;
        case "articleType":
          data = document.querySelector(`#${elem}`);
          msg = document.querySelector(`#${elem}Msg`);

          if (data.value === "") {
            data.classList.add("invalid-input");
            msg.innerHTML += "El tipo de artículo es requerido.";
            msg.classList.add("text-danger");
            valid = false;
          }
          body[elem] = data.value;
          break;

        default:
          break;
      }
    });

    return {
      valid,
      body,
    };
  }

  async function resetForm(form) {
    switch (form) {
      case "productoForm":
        document.querySelector("#productoForm").reset();
        btnAddProduct.classList.remove("d-none");
        btnUpdateProduct.classList.add("d-none");
        imgOverlay.classList.add("d-flex");
        removeImgElem.classList.add("invisible");
        image.src = null;
        break;
      case "searchForm":
        document.querySelector("#searchForm").reset();
        break;
      default:
        break;
    }
  }

  function resetFormValidation() {
    $fields.forEach((elem) => {
      let msg = document.querySelector(`#${elem}Msg`);
      let field = document.querySelector(`#${elem}`);

      if (field) {
        field.classList.remove("invalid-input");
      }
      if (msg) {
        msg.innerHTML = "";
        msg.classList.remove("text-danger");
      }
    });
  }

  function addProductBtnClick() {
    confirmationAlert("Se registrará el producto.", () => {
      save(routes.add);
    });
  }

  function updateProductClick() {
    confirmationAlert("Se actualizará el producto.", () => {
      save(routes.update);
    });
  }

  function deleteConfirmation(_id) {
    confirmationAlert("Se deshabilitará el producto seleccionado", () => {
      destroy(_id);
    });
  }

  function enableConfirmation(_id) {
    confirmationAlert("Se habilitará el producto seleccionado", () => {
      enable(_id);
    });
  }

  function clearSearch() {
    resetForm("searchForm");
  }

  function rowClicked(e) {
    if (e.target && e.target.classList.contains("show")) {
      if (e.target.tagName === "I") {
        let button = e.target.parentElement;
        let index = button.getAttribute("data-index");
        getSelectedProduct(productsData[index]);
      } else {
        let button = e.target;
        let index = button.getAttribute("data-index");
        getSelectedProduct(productsData[index]);
      }
    }

    if (e.target && e.target.classList.contains("delete")) {
      if (e.target.tagName === "I") {
        let button = e.target.parentElement;
        let index = button.getAttribute("data-index");
        deleteConfirmation(productsData[index]._id);
      } else {
        let button = e.target;
        let index = button.getAttribute("data-index");
        deleteConfirmation(productsData[index]._id);
      }
    }

    if (e.target && e.target.classList.contains("enable")) {
      if (e.target.tagName === "I") {
        let button = e.target.parentElement;
        let index = button.getAttribute("data-index");
        enableConfirmation(productsData[index]._id);
      } else {
        let button = e.target;
        let index = button.getAttribute("data-index");
        enableConfirmation(productsData[index]._id);
      }
    }
  }

  async function getSelectedProduct(product) {
    //showMainModalEdit(productsData[index]);
    blockElem(mainCardTable);

    let body = JSON.stringify({ _id: product._id });

    try {
      let request = await fetch(routes.show, {
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
          unblockElem(mainCardTable);
          return;
        } else {
          modalAlert(
            "warning",
            "Aviso",
            `<strong>*${json.message}</strong> <br>`
          );
          unblockElem(mainCardTable);
          return;
        }
      }
      unblockElem(mainCardTable);

      //Seetear info
      showMainModalEdit(json.response);
    } catch (error) {
      //unblockElem(mainCardTable);
      errorNotification("Error interno del servidor");
      console.error(error);
    }
  }

  function showMainModalAdd() {
    document
      .querySelector("#historial-tab")
      .parentElement.classList.add("d-none");

    document.querySelector("#modal_title").innerHTML =
      "Agregar un nuevo producto";

    image.src = null;
    imgOverlay.classList.add("d-flex");
    imgOverlay.classList.remove("d-none");
    removeImgElem.classList.add("invisible");

    $("#main_modal").modal("show");
  }

  function showMainModalEdit(product) {
    btnAddProduct.classList.add("d-none");
    btnUpdateProduct.classList.remove("d-none");
    console.log(product);
    $fields.forEach((elem) => {
      switch (elem) {
        case "disabled":
          document.querySelector(`#${elem}`).checked = product[elem];
          break;

        case "articleType":
        case "brand":
          document.querySelector(`#${elem}`).value = product[elem]._id;
          break;

        case "image":
          document.querySelector(`#${elem}`).src = product.imageRelativePath;

        default:
          document.querySelector(`#${elem}`).value = product[elem];
          break;
      }
    });

    if (
      product.imageRelativePath != DEFAULT_ROUTE_PRODUCTS &&
      product.imageRelativePath != null &&
      product.imageRelativePath != undefined &&
      product.imageRelativePath != ""
    ) {
      console.log(product.imageRelativePath);
      imgOverlay.classList.add("d-none");
      imgOverlay.classList.remove("d-flex");
      removeImgElem.classList.remove("invisible");
    } else {
      imgOverlay.classList.add("d-flex");
      removeImgElem.classList.add("invisible");
    }

    document
      .querySelector("#historial-tab")
      .parentElement.classList.remove("d-none");

    product.history.forEach((elem) => {
      switch (elem.action) {
        case "add":
          elem.action = `<i class="uil uil-arrow-growth text-success" style="font-size: 1.3rem"></i>`;
          break;
        case "subtract":
          elem.action = `<i class="uil uil-chart-down text-danger" style="font-size: 1.3rem"></i>`;
          break;
        case "same":
          elem.action = `<i class="uil uil-exchange text-primary" style="font-size: 1.3rem"></i>`;
          break;
        case "sale":
          elem.action = `<i class="uil uil-chart-down text-info" style="font-size: 1.3rem"></i>`;
          break;

        default:
          break;
      }
      historialData.push({
        action: elem.action,
        date: elem.date.replace(/T.*/, "").split("-").reverse().join("-"),
        quantity: elem.quantity,
        description: elem.description,
        madeBy: elem.madeBy.name.split(" ")[0] + elem.madeBy.fatherSurname,
      });
    });

    historialTable.reloadTable(historialData);

    document.querySelector("#modal_title").innerHTML = "Editar Producto";
    $("#main_modal").modal("show");
  }

  async function printProductsReport(e) {
    blockElem(searchForm);
    let body = {};
    console.log();
    $fields.forEach((elem) => {
      let elemData = document.querySelector(`[data-search="${elem}"]`);

      if (elemData != undefined) {
        let data = elemData.value.trim();
        body[elem] = data;
      }
    });

    try {
      body = JSON.stringify(body);

      let request = await fetch(
        e.target.id == "btnPrintAll"
          ? routes.printAllProducts
          : routes.printLowStockProducts,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            credentials: "same-origin",
          },
          body,
        }
      );

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

      let byteArray = new Uint8Array(
        atob(json.response)
          .split("")
          .map((char) => char.charCodeAt(0))
      );
      let blob = new Blob([byteArray], { type: "application/pdf" });

      const url = window.URL.createObjectURL(blob);

      window.open(url, "_blank");

      unblockElem(searchForm);
    } catch (error) {
      unblockElem(searchForm);
      errorNotification("Error interno del servidor");
      console.error(error);
    }
  }

  $("#main_modal").on("hidden.bs.modal", function (e) {
    resetFormValidation();
    resetForm("productoForm");

    image.src = "";
    imgOverlay.classList.remove("d-none");
    imgOverlay.classList.add("d-flex");
    removeImgElem.classList.add("invisible");

    let historialTab = document.querySelector("#historial-tab");
    let productosTab = document.querySelector("#productos-tab");

    historialTab.classList.remove("active");
    productosTab.classList.add("active");

    historialTab.setAttribute("aria-selected", "false");
    productosTab.setAttribute("aria-selected", "true");

    document.querySelector("#productos").classList.add("active", "show");
    document.querySelector("#historial").classList.remove("active", "show");

    historialData = [];
    historialTable.reloadTable(historialData);
  });

  //imgFile input functinos
  function inputChanged(e) {
    let image = imgFileInput.files;
    showImage(image[0]);
  }

  function openFileExplorer() {
    imgFileInput.click();
  }

  function preventtDefault(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function dropZoneDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    let data = e.dataTransfer,
      image = data.files;

    showImage(image[0]);
  }

  function showImage(imageToRead) {
    if (validateImgage(imageToRead)) {
      var reader = new FileReader();
      reader.onload = (e) => {
        image.src = e.target.result;

        imgOverlay.classList.remove("d-flex");
        imgOverlay.classList.add("d-none");
        removeImgElem.classList.remove("invisible");
      };

      reader.readAsDataURL(imageToRead);
    } else {
      imgOverlay.classList.remove("d-none");
      imgOverlay.style.display = "flex";

      removeImgElem.classList.add("invisible");
    }
  }

  function validateImgage(image) {
    let validTypes = ["image/jpeg", "image/png"];

    if (validTypes.indexOf(image.type) == -1) {
      errorNotification("Solo se aceptan imágenes png y jpg");

      return false;
    }

    return true;
  }

  function clearImg() {
    image.src = "";
    imgOverlay.classList.add("d-flex");
    removeImgElem.classList.add("invisible");
  }

  //Initial actions
  let mainTable = new CardTable(
    "mainTable",
    productsData,
    "btnNext",
    "btnPrev",
    "pageCounter"
  );
  mainTable.reloadCardTable(productsData);

  let historialTable = new NormalTable(
    "historialTable",
    historialData,
    historialColumns,
    "btnNextModal",
    "btnPrevModal",
    "pageCounterModal",
    "5",
    "5"
  );
  historialTable.reloadTable(historialData);

  imgFileInput.type = "file";
  imgFileInput.accept = "image/png, image/jpeg";
});
