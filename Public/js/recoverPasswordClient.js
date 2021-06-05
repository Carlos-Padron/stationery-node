document.addEventListener("DOMContentLoaded", () => {
  //Elements
  var sendBtn = document.querySelector("#sendBtn");

  var email = document.querySelector("#email");
  var emailDiv = document.querySelector("#emailDiv");
  var emailMsg = document.querySelector("#emailMsg");

  var elemToBlock = document.querySelector(".card");

  //Listeners
  sendBtn.addEventListener("click", (e) => {
    e.preventDefault();
    resetPWProcess();
  });

  email.addEventListener("keydown", (e) => {
    if (e.keyCode == 13) {
      e.preventDefault();
      resetPWProcess();
    }
  });

  function resetPWProcess() {
    resetEmail();
    let validEmail = valdiateEmail(email);

    if (validEmail) {
      sendPWEmail(email.value, elemToBlock);
    }
  }

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
    return true;
  }

  function resetEmail() {
    emailDiv.classList.remove("invalid-input");
    emailMsg.innerHTML = "";
    emailMsg.classList.remove("text-danger");
  }

  async function sendPWEmail(email, elemToBlock) {
    let body = JSON.stringify({
      email: email,
    });

    console.log(body);
    blockElem(elemToBlock);
    try {
      let request = await fetch("/resetPassword", {
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
        modalAlert("warning", "Aviso", `<b>${json.message}</b>`);
      } else {
        modalAlert("success", "Aviso", `<b>${json.message}</b>`, () => {
          window.location = "/login";
        });
      }
    } catch (error) {
      errorNotification(error.toString());
      unblockElem(elemToBlock);
    }
  }
});
