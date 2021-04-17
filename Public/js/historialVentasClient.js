window.addEventListener("DOMContentLoaded", () => {
  //Variables & Elements
  let $fields = ["fechaInicio", "fechaFin"];
  let routes = {
    get: "/getArticleTypes",
  };

  let salesColumns = [
    { column: "concept", class: "text-center" },
    { column: "total", class: "text-center" },
    { column: "discount", class: "text-center" },
    { column: "date", class: "text-center" },
    { column: "actions", class: "text-center" },
  ];

  let salesData = [];

  const searchBtn = document.querySelector("#btnSearch");
  const searchForm = document.querySelector("#searchForm");
  const btnClearSearch = document.querySelector("#btnClearSearch");
  const mainTableBody = document.querySelector("#mainTable tbody.list");

  //Listeners
  searchBtn.addEventListener("click", search);
  mainTableBody.addEventListener("click", rowClicked);
  btnClearSearch.addEventListener("click", clearSearch);

  //functions
  async function search() {
    resetFormValidation();

    let response = validateForm();

    if (response.valid === false) {
      return;
    }

    console.log(response.body);

    return;
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

      salesData = json.response;

      salesData.forEach((elem, index) => {
        elem.actions = `<div class="btn-group">
          <button title="Editar"   type="button" class="btn btn-sm btn-icon btn-info   show"   style="border-top-left-radius: 1rem; border-bottom-left-radius: 1rem;"  data-index="${index}" data-id="${elem._id}" > <i class="uil uil-pen show"></i> </button>
          <button title="Deshabilitar" type="button" class="btn btn-sm btn-icon btn-danger delete" style="border-top-right-radius: 1rem; border-bottom-right-radius: 1rem;"  data-index="${index}" data-id="${elem._id}" > <i class="uil uil-multiply delete"></i> </button>
      </div>`;
      });

      mainTable.reloadTable(salesData);
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
      }
    });

    return {
      valid,
      body,
    };
  }

  async function resetForm(form) {
    switch (form) {
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

  function clearSearch() {
    resetForm("searchForm");
  }

  function rowClicked(e) {
    if (e.target && e.target.classList.contains("details")) {
      if (e.target.tagName === "I") {
        let button = e.target.parentElement;
        let index = button.getAttribute("data-index");
        //redirect to detail
      } else {
        let button = e.target;
        let index = button.getAttribute("data-index");
        //redirect to detail
      }
    }
  }

  //Initial actions
  let mainTable = new NormalTable(
    "mainTable",
    salesData,
    salesColumns,
    "btnNext",
    "btnPrev",
    "pageCounter",
    "5"
  );
  mainTable.reloadTable(salesData);

  $(".datepicker-es").datepicker({
    language: "es",
    format: "dd/mm/yyyy",
    todayHighlight: true,
    weekStart: [1],
  });
});
