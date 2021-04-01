const SITE = "localhost:3000/";

const isEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

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

const getRepeatedEntriesFromArray = (array, elementToSearch) => {
  let count = 0;
  array.forEach((element) => {
    count += element == elementToSearch ? 1 : 0;
  });
  return count;
};

//butons
const disableButton = (btn, msg) => {
  btn.setAttribute("disabled", true);
  btn.classList.add("disabled-btn");
  btn.innerHTML = `
  
  <div class="d-flex justify-content-between align-items-center">
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
      z_index: 1031,
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
      z_index: 1031,
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
      z_index: 1031,
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
