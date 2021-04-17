window.addEventListener("DOMContentLoaded", () => {
  //Variables & Elements
  let $fields = ["_id", "name"];
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

      articleTypeData = json.response;

      articleTypeData.forEach((elem, index) => {
        elem.actions = `<div class="btn-group">
          <button title="Editar"   type="button" class="btn btn-sm btn-icon btn-info   show"   style="border-top-left-radius: 1rem; border-bottom-left-radius: 1rem;"  data-index="${index}" data-id="${elem._id}" > <i class="uil uil-pen show"></i> </button>
          <button title="Deshabilitar" type="button" class="btn btn-sm btn-icon btn-danger delete" style="border-top-right-radius: 1rem; border-bottom-right-radius: 1rem;"  data-index="${index}" data-id="${elem._id}" > <i class="uil uil-multiply delete"></i> </button>
      </div>`;
      });

      mainTable.reloadTable(articleTypeData);
      unblockElem(searchForm);
    } catch (error) {
      unblockElem(searchForm);
      errorNotification("Error interno del servidor");
      console.error(error);
    }
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
    "2"
  );
  mainTable.reloadTable(salesData);

  

  $(".datepicker-es").datepicker({
    language: "es",
    format: "dd/mm/yyyy",
    todayHighlight: true,
    weekStart: [1],
  });
});
