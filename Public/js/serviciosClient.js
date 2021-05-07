window.addEventListener("DOMContentLoaded", () => {
  //Variables & Elements
  let $fields = [
    "_id",
    "description",
    "total",
    "fechaInicio",
    "fechaFin",
  ];
  let routes = {
    get: "/searchServices",
    add: "/addSeervice",
    update: "/updateService",
    delete: "/deleteSerivce",
  };

  let servicesColumns = [
    { column: "description", class: "text-center" },
    { column: "total", class: "text-center" },
    { column: "date", class: "text-center" },
    { column: "actions", class: "text-center" },
  ];

  let servicesData = [];

  const searchBtn = document.querySelector("#btnSearch");
  const searchForm = document.querySelector("#searchForm");
  const btnClearSearch = document.querySelector("#btnClearSearch");
  const addBtn = document.querySelector("#btnAdd");
  const addServiceBtn = document.querySelector("#btnAddService");
  const updateService = document.querySelector("#btnUpdateService");
  const mainTableBody = document.querySelector("#mainTable tbody.list");

  //Listeners
  searchBtn.addEventListener("click", search);
  addBtn.addEventListener("click", showMainModalAdd);
  addServiceBtn.addEventListener("click", addServiceBtnClick);
  updateService.addEventListener("click", updateServiceClick);
  mainTableBody.addEventListener("click", rowClicked);
  btnClearSearch.addEventListener("click", clearSearch);

  //functions
  async function search() {
    try {
      console.log("va a buscar");
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

      servicesData = json.response;

      servicesData.forEach((elem, index) => {
        let date = elem.date.substring(0, 10);
        let day = date.substring(8, 10);
        let month = date.substring(5, 7);
        let year = date.substring(0, 4);

        elem.date = `${day}/${month}/${year}`;
        elem.total = `$${elem.total.toFixed(2)}`;

        elem.actions = `<div class="btn-group">
          <button title="Editar"   type="button" class="btn btn-sm btn-icon btn-info   show"   style="border-top-left-radius: 1rem; border-bottom-left-radius: 1rem;"  data-index="${index}" data-id="${elem._id}" > <i class="uil uil-pen show"></i> </button>
          <button title="Eliminar" type="button" class="btn btn-sm btn-icon btn-danger delete" style="border-top-right-radius: 1rem; border-bottom-right-radius: 1rem;"  data-index="${index}" data-id="${elem._id}" > <i class="uil uil-multiply delete"></i> </button>
      </div>`;
      });

      mainTable.reloadTable(servicesData);
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
    disableButton(
      addServiceBtn,
      route == "/updateService" ? "Actualizando" : "Agregando"
    );

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
          enableButton(
            addServiceBtn,
            route == "/updateService" ? "Actualizar" : "Agregar"
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
            addServiceBtn,
            route == "/updateService" ? "Actualizar" : "Agregar"
          );
          return;
        }
      }
      enableButton(
        addServiceBtn,
        route == "/updateService" ? "Actualizar" : "Agregar"
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
        addServiceBtn,
        route == "/updateService" ? "Actualizar" : "Agregar"
      );
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

        case "description":
          data = document.querySelector(`#${elem}`);
          msg = document.querySelector(`#${elem}Msg`);

          if (!data.value) {
            data.classList.add("invalid-input");
            msg.classList.add("text-danger");
            msg.innerHTML += "La decripción es requerida";

            valid = false;
            return;
          } else {
            body[elem] = data.value;
          }
          break;

        case "total":
          data = document.querySelector(`#${elem}`);
          msg = document.querySelector(`#${elem}Msg`);

          if (!data.value || data.value == 0) {
            data.classList.add("invalid-input");
            msg.classList.add("text-danger");
            msg.innerHTML += "La total es requerida y no puede ser cero";
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
      case "ServiceForm":
        document.querySelector("#ServiceForm").reset();
        addServiceBtn.classList.remove("d-none");
        updateService.classList.add("d-none");
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

  function addServiceBtnClick() {
    confirmationAlert("Se registrará el servicio", () => {
      save(routes.add);
    });
  }

  function updateServiceClick() {
    confirmationAlert("Se actualizará el servicio", () => {
      save(routes.update);
    });
  }

  function deleteConfirmation(_id) {
    confirmationAlert("Se eliminará el servicio", () => {
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
        showMainModalEdit(servicesData[index]);
      } else {
        let button = e.target;
        let index = button.getAttribute("data-index");
        showMainModalEdit(servicesData[index]);
      }
    }

    if (e.target && e.target.classList.contains("delete")) {
      if (e.target.tagName === "I") {
        let button = e.target.parentElement;
        let index = button.getAttribute("data-index");
        deleteConfirmation(servicesData[index]._id);
      } else {
        let button = e.target;
        let index = button.getAttribute("data-index");
        deleteConfirmation(servicesData[index]._id);
      }
    }
  }

  function showMainModalAdd() {
    document.querySelector("#modal_title").innerHTML =
      "Agregar un nuevo servicio";
    $("#main_modal").modal("show");
  }

  function showMainModalEdit(services) {
    addServiceBtn.classList.add("d-none");
    updateService.classList.remove("d-none");

    $fields.forEach((elem) => {
      if (elem != "fechaInicio" && elem != "fechaFin") {
        console.log(elem);
        document.querySelector(`#${elem}`).value = services[elem].replace("$","");
      }
    });

    document.querySelector("#modal_title").innerHTML = "Edita un servicio";
    $("#main_modal").modal("show");
  }

  $("#main_modal").on("hidden.bs.modal", function (e) {
    resetFormValidation();
    console.log("cierra");
    resetForm("ServiceForm");
  });

  //Initial actions
  let mainTable = new NormalTable(
    "mainTable",
    servicesData,
    servicesColumns,
    "btnNext",
    "btnPrev",
    "pageCounter",
    "5"
  );
  mainTable.reloadTable(servicesData);

  $(".datepicker-es").datepicker({
    language: "es",
    format: "dd/mm/yyyy",
    todayHighlight: true,
    weekStart: [1],
  });
});
