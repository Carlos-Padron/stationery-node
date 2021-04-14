document.addEventListener("DOMContentLoaded", () => {
  //Elements
  var logInButton = document.querySelector("#logInBtn");

  var email = document.querySelector("#email");
  var emailDiv = document.querySelector("#emailDiv");
  var emailMsg = document.querySelector("#emailMsg");

  var pw = document.querySelector("#pw");
  var pwDiv = document.querySelector("#pwDiv");
  var pwMsg = document.querySelector("#pwMsg");

  var elemToBlock = document.querySelector(".card");

  //initialActions
  getErrorCode();

  //Listeners
  logInButton.addEventListener("click", () => {
    resetEmail();
    resetPw();
    let validEmail = valdiateEmail(email);
    let validPW = valdiatePw(pw);

    if (validEmail && validPW) {
      sendLoginCredeintials(email.value, pw.value, elemToBlock);
    }
  });

  function valdiateEmail(email) {
    if (email.value === "") {
      emailDiv.classList.add("invalid-input");
      emailMsg.innerHTML = "El email es requerido";
      emailMsg.classList.add("text-danger");
      return false;
    }
    if (!isEmail(email.value)) {
      emailDiv.classList.add("invalid-input");
      emailMsg.innerHTML = "Ingrese un email válido";
      emailMsg.classList.add("text-danger");
      return false;
    }
    return true
  }

  function valdiatePw(pw) {
    if (pw.value === "") {
      pwDiv.classList.add("invalid-input");
      pwMsg.innerHTML = "La contraseña es requerida";
      pwMsg.classList.add("text-danger");
      return false;
    }

    return true
  }

  function resetEmail() {
    emailDiv.classList.remove("invalid-input");
    emailMsg.innerHTML = "";
    emailMsg.classList.remove("text-danger");
    console.log(emailDiv);
  }

  function resetPw() {
    pwDiv.classList.remove("invalid-input");
    pwMsg.innerHTML = "";
    pwMsg.classList.remove("text-danger");
    console.log(pwDiv);
  }

  async function sendLoginCredeintials(email, pw, elemToBlock) {
    let body = JSON.stringify({
      email: email,
      password: pw,
    });

    console.log(body);
    blockElem(elemToBlock);
    try {

      let request = await fetch("/login", {
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

      unblockElem(elemToBlock);

      if (json === undefined) {
        return;
      }

      if (json.error) {
        errorNotification(json.message);
      } else {
        successNotification(json.message);

        window.location = "/dashboard";
      }
    } catch (error) {
      errorNotification(error.toString());
      unblockElem(elemToBlock);
    }
  }

  function getErrorCode() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    switch (code) {
      case "401":
        errorNotification("No se pudo autorizar la petición.");
        break;
      case "403":
        errorNotification("No se pudo autenticar el usuario.");
        break;
      case "500":
        errorNotification("Ocurrió un error en el sitio.");
        break;
      default:
        break;
    }
  }
});
