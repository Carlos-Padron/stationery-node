window.addEventListener("DOMContentLoaded", () => {
  //Variables & Elements
  let $fields = ["fechaInicio", "fechaFin", "product", "quantity"];
  let routes = {
    get: "/getLosses",
    add: "/registerLoss",
    delete: "/deleteLoss",
    getProductsForCombo: "/getProductsForCombo",
  };

  let lossColumns = [
    { column: "name", class: "text-center" },
    { column: "brand", class: "text-center" },
    { column: "quantity", class: "text-center" },
    { column: "total", class: "text-center" },
    { column: "date", class: "text-center" },
    { column: "actions", class: "text-center" },
  ];

  let lossesData = [];

  const searchBtn = document.querySelector("#btnSearch");
  const searchForm = document.querySelector("#searchForm");
  const lossesForm = document.querySelector("#lossesForm");
  const btnClearSearch = document.querySelector("#btnClearSearch");
  const addBtn = document.querySelector("#btnAdd");
  const addLossBtn = document.querySelector("#btnAddLoss");
  const productSelect = document.querySelector("#product");
  const articleTypeSelect = document.querySelector("#articleType");
  const brandSelect = document.querySelector("#brand");
  const mainTableBody = document.querySelector("#mainTable tbody.list");

  //Listeners
  searchBtn.addEventListener("click", search);
  addBtn.addEventListener("click", showMainModalAdd);
  addLossBtn.addEventListener("click", addLossBtnClick);
  mainTableBody.addEventListener("click", rowClicked);
  btnClearSearch.addEventListener("click", clearSearch);
  articleTypeSelect.addEventListener("change", searchProducts);
  brandSelect.addEventListener("change", searchProducts);

  //functions
  async function search() {
    try {
      resetFormValidation();

      let response = validateSearchForm();

      if (response.valid === false) {
        return;
      }

      blockElem(searchForm);

      let body = JSON.stringify(response.body);

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
      console.log(json);
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

      lossesData = json.response;

      lossesData.forEach((elem, index) => {
        elem.total = elem.quantity * elem.unitPrice;
        elem.total = elem.total.toFixed(2);

        elem.name = elem.productID.name;

        elem.brand = elem.productID.brand.name;

        let date = elem.date.substring(0, 10);
        let day = date.substring(8, 10);
        let month = date.substring(5, 7);
        let year = date.substring(0, 4);

        elem.date = `${day}/${month}/${year}`;

        elem.actions = `<div class="btn-group">
          <button title="Eliminar pérdida"   type="button" class="btn btn-sm btn-icon btn-danger   delete"  data-index="${index}" data-id="${elem._id}" > <i class="uil uil-multiply delete"></i> </button>
      </div>`;
      });

      mainTable.reloadTable(lossesData);
      unblockElem(searchForm);
    } catch (error) {
      unblockElem(searchForm);
      errorNotification("Error interno del servidor");
      console.error(error);
    }
  }

  async function save() {
    resetFormValidation();

    let response = validateForm();

    if (response.valid === false) {
      return;
    }

    disableButton(addLossBtn, "Agregando");

    try {
      let body = JSON.stringify(response.body);

      let request = await fetch(routes.add, {
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
          enableButton(addLossBtn, "Agregar");

          modalAlert("warning", "Aviso", messages);
          return;
        } else {
          modalAlert(
            "warning",
            "Aviso",
            `<strong>${json.message}</strong> <br>`
          );
          enableButton(addLossBtn, "Agregar");
          return;
        }
      }
      enableButton(addLossBtn, "Agregar");

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
      enableButton(addLossBtn, "Agregar");
      console.error(error);
    }
  }

  async function destroy(_id) {
    blockElem(mainTableBody);
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
          unblockElem(mainTableBody);
          modalAlert("warning", "Aviso", messages);
          return;
        } else {
          unblockElem(mainTableBody);

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
      errorNotification(error);
      unblockElem(mainTableBody);
      console.error(error);
    }
  }

  function validateSearchForm() {
    let body = {};
    let valid = true;

    $fields.forEach((elem) => {
      let data;
      let msg;
      switch (elem) {
        case "fechaInicio":
          data = document.querySelector(`#${elem}`);
          msg = document.querySelector(`#${elem}Msg`);

          if (!data.value) {
            data.classList.add("invalid-input");
            msg.innerHTML += "La fecha de inicio es requerida para filtrar";
            valid = false;
            return;
          } else {
            //varifica la fecha
            let dateFromInput = data.value;
            if (dateFromInput.length < 10) {
              console.log(dateFromInput.length);
              msg.innerHTML +=
                "Ingrese una fecha válida con el formato: <strong>dd/mm/aaaa</strong>";
              valid = false;
              return;
            } else {
              let day = dateFromInput.substring(0, 2);
              let month = dateFromInput.substring(3, 5);
              let year = dateFromInput.substring(6, 10);

              let newDate = new Date(year, month - 1, day);
              console.log("fecha inicio", newDate);
              let invalidDate = isDate(newDate);

              if (invalidDate) {
                msg.innerHTML +=
                  "Ingrese una fecha válida con el formato: <strong>dd/mm/aaaa</strong>";
                valid = false;
                return;
              }
              body[elem] = newDate;
            }
          }
          break;

        case "fechaFin":
          data = document.querySelector(`#${elem}`);
          msg = document.querySelector(`#${elem}Msg`);

          if (!data.value) {
            data.value;
            data.classList.add("invalid-input");
            msg.innerHTML += "La fecha de fin es requerida para filtrar";
            valid = false;
            return;
          } else {
            //varifica la fecha
            let dateFromInput = data.value;
            if (dateFromInput.length < 10) {
              msg.innerHTML +=
                "Ingrese una fecha válida con el formato: <strong>dd/mm/aaaa</strong>";
              valid = false;
              return;
            } else {
              let day = dateFromInput.substring(0, 2);
              let month = dateFromInput.substring(3, 5);
              let year = dateFromInput.substring(6, 10);

              let newDate = new Date(year, month - 1, day);
              console.log("fecha fin", newDate);
              let invalidDate = isDate(newDate);

              if (invalidDate) {
                msg.innerHTML +=
                  "Ingrese una fecha válida con el formato: <strong>dd/mm/aaaa</strong>";
                valid = false;
                return;
              }
              body[elem] = newDate;
            }
          }
          break;

        case "canceled":
          data = document.querySelector(`#${elem}`);

          body[elem] = data.checked;
      }

      if (
        body.fechaInicio != null &&
        body.fechaFin != null &&
        body.fechaInicio > body.fechaFin
      ) {
        warningNotification(
          "La fecha de inicio no puede ser mayor a la fecha fin"
        );
        valid = false;
      }
    });

    return {
      valid,
      body,
    };
  }

  function validateForm() {
    let body = {};
    let valid = true;

    $fields.forEach((elem) => {
      let data;
      let msg;
      switch (elem) {
        case "product":
          data = document.querySelector(`#${elem}`);
          msg = document.querySelector(`#${elem}Msg`);

          if (!data.value) {
            data.classList.add("invalid-input");
            msg.classList.add("text-danger");
            msg.innerHTML += "El producto es requerido";

            valid = false;
            return;
          } else {
            body[elem] = data.value;
          }
          break;

        case "quantity":
          data = document.querySelector(`#${elem}`);
          msg = document.querySelector(`#${elem}Msg`);

          if (!data.value || data.value == 0) {
            data.classList.add("invalid-input");
            msg.classList.add("text-danger");
            msg.innerHTML += "La cantidad es requerida y no puede ser cero";
            valid = false;
            return;
          } else {
            body[elem] = data.value;
          }
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
      case "lossesForm":
        document.querySelector("#lossesForm").reset();
        addLossBtn.classList.remove("d-none");
        let option = document.createElement("option");
        option.value = "";
        option.innerHTML = "Seleccione";
        productSelect.innerHTML = "";
        productSelect.appendChild(option);
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
      }
    });
  }

  function addLossBtnClick() {
    confirmationAlert("Se registrará la pérdida", () => {
      save(routes.add);
    });
  }

  function deleteConfirmation(_id) {
    confirmationAlert("Se borrará la pérdida seleccionada", () => {
      destroy(_id);
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
        showMainModalEdit(lossesData[index]);
      } else {
        let button = e.target;
        let index = button.getAttribute("data-index");
        showMainModalEdit(lossesData[index]);
      }
    }

    if (e.target && e.target.classList.contains("delete")) {
      if (e.target.tagName === "I") {
        let button = e.target.parentElement;
        let index = button.getAttribute("data-index");
        deleteConfirmation(lossesData[index]._id);
      } else {
        let button = e.target;
        let index = button.getAttribute("data-index");
        deleteConfirmation(lossesData[index]._id);
      }
    }
  }

  function showMainModalAdd() {
    document.querySelector("#modal_title").innerHTML =
      "Agrega una nueva pérdida";
    $("#main_modal").modal("show");
  }

  function searchProducts() {
    if (brandSelect.value != "" && articleTypeSelect.value != "") {
      fetchProducts();
    }
  }

  async function fetchProducts() {
    try {
      blockElem(lossesForm);

      let body = JSON.stringify({
        brand: document.querySelector("#brand").value,
        articleType: document.querySelector("#articleType").value,
      });

      let request = await fetch(routes.getProductsForCombo, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          credentials: "same-origin",
        },
        body,
      });

      let json = await request.json();

      console.log(json);
      if (json.error) {
        if (Array.isArray(json.message)) {
          let messages = "";
          json.message.forEach((msg) => {
            messages += `<strong>*${msg}</strong> <br>`;
          });
          modalAlert("warning", "Aviso", messages);
          unblockElem(lossesForm);
          return;
        } else {
          modalAlert(
            "warning",
            "Aviso",
            `<strong>*${json.message}</strong> <br>`
          );
          unblockElem(lossesForm);
          return;
        }
      }

      let products = json.response;

      products.forEach((prod) => {
        let option = document.createElement("option");
        option.value = prod._id;
        option.innerHTML = prod.name;

        productSelect.appendChild(option);
      });

      unblockElem(lossesForm);
    } catch (error) {
      errorNotification(error);
      unblockElem(lossesForm);
      console.error(error);
    }
  }

  $("#main_modal").on("hidden.bs.modal", function (e) {
    resetFormValidation();
    resetForm("lossesForm");
  });

  //Initial actions
  let mainTable = new NormalTable(
    "mainTable",
    lossesData,
    lossColumns,
    "btnNext",
    "btnPrev",
    "pageCounter",
    "6"
  );
  mainTable.reloadTable(lossesData);

  $(".datepicker-es").datepicker({
    language: "es",
    format: "dd/mm/yyyy",
    todayHighlight: true,
    weekStart: [1],
  });
});
