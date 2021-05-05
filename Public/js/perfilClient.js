window.addEventListener("DOMContentLoaded", () => {
  let $fields = [
    "name",
    "motherSurname",
    "fatherSurname",
    "email",
    "password",
    "image",
  ];

  let routes = {
    update: "/updateUser",
  };

  //Img elements
  const imgFileInput = document.createElement("input");
  const image = document.querySelector("#image");
  const dropZone = document.querySelectorAll(".dropZone");
  const imgOverlay = document.querySelector("#imgOverlay");
  const uploadImgElem = document.querySelector("#uploadImgElem");
  const removeImgElem = document.querySelector("#removeImgElem");

  // Img Listeners
  imgFileInput.addEventListener("input", inputChanged);
  removeImgElem.addEventListener("click", clearImg);
  uploadImgElem.addEventListener("click", openFileExplorer);
  dropZone.forEach((elem) => {
    elem.addEventListener("dragenter", preventtDefault);
    elem.addEventListener("dragleave", preventtDefault);
    elem.addEventListener("dragover", preventtDefault);
    elem.addEventListener("drop", dropZoneDrop);
  });

  //Main elements
  const addUserBtn = document.querySelector("#btnUpdate");

  //Listeners
  addUserBtn.addEventListener("click", updateUserClick);

  //Functions
  function updateUserClick() {
    confirmationAlert("Se actualizará tu información.", () => {
      save(routes.update);
    });
  }

  async function save(route) {
    resetFormValidation();
    let response = validateForm();

    if (response.valid === false) {
      return;
    }

    console.log(route);
    console.log(response.body);
    disableButton(addUserBtn, "Actualizando", "justify-content-center");

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
          enableButton(addUserBtn, "Actualizar");

          modalAlert("warning", "Aviso", messages);
          return;
        } else {
          modalAlert(
            "warning",
            "Aviso",
            `<strong>${json.message}</strong> <br>`
          );
          enableButton(addUserBtn, "Actualizar");

          return;
        }
      }
      enableButton(addUserBtn, "Actualizar");

      modalAlert(
        "success",
        "Aviso ",
        `<strong>${json.message}</strong> <br>`,
        () => {
          $("#main_modal").modal("hide");
          //Resetar la info
        }
      );
    } catch (error) {
      errorNotification("Error interno del servidor");
      enableButton(addUserBtn, "Actualizar");
      console.error(error);
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
        case "image":
          data = document.querySelector(`#${elem}`);
          body[elem] =
            data.src === "" ||
            data.src === undefined ||
            data.src === DEFAULT_ROUTE_USER
              ? null
              : data.src;
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

        case "password":
          data = document.querySelector(`#${elem}`);
          msg = document.querySelector(`#${elem}Msg`);

          console.log(data.value);
          console.log(data.value != "");
          console.log(data.value != undefined);
          console.log(data.value.length < 7);

          if (data.value != "" && data.value != undefined) {
            if (data.value.length < 7) {
              console.log(data.value);
              data.classList.add("invalid-input");
              msg.innerHTML +=
                " La contraseña debe contar con más de 6 caracteres.";
              msg.classList.add("text-danger");
              valid = false;
            } else {
              body[elem] = data.value;
            }
          }

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

  //imgFile input functinos
  function inputChanged(e) {
    let image = imgFileInput.files;
    showImage(image[0]);
  }

  function openFileExplorer() {
    imgFileInput.click();
  }

  function preventtDefault(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function dropZoneDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    let data = e.dataTransfer,
      image = data.files;

    showImage(image[0]);
  }

  function showImage(imageToRead) {
    if (validateImgage(imageToRead)) {
      var reader = new FileReader();
      reader.onload = (e) => {
        image.src = e.target.result;

        imgOverlay.classList.remove("d-flex");
        imgOverlay.classList.add("d-none");
        removeImgElem.classList.remove("invisible");
      };

      reader.readAsDataURL(imageToRead);
    } else {
      imgOverlay.classList.remove("d-none");
      imgOverlay.style.display = "flex";

      removeImgElem.classList.add("invisible");
    }
  }

  function validateImgage(image) {
    let validTypes = ["image/jpeg", "image/png"];

    if (validTypes.indexOf(image.type) == -1) {
      errorNotification("Solo se aceptan imágenes png y jpg");

      return false;
    }

    return true;
  }

  function clearImg() {
    image.src = "";
    imgOverlay.classList.add("d-flex");
    removeImgElem.classList.add("invisible");
  }

  //Initial Action
  imgFileInput.type = "file";
  imgFileInput.accept = "image/png, image/jpeg";

  console.log();
  if (
    image.src != DEFAULT_ROUTE_USER &&
    image.src != null &&
    image.src != undefined &&
    image.src != ""
  ) {
    imgOverlay.classList.add("d-none");
    imgOverlay.classList.remove("d-flex");
    removeImgElem.classList.remove("invisible");
  } else {
    imgOverlay.classList.add("d-flex");
    removeImgElem.classList.add("invisible");
  }
});
