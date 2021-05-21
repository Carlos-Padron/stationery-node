document.addEventListener("DOMContentLoaded", () => {
  //Elements
  var sendBtn = document.querySelector("#sendBtn");

  var pw = document.querySelector("#pw");
  var pwDiv = document.querySelector("#pwDiv");
  var pwMsg = document.querySelector("#pwMsg");

  var elemToBlock = document.querySelector(".card");

  //Listeners
  sendBtn.addEventListener("click", (e) => {
    e.preventDefault();
    resetPWProcess();
  });

  pw.addEventListener("keydown", (e) => {
    if (e.keyCode == 13) {
      e.preventDefault();
      resetPWProcess();
    }
  });

  function resetPWProcess() {
    resetPW();
    let validPW = valdiatePW(pw);

    if (validPW) {
      sendPW(pw.value, elemToBlock);
    }
  }

  function valdiatePW(pw) {
    if (pw.value === "") {
      pwDiv.classList.add("invalid-input");
      pwMsg.innerHTML = "La contraseña es requerida";
      pwMsg.classList.add("text-danger");
      return false;
    }

    return true;
  }

  function resetPW() {
    pwDiv.classList.remove("invalid-input");
    pwMsg.innerHTML = "";
    pwMsg.classList.remove("text-danger");
  }

  async function sendPW(pw, elemToBlock) {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    let body = JSON.stringify({
      pw: pw,
      token,
    });

    console.log(body);
    blockElem(elemToBlock);
    try {
      let request = await fetch("/changePassword", {
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
        if (json.error) {
          if (Array.isArray(json.message)) {
            let messages = "";
            json.message.forEach((msg) => {
              messages += `<strong>*${msg}</strong> <br>`;
            });

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
      } else {
        console.log(json);
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
