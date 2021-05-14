window.addEventListener("DOMContentLoaded", () => {
  //Variables & Elements
  let $fields = ["_id", "name"];
  let routes = {
    get: "/getArticleTypes",
    add: "/addArticleType",
    update: "/updateArticleType",
    delete: "/deleteArticleType",
    enable: "/enableArticleType",
  };

  let articleTypeColumns = [
    { column: "name", class: "text-center" },
    { column: "actions", class: "text-center" },
  ];

  let articleTypeData = [];

  const searchBtn = document.querySelector("#btnSearch");
  const searchForm = document.querySelector("#searchForm");
  const btnClearSearch = document.querySelector("#btnClearSearch");
  const addBtn = document.querySelector("#btnAdd");
  const addArticleTypeBtn = document.querySelector("#btnAddArticleType");
  const updateArticleTypeBtn = document.querySelector("#btnUpdateArticleType");
  const mainTableBody = document.querySelector("#mainTable tbody.list");

  //Listeners
  searchBtn.addEventListener("click", search);
  addBtn.addEventListener("click", showMainModalAdd);
  addArticleTypeBtn.addEventListener("click", addArticleTypeBtnClick);
  updateArticleTypeBtn.addEventListener("click", updateArticleTypeBtnClick);
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
      let role = localStorage.getItem("role");

      articleTypeData.forEach((elem, index) => {
        if (role == "admin") {
          if (elem.disabled) {
            elem.actions = `
            <button title="Habilitar"   type="button" class="btn btn-sm btn-icon btn-warning   enable" ;"  data-index="${index}" data-id="${elem._id}" > <i class="uil uil-refresh enable "></i></button>
          `;
          } else {
            elem.actions = `<div class="btn-group">
            <button title="Editar"   type="button" class="btn btn-sm btn-icon btn-info   show"   style="border-top-left-radius: 1rem; border-bottom-left-radius: 1rem;"  data-index="${index}" data-id="${elem._id}" > <i class="uil uil-pen show"></i> </button>
            <button title="Deshabilitar" type="button" class="btn btn-sm btn-icon btn-danger delete" style="border-top-right-radius: 1rem; border-bottom-right-radius: 1rem;"  data-index="${index}" data-id="${elem._id}" > <i class="uil uil-multiply delete"></i> </button>
        </div>`;
          }
        } else {
          elem.actions = `<div class="btn-group">
          <button title="Editar"   type="button" class="btn btn-sm btn-icon btn-info   show"   style="border-top-left-radius: 1rem; border-bottom-left-radius: 1rem;"  data-index="${index}" data-id="${elem._id}" > <i class="uil uil-pen show"></i> </button>
          <button title="Deshabilitar" type="button" class="btn btn-sm btn-icon btn-danger delete" style="border-top-right-radius: 1rem; border-bottom-right-radius: 1rem;"  data-index="${index}" data-id="${elem._id}" > <i class="uil uil-multiply delete"></i> </button>
      </div>`;
        }
      });

      mainTable.reloadTable(articleTypeData);
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

    disableButton(
      addArticleTypeBtn,
      route == "/updateArticleType" ? "Actualizando" : "Agregando"
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
            addArticleTypeBtn,
            route == "/updateArticleType" ? "Actualizar" : "Agregar"
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
            addArticleTypeBtn,
            route == "/updateArticleType" ? "Actualizar" : "Agregar"
          );
          return;
        }
      }
      enableButton(
        addArticleTypeBtn,
        route == "/updateArticleType" ? "Actualizar" : "Agregar"
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
        addArticleTypeBtn,
        route == "/updateArticleType" ? "Actualizar" : "Agregar"
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

  async function enable(_id) {
    blockElem(mainTableBody);
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
        case "disabled":
          data = document.querySelector(`#${elem}`);
          body[elem] = data.checked;
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
      case "articleTypeForm":
        document.querySelector("#articleTypeForm").reset();
        addArticleTypeBtn.classList.remove("d-none");
        updateArticleTypeBtn.classList.add("d-none");
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

  function addArticleTypeBtnClick() {
    confirmationAlert("Se registrará el tipo de artículo", () => {
      save(routes.add);
    });
  }

  function updateArticleTypeBtnClick() {
    confirmationAlert("Se actualizará el tipo de artículo", () => {
      save(routes.update);
    });
  }

  function deleteConfirmation(_id) {
    confirmationAlert(
      "Se deshabilitará el tipo de artículo seleccionada",
      () => {
        destroy(_id);
      }
    );
  }

  function enableConfirmation(_id) {
    confirmationAlert("Se habilitará el tipo de artículo seleccionada", () => {
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
        showMainModalEdit(articleTypeData[index]);
      } else {
        let button = e.target;
        let index = button.getAttribute("data-index");
        showMainModalEdit(articleTypeData[index]);
      }
    }

    if (e.target && e.target.classList.contains("delete")) {
      if (e.target.tagName === "I") {
        let button = e.target.parentElement;
        let index = button.getAttribute("data-index");
        deleteConfirmation(articleTypeData[index]._id);
      } else {
        let button = e.target;
        let index = button.getAttribute("data-index");
        deleteConfirmation(articleTypeData[index]._id);
      }
    }

    if (e.target && e.target.classList.contains("enable")) {
      if (e.target.tagName === "I") {
        let button = e.target.parentElement;
        let index = button.getAttribute("data-index");
        enableConfirmation(articleTypeData[index]._id);
      } else {
        let button = e.target;
        let index = button.getAttribute("data-index");
        enableConfirmation(articleTypeData[index]._id);
      }
    }
  }

  function showMainModalAdd() {
    document.querySelector("#modal_title").innerHTML =
      "Agregar una nueva marca";
    $("#main_modal").modal("show");
  }

  function showMainModalEdit(articleType) {
    addArticleTypeBtn.classList.add("d-none");
    updateArticleTypeBtn.classList.remove("d-none");

    $fields.forEach((elem) => {
      switch (elem) {
        case "disabled":
          document.querySelector(`#${elem}`).checked = articleType[elem];
          break;

        default:
          document.querySelector(`#${elem}`).value = articleType[elem];
          break;
      }
    });

    document.querySelector("#modal_title").innerHTML =
      "Editar tipo de artículo";
    $("#main_modal").modal("show");
  }

  $("#main_modal").on("hidden.bs.modal", function (e) {
    resetFormValidation();
    resetForm("articleTypeForm");
  });

  //Initial actions
  let mainTable = new NormalTable(
    "mainTable",
    articleTypeData,
    articleTypeColumns,
    "btnNext",
    "btnPrev",
    "pageCounter",
    "2"
  );
  mainTable.reloadTable(articleTypeData);
});
/*  */
