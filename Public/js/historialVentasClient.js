window.addEventListener("DOMContentLoaded", () => {
  //Variables & Elements
  let $fields = ["fechaInicio", "fechaFin", "canceled"];
  let routes = {
    get: "/getSales",
    printSales: "/printSales",
    printCancledSales: "/printCancledSales",
  };

  let salesColumns = [
    { column: "concept", class: "text-center" },
    { column: "total", class: "text-center" },
    { column: "date", class: "text-center" },
    { column: "canceled", class: "text-center" },
    { column: "actions", class: "text-center" },
  ];

  let salesData = [];

  const searchBtn = document.querySelector("#btnSearch");
  const searchForm = document.querySelector("#searchForm");
  const btnClearSearch = document.querySelector("#btnClearSearch");
  const mainTableBody = document.querySelector("#mainTable tbody.list");
  const btnPrintSalesDone = document.querySelector("#btnPrintSalesDone");
  const btnPrintCanceldSales = document.querySelector("#btnPrintCanceldSales");
  //Listeners
  searchBtn.addEventListener("click", search);
  mainTableBody.addEventListener("click", rowClicked);
  btnClearSearch.addEventListener("click", clearSearch);
  btnPrintSalesDone.addEventListener("click", printSaleReport);
  btnPrintCanceldSales.addEventListener("click", printSaleReport);

  //functions
  async function search() {
    try {
      resetFormValidation();

      let response = validateForm();

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

      salesData = json.response;

      salesData.forEach((elem, index) => {
        elem.total = `$${elem.total.toFixed(2)}`;

        let date = elem.date.substring(0, 10);
        let day = date.substring(8, 10);
        let month = date.substring(5, 7);
        let year = date.substring(0, 4);

        elem.date = `${day}/${month}/${year}`;

        elem.canceled =
          elem.canceled == true
            ? `<span class="badge badge-pill badge-danger">Cancelada</span>`
            : `<span class="badge badge-pill badge-success">Realizada</span>`;

        elem.actions = `<div class="btn-group">
          <button title="Mostrar detalles"   type="button" class="btn btn-sm btn-icon btn-info   details"  data-index="${index}" data-id="${elem._id}" > <i class="uil uil-eye details"></i> </button>
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

        case "canceled":
          data = document.querySelector(`#${elem}`);

          body[elem] = data.checked;
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
        redirectToDetailsShow(salesData[index]._id);
      } else {
        let button = e.target;
        let index = button.getAttribute("data-index");
        //redirect to detail
        redirectToDetailsShow(salesData[index]._id);
      }
    }
  }

  function redirectToDetailsShow(_id) {
    window.location = `/ventas/detalle/${_id}`;
  }

  async function printSaleReport(e) {
    blockElem(searchForm);
    let body = {};
    console.log();
    resetFormValidation();

    let response = validateForm();

    if (response.valid === false) {
      return;
    }

    blockElem(searchForm);

    body = JSON.stringify(response.body);

    try {
      let request = await fetch(
        e.target.id == "btnPrintSalesDone"
          ? routes.printSales
          : routes.printCancledSales,
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
