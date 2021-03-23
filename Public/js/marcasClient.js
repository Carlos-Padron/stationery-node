window.addEventListener("DOMContentLoaded", () => {
  //Variables & Elements
  let $fields = ["_id", "name"];
  let routes = {
    get: "/getBrands",
    add: "/getBrand",
    update: "/updateBrand",
    delete: "/deleteBrand",
  };

  let brandColumns = [
    { column: "name", class: "text-center" },
    { column: "actions", class: "text-center" },
  ];

  let brandsData = [];

  const searchBtn = document.querySelector("#btnSearch");
  const searchForm = document.querySelector("#searchForm");
  const btnClearSearch = document.querySelector("#btnClearSearch");
  const addBtn = document.querySelector("#btnAdd");
  const addBrandBtn = document.querySelector("#btnAddBrand");
  const updateBrandBtn = document.querySelector("#btnUpdateBrand");
  const mainTableBody = document.querySelector("#mainTable tbody.list");

  //Listeners
  searchBtn.addEventListener("click", search);
  addBtn.addEventListener("click", showMainModalAdd);
  addBrandBtn.addEventListener("click", addBrandBtnClick);
  updateBrandBtn.addEventListener("click", updateBrandBtnClick),
  mainTableBody.addEventListener("click", rowClicked);
  btnClearSearch.addEventListener("click", clearSearch);

  //functions
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

      brandsData = json.response;

      brandsData.forEach((elem, index) => {
        elem.actions = `<div class="btn-group">
        <button title="Editar"   type="button" class="btn btn-sm btn-icon btn-info   show"   style="border-top-left-radius: 1rem; border-bottom-left-radius: 1rem;"  data-index="${index}" data-id="${elem._id}" > <i class="uil uil-pen show"></i> </button>
        <button title="Eliminar" type="button" class="btn btn-sm btn-icon btn-danger delete" style="border-top-right-radius: 1rem; border-bottom-right-radius: 1rem;"  data-index="${index}" data-id="${elem._id}" > <i class="uil uil-multiply delete"></i> </button>
    </div>`;
      });

      mainTable.reloadTable(brandsData);
      unblockElem(searchForm);
    } catch (error) {
      unblockElem(searchForm);
      warningNotification("Error interno del servidor");
      console.error(error);
    }
  }

  function showMainModalAdd() {
    document.querySelector("#modal_title").innerHTML =
      "Agregar una nueva marca";
    $("#main_modal").modal("show");
  }

  function addBrandBtnClick() {}

  function updateBrandBtnClick() {}

  function rowClicked(e) {}

  function clearSearch() {}

  $("#main_modal").on("hidden.bs.modal", function (e) {
    resetFormValidation();
    resetForm("usuarios_form");
  });

  //Initial actions
  let mainTable = new NormalTable(
    "mainTable",
    brandsData,
    brandColumns,
    "btnNext",
    "btnPrev",
    "pageCounter",
    "2"
  );
  mainTable.reloadTable(brandsData);
});
