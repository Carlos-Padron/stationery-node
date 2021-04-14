window.addEventListener("DOMContentLoaded", () => {
  //Variables & Elements
  let $fields = [
    "_id",
    "name",
    "motherSurname",
    "fatherSurname",
    "email",
    "password",
  ];
  let routes = {
    get: "/getUsers",
    add: "/addUser",
    update: "/updateUser",
    delete: "/deleteUser",
  };

  let usuariosColums = [
    { column: "name", class: "text-center" },
    { column: "actions", class: "text-center" },
  ];
  let usuariosData = [];

  const searchBtn = document.querySelector("#btnSearch");
  const searchForm = document.querySelector("#searchForm");
  const btnClearSearch = document.querySelector("#btnClearSearch");
  const addBtn = document.querySelector("#btnAdd");
  const addUserBtn = document.querySelector("#btnAddUser");
  const updateUserBtn = document.querySelector("#btnUpdateUser");
  const mainTableBody = document.querySelector("#mainTable tbody.list");

  //Listeners
  searchBtn.addEventListener("click", search);
  addBtn.addEventListener("click", showMainModalAdd);
  addUserBtn.addEventListener("click", addUserBtnClick);
  updateUserBtn.addEventListener("click", updateUserBtnClick);
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

      usuariosData = json.response;

      usuariosData.forEach((elem, index) => {
        elem.actions = `<div class="btn-group">
        <button title="Editar"   type="button" class="btn btn-sm btn-icon btn-info   show"   style="border-top-left-radius: 1rem; border-bottom-left-radius: 1rem;"  data-index="${index}" data-id="${elem._id}" > <i class="uil uil-pen show"></i> </button>
        <button title="Deshabilitar" type="button" class="btn btn-sm btn-icon btn-danger delete" style="border-top-right-radius: 1rem; border-bottom-right-radius: 1rem;"  data-index="${index}" data-id="${elem._id}" > <i class="uil uil-multiply delete"></i> </button>
    </div>`;
      });

      mainTable.reloadTable(usuariosData);
      unblockElem(searchForm);
    } catch (error) {
      unblockElem(searchForm);
      errorNotification("Error interno del servidor");
      console.error(error);
    }
  }

  async function save(route, update) {
    resetFormValidation();
    let response = validateForm(update);

    if (response.valid === false) {
      return;
    }

    disableButton(
      addUserBtn,
      route == "/updateUser" ? "Actualizando" : "Agregando"
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
            addUserBtn,
            route == "/updateUser" ? "Actualizar" : "Agregar"
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
            addUserBtn,
            route == "/updateUser" ? "Actualizar" : "Agregar"
          );

          return;
        }
      }
      enableButton(
        addUserBtn,
        route == "/updateUser" ? "Actualizar" : "Agregar"
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
        addUserBtn,
        route == "/updateUser" ? "Actualizar" : "Agregar"
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

  function validateForm(update) {
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

        case "motherSurname":
          data = document.querySelector(`#${elem}`);
          msg = document.querySelector(`#${elem}Msg`);

          if (data.value === "") {
            data.classList.add("invalid-input");
            msg.innerHTML += "El apellido materno es requerido.";
            msg.classList.add("text-danger");
            valid = false;
          }
          body[elem] = data.value;
          break;

        case "fatherSurname":
          data = document.querySelector(`#${elem}`);
          msg = document.querySelector(`#${elem}Msg`);

          if (data.value === "") {
            data.classList.add("invalid-input");
            msg.innerHTML += "El apellido paterno es requerido.";
            msg.classList.add("text-danger");
            valid = false;
          }
          body[elem] = data.value;
          break;

        case "email":
          data = document.querySelector(`#${elem}`);
          msg = document.querySelector(`#${elem}Msg`);

          if (data.value === "") {
            data.classList.add("invalid-input");
            msg.innerHTML += "El email es requerido.";
            msg.classList.add("text-danger");
            valid = false;
          }

          if (!isEmail(data.value)) {
            data.classList.add("invalid-input");
            msg.innerHTML += "El email no es válido.";
            msg.classList.add("text-danger");
            valid = false;
          }
          body[elem] = data.value;
          break;

        case "disabled":
          data = document.querySelector(`#${elem}`);

          body[elem] = data.checked;
          break;

        case "password":
          if (!update) {
            data = document.querySelector(`#${elem}`);
            msg = document.querySelector(`#${elem}Msg`);

            if (data.value === "") {
              data.classList.add("invalid-input");
              msg.innerHTML += "La contraseña es requerida.";
              msg.classList.add("text-danger");
              valid = false;
            }

            if (data.value.length < 7) {
              data.classList.add("invalid-input");
              msg.innerHTML +=
                " La contraseña debe contar con más de 6 caracteres.";
              msg.classList.add("text-danger");
              valid = false;
            }
            body[elem] = data.value;
            break;
          }

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
      case "usuariosForm":
        document.querySelector("#usuariosForm").reset();
        addUserBtn.classList.remove("d-none");
        updateUserBtn.classList.add("d-none");
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

  function addUserBtnClick() {
    confirmationAlert("Se registrará el usuario.", () => {
      save(routes.add);
    });
  }

  function updateUserBtnClick() {
    confirmationAlert("Se actualizará el usuario.", () => {
      save(routes.update, true);
    });
  }

  function deleteConfirmation(_id) {
    confirmationAlert("Se deshabilitará el usuario seleccionado.", () => {
      destroy(_id);
    });
  }

  function clearSearch() {
    resetForm("searchForm");
  }

  async function rowClicked(e) {
    if (e.target && e.target.classList.contains("show")) {
      if (e.target.tagName === "I") {
        let button = e.target.parentElement;
        let index = button.getAttribute("data-index");
        showMainModalEdit(usuariosData[index]);
      } else {
        let button = e.target;
        let index = button.getAttribute("data-index");
        showMainModalEdit(usuariosData[index]);
      }
    }

    if (e.target && e.target.classList.contains("delete")) {
      if (e.target.tagName === "I") {
        let button = e.target.parentElement;
        let index = button.getAttribute("data-index");
        deleteConfirmation(usuariosData[index]._id);
      } else {
        let button = e.target;
        let index = button.getAttribute("data-index");
        deleteConfirmation(usuariosData[index]._id);
      }
    }
  }

  function showMainModalAdd() {
    document.querySelector("#modal_title").innerHTML = "Agregar nuevo usuario";
    $("#main_modal").modal("show");
  }

  function showMainModalEdit(usuario) {
    addUserBtn.classList.add("d-none");
    updateUserBtn.classList.remove("d-none");

    $fields.forEach((elem) => {
      if (elem != "password") {
        switch (elem) {
          case "disabled":
            document.querySelector(`#${elem}`).checked = usuario[elem];
            break;

          default:
            document.querySelector(`#${elem}`).value = usuario[elem];
            break;
        }
      }
    });

    document.querySelector("#modal_title").innerHTML = "Editar usuario";
    $("#main_modal").modal("show");
  }

  $("#main_modal").on("hidden.bs.modal", function (e) {
    resetFormValidation();
    resetForm("usuariosForm");
  });

  //Initial actions
  let mainTable = new NormalTable(
    "mainTable",
    usuariosData,
    usuariosColums,
    "btnNext",
    "btnPrev",
    "pageCounter",
    "2"
  );
  mainTable.reloadTable(usuariosData);
});
