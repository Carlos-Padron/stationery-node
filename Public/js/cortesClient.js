window.addEventListener("DOMContentLoaded", () => {
  //Variables & Elements
  let $fields = ["_id", "date", "fechaInicio", "fechaFin"];
  let routes = {
    get: "/searchCahsOuts",
    add: "/addCashOut",
    update: "/updateCashOut",
    printCashOuts: "/printCashOuts",
  };

  let cashOutColumns = [
    { column: "date", class: "text-center" },
    { column: "totalSales", class: "text-center" },
    { column: "actions", class: "text-center" },
  ];

  let cashOutsData = [];

  const searchBtn = document.querySelector("#btnSearch");
  const searchForm = document.querySelector("#searchForm");
  const btnClearSearch = document.querySelector("#btnClearSearch");
  const printBtn = document.querySelector("#print");
  const addBtn = document.querySelector("#btnAdd");
  const addCashOutBtn = document.querySelector("#btnAddCashOut");
  const mainTableBody = document.querySelector("#mainTable tbody.list");

  //Listeners
  searchBtn.addEventListener("click", search);
  addBtn.addEventListener("click", showMainModalAdd);
  addCashOutBtn.addEventListener("click", addCashOutBtnClick);
  mainTableBody.addEventListener("click", rowClicked);
  btnClearSearch.addEventListener("click", clearSearch);
  printBtn.addEventListener("click", printCashOuts);

  //functions
  async function search() {
    try {
      resetSearchFormValidation();
      let response = validateSearchForm();

      if (response.valid === false) {
        return;
      }

      blockElem(searchForm);

      body = JSON.stringify(response.body);

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

      cashOutsData = json.response;

      cashOutsData.forEach((elem, index) => {
        let date = elem.date.substring(0, 10);
        let day = date.substring(8, 10);
        let month = date.substring(5, 7);
        let year = date.substring(0, 4);

        elem.date = `${day}/${month}/${year}`;

        elem.totalSales = `$${elem.totalSales.toFixed(2)}`;

        elem.actions = `<div class="btn-group">
          <button title="Actualizar"   type="button" class="btn btn-sm btn-icon btn-info   update"    data-index="${index}" data-id="${elem._id}" > <i class="uil uil-sync update"></i> </button>
      </div>`;
      });

      mainTable.reloadTable(cashOutsData);
      unblockElem(searchForm);
    } catch (error) {
      unblockElem(searchForm);
      errorNotification("Error interno del servidor");
      console.error(error);
    }
  }

  async function save(route) {
    let response = validateForm();

    if (response.valid === false) {
      return;
    }

    console.log(route);
    disableButton(addCashOutBtn, "Agregando");

    try {
      console.log(response.body);
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
          enableButton(addCashOutBtn, "Agregar");

          modalAlert("warning", "Aviso", messages);
          return;
        } else {
          modalAlert(
            "warning",
            "Aviso",
            `<strong>${json.message}</strong> <br>`
          );
          enableButton(addCashOutBtn, "Agregar");
          return;
        }
      }
      enableButton(addCashOutBtn, "Agregar");

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
      enableButton(addCashOutBtn, "Agregar");
      console.error(error);
    }
  }

  async function update(_id) {
    blockElem(mainTableBody);
    let body = JSON.stringify({ _id });

    try {
      let request = await fetch(routes.update, {
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

  async function printCashOuts() {
    try {
      resetSearchFormValidation();
      let response = validateSearchForm();

      if (response.valid === false) {
        return;
      }

      blockElem(searchForm);

      body = JSON.stringify(response.body);

      let request = await fetch(routes.printCashOuts, {
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

        case "date":
          data = document.querySelector(`#${elem}`);
          msg = document.querySelector(`#${elem}Msg`);
          console.log(data);
          if (!data.value) {
            data.classList.add("invalid-input");
            msg.innerHTML += "La fecha es requerida para hacer el corte";
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
      }
    });

    let today = new Date();
    if (body.date > today) {
      warningNotification("La fecha de corte no puede ser mayor al día de hoy");
      valid = false;
    }

    return {
      valid,
      body,
    };
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
          console.log(data);
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

        default:
          break;
      }
    });

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

    return {
      valid,
      body,
    };
  }

  async function resetForm(form) {
    switch (form) {
      case "cashOutForm":
        document.querySelector("#cashOutForm").reset();
        addCashOutBtn.classList.remove("d-none");
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

  function resetSearchFormValidation() {
    let msg = document.querySelector(`#fechaInicioMsg`);
    let field = document.querySelector(`#fechaInicio`);

    if (field) {
      field.classList.remove("invalid-input");
    }
    if (msg) {
      msg.innerHTML = "";
    }

    msg = document.querySelector(`#fechaFinMsg`);
    field = document.querySelector(`#fechaFin`);

    if (field) {
      field.classList.remove("invalid-input");
    }
    if (msg) {
      msg.innerHTML = "";
    }
  }

  function addCashOutBtnClick() {
    confirmationAlert("Se registrará el corte de caja del día de hoy ", () => {
      save(routes.add);
    });
  }

  function clearSearch() {
    resetForm("searchForm");
  }

  function rowClicked(e) {
    if (e.target && e.target.classList.contains("update")) {
      if (e.target.tagName === "I") {
        let button = e.target.parentElement;
        let index = button.getAttribute("data-index");
        updateConfirmation(cashOutsData[index]._id);
      } else {
        let button = e.target;
        let index = button.getAttribute("data-index");
        updateConfirmation(cashOutsData[index]._id);
      }
    }
  }

  function updateConfirmation(_id) {
    confirmationAlert("Se actualizará el corte de caja", () => {
      update(_id);
    });
  }

  function showMainModalAdd() {
    document.querySelector("#modal_title").innerHTML =
      "Agregar un nuevo corte de caja";
    $("#main_modal").modal("show");
  }

  $("#main_modal").on("hidden.bs.modal", function (e) {
    resetFormValidation();
    console.log("cierra");
    resetForm("cashOutForm");
  });

  //Initial actions
  let mainTable = new NormalTable(
    "mainTable",
    cashOutsData,
    cashOutColumns,
    "btnNext",
    "btnPrev",
    "pageCounter",
    "3"
  );
  mainTable.reloadTable(cashOutsData);

  $(".datepicker-es").datepicker({
    language: "es",
    format: "dd/mm/yyyy",
    todayHighlight: true,
    weekStart: [1],
  });
});
