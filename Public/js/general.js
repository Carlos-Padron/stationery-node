/* const DEFAULT_ROUTE_PRODUCTS = `${window.location.protocol}//${window.location.hostname}:3000/inventario/productos`; */
/* const DEFAULT_ROUTE_USER = `${window.location.protocol}//${window.location.hostname}:3000/perfil`; */

const isEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

const isDate = (date) => {
  return date.toString() == "Invalid Date";
};

//Input Events
const currencyMask = () => {
  let e = event;
  let target = e.target;
  let value = target.value;

  let charArray = Array.from(value);
  let arrayLength = charArray.length;

  if (arrayLength > 0) {
    if (
      charArray[arrayLength - 1] == "." &&
      getRepeatedEntriesFromArray(charArray, ".") >= 2
    ) {
      value = value.substring(0, arrayLength - 1);
      target.value = value;
      return;
    }

    if (
      charArray[arrayLength - 1] != "." &&
      isNaN(parseInt(charArray[arrayLength - 1]))
    ) {
      value = value.substring(0, arrayLength - 1);
      target.value = value;
      return;
    }
  }
};

const numericMask = () => {
  let e = event;
  let target = e.target;
  let value = target.value;

  let charArray = Array.from(value);
  let arrayLength = charArray.length;

  if (arrayLength > 0) {
    if (isNaN(parseInt(charArray[arrayLength - 1]))) {
      value = value.substring(0, arrayLength - 1);
      target.value = value;
      return;
    }
  }
};

const dateMask = () => {
  let e = event;
  let input = e.target;
  let length = input.value.length;

  if (e.keyCode < 47 || e.keyCode > 57) {
    e.preventDefault();
  }

  // If we're at a particular place, let the user type the slash
  // i.e., 12/12/1212
  if (length !== 1 || length !== 3) {
    if (e.keyCode == 47) {
      e.preventDefault();
    }
  }

  // If they don't add the slash, do it for them...
  if (length === 2) {
    input.value += "/";
  }

  // If they don't add the slash, do it for them...
  if (length === 5) {
    input.value += "/";
  }
};

const getRepeatedEntriesFromArray = (array, elementToSearch) => {
  let count = 0;
  array.forEach((element) => {
    count += element == elementToSearch ? 1 : 0;
  });
  return count;
};

//butons
const disableButton = (btn, msg, justify = "justify-content-between") => {
  btn.setAttribute("disabled", true);
  btn.classList.add("disabled-btn");
  btn.innerHTML = `
  
  <div class="d-flex ${justify} align-items-center">
    <div class="spinner-border spinner-border-sm text-light" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    <span>${msg}</span>
  </div>
  `;
};

const enableButton = (btn, msg) => {
  btn.removeAttribute("disabled");
  btn.classList.remove("disabled-btn");
  btn.innerHTML = msg;
};

//SweetAlert
var modalAlert = (type, title, html, func) => {
  let color = "";
  switch (type) {
    case "success":
      color = "#2dce89";
      break;
    case "warining":
      color = "#fb6340";
      break;
    case "question":
      color = "#172b4d";
      break;
    default:
      color = "#5e72e4";
      break;
  }

  Swal.fire({
    type,
    title,
    html,
    confirmButtonColor: color,
    cancelButtonColor: "#f5365c",
  }).then(() => {
    if (func != undefined) {
      func();
    }
  });
};

var confirmationAlert = (text, func) => {
  Swal.fire({
    type: "question",
    title: "Confirmación requerida",
    text,
    showCancelButton: true,
    confirmButtonColor: "#5e72e4",
    confirmButtonText: "Confirmar",
    cancelButtonColor: "#f5365c",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.value) {
      func();
    }
  });
};

//Notify
var successNotification = (message) => {
  $.notify(
    { message: message },
    {
      type: "success",
      allow_dismiss: true,
      z_index: 16777271,
      delay: 2000,
      offset: {
        x: 20,
        y: 20,
      },
      placement: {
        from: "top",
        align: "right",
      },
      animate: {
        enter: "animated fadeIn",
        exit: "animated fadeOut",
      },
    }
  );
};

var errorNotification = (message) => {
  $.notify(
    { message: message },
    {
      type: "danger",
      allow_dismiss: true,
      z_index: 16777271,
      delay: 2000,
      offset: {
        x: 20,
        y: 20,
      },
      placement: {
        from: "top",
        align: "right",
      },
      animate: {
        enter: "animated fadeIn",
        exit: "animated fadeOut",
      },
    }
  );
};

var warningNotification = (message) => {
  $.notify(
    { message: message },
    {
      type: "warning",
      allow_dismiss: true,
      z_index: 16777271,
      delay: 2000,
      offset: {
        x: 20,
        y: 20,
      },
      placement: {
        from: "top",
        align: "right",
      },
      animate: {
        enter: "animated fadeIn",
        exit: "animated fadeOut",
      },
    }
  );
};

//Custom Functions
var blockElem = (elem) => {
  elem.style.position = "relative";
  const div = document.createElement("div");
  div.classList.add("overlay");

  const spinnerDiv = document.createElement("div");
  spinnerDiv.classList.add("sk-folding-cube");

  const spinner1 = document.createElement("div");
  spinner1.classList.add("sk-cube1", "sk-cube");

  const spinner2 = document.createElement("div");
  spinner2.classList.add("sk-cube2", "sk-cube");

  const spinner4 = document.createElement("div");
  spinner4.classList.add("sk-cube3", "sk-cube");

  const spinner3 = document.createElement("div");
  spinner3.classList.add("sk-cube4", "sk-cube");

  spinnerDiv.appendChild(spinner1);
  spinnerDiv.appendChild(spinner2);
  spinnerDiv.appendChild(spinner3);
  spinnerDiv.appendChild(spinner4);

  div.appendChild(spinnerDiv);

  elem.prepend(div);
};

var unblockElem = (elem) => {
  document.querySelector(".overlay").remove();
  elem.style.position = "unset";
  if (document.querySelector(".overlay")) {
    elem.removeChild(document.querySelector(".overlay"));
  }
};

///* DOM ELEMENTS *///

document.querySelector("#userImage").src = localStorage.getItem("userImage");
document.querySelector("#userName").innerHTML = localStorage.getItem(
  "userName"
);

const role = localStorage.getItem("role");
if (role) {
  if (role == "admin") {
    document.querySelector("#usuarioMenu").classList.remove("d-none");
  } else {
    document.querySelector("#usuarioMenu").remove();
  }
} else {
  document.querySelector("#usuarioMenu").remove();
}
