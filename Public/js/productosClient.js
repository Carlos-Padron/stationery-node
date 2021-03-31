window.addEventListener("DOMContentLoaded", () => {
  //Variables & Elements
  let $fields = [
    "_id",
    "name",
    "image",
    "price",
    "quantity",
    "type",
    "articleType",
  ];
  let routes = {
    get: "/getProducts",
    add: "/addProduct",
    update: "/updateProduct",
    delete: "/deleteProduct",
  };

  const DEFAULT_ROUTE = "http://localhost:3000/inventario/productos";
  let productsData = [];

  //Img elements
  const imgFileInput = document.createElement("input");
  const picuture = document.querySelector("#picture");
  const dropZone = document.querySelectorAll(".dropZone");
  const imgOverlay = document.querySelector("#imgOverlay");
  const uploadImgElem = document.querySelector("#uploadImgElem");
  const removeImgElem = document.querySelector("#removeImgElem");

  // Img Listeners
  imgFileInput.addEventListener("change", inputChanged);
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
  const searchForm = document.querySelector("#searchForm");
  const btnClearSearch = document.querySelector("#btnClearSearch");
  const addBtn = document.querySelector("#btnAdd");

  //Listeners
  searchBtn.addEventListener("click", search);
  addBtn.addEventListener("click", showMainModalAdd);
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

      brandsData = json.response;

      brandsData.forEach((elem, index) => {
        elem.actions = `<div class="btn-group">
          <button title="Editar"   type="button" class="btn btn-sm btn-icon btn-info   show"   style="border-top-left-radius: 1rem; border-bottom-left-radius: 1rem;"  data-index="${index}" data-id="${elem._id}" > <i class="uil uil-pen show"></i> </button>
          <button title="Deshabilitar" type="button" class="btn btn-sm btn-icon btn-danger delete" style="border-top-right-radius: 1rem; border-bottom-right-radius: 1rem;"  data-index="${index}" data-id="${elem._id}" > <i class="uil uil-multiply delete"></i> </button>
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

  async function save(route) {
    resetFormValidation();

    let response = validateForm();

    if (response.valid === false) {
      return;
    }

    disableButton(addBrandBtn, "Agregando");

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
          enableButton(addBrandBtn, "Agregar");

          modalAlert("warning", "Aviso", messages);
          return;
        } else {
          modalAlert(
            "warning",
            "Aviso",
            `<strong>${json.message}</strong> <br>`
          );
          return;
        }
      }
      enableButton(addBrandBtn, "Agregar");

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
      warningNotification("Error interno del servidor");
      enableButton(addBrandBtn, "Agregar");
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
      warningNotification(error);
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
      case "brandsForm":
        document.querySelector("#brandsForm").reset();
        addBrandBtn.classList.remove("d-none");
        updateBrandBtn.classList.add("d-none");
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

  function deleteConfirmation(_id) {
    confirmationAlert("Se deshabilitará la marca seleccionada", () => {
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
        showMainModalEdit(brandsData[index]);
      } else {
        let button = e.target;
        let index = button.getAttribute("data-index");
        showMainModalEdit(brandsData[index]);
      }
    }

    if (e.target && e.target.classList.contains("delete")) {
      if (e.target.tagName === "I") {
        let button = e.target.parentElement;
        let index = button.getAttribute("data-index");
        deleteConfirmation(brandsData[index]._id);
      } else {
        let button = e.target;
        let index = button.getAttribute("data-index");
        deleteConfirmation(brandsData[index]._id);
      }
    }
  }

  function showMainModalAdd() {
    document.querySelector("#modal_title").innerHTML =
      "Agregar un nuevo producto";
    $("#main_modal").modal("show");
  }

  function showMainModalEdit(brand) {
    addBrandBtn.classList.add("d-none");
    updateBrandBtn.classList.remove("d-none");

    $fields.forEach((elem) => {
      switch (elem) {
        case "disabled":
          document.querySelector(`#${elem}`).checked = brand[elem];
          break;

        default:
          document.querySelector(`#${elem}`).value = brand[elem];
          break;
      }
    });

    document.querySelector("#modal_title").innerHTML = "Editar marca";
    $("#main_modal").modal("show");
  }

  $("#main_modal").on("hidden.bs.modal", function (e) {
    resetFormValidation();
    resetForm("brandsForm");
  });

  //imgFile input functinos

  function inputChanged(e) {
    let image = imgFileInput.files;
    console.log("se agregó archivoo");
    console.log(image);
    showImage(image[0]);
  }

  function openFileExplorer() {
    console.log("click");
    console.log(imgFileInput);
    imgFileInput.click();
  }

  function preventtDefault(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function dropZoneDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    console.log("drop");
    let data = e.dataTransfer,
      image = data.files;

    console.log(data);
    console.log(image);

    showImage(image[0]);
  }

  function showImage(image) {
    if (validateImgage(image)) {
      var reader = new FileReader();
      reader.onload = (e) => (picuture.src = e.target.result);

      reader.readAsDataURL(image);
      imgOverlay.classList.remove("d-flex");
      imgOverlay.classList.add("d-none");
      removeImgElem.classList.remove("invisible");
    } else {
      imgOverlay.classList.remove("d-none");
      imgOverlay.style.display = "flex";

      removeImgElem.classList.add("invisible");
    }
  }

  function validateImgage(image) {
    let validTypes = ["image/jpeg", "image/png"];

    console.log(image.type);
    console.log(validTypes.indexOf(image.type));
    if (validTypes.indexOf(image.type) == -1) {
      alert("invalid file");
      return false;
    }

    var maxSizeInBytes = 2097152; // 2MB
    if (image.size > maxSizeInBytes) {
      alert("File too large");
      return false;
    }
    return true;
  }

  function clearImg() {
    picuture.src = "";
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

  imgFileInput.type = "file";
  imgFileInput.accept = "image/png, image/jpeg";

  if (picuture.src != DEFAULT_ROUTE) {
    imgOverlay.classList.add("d-none");
    imgOverlay.classList.remove("d-flex");
  } else {
    imgOverlay.classList.add("d-flex");
    removeImgElem.classList.add("invisible");
  }
});
