window.addEventListener("DOMContentLoaded", () => {
  const routes = {
    print: "/printQuoteDetail",
  };

  const quoteID = document.querySelector("#quoteId").value;
  const changeQuoteBtn = document.querySelector("#changeQuoteBtn");
  const printBtn = document.querySelector("#print");
  const mainTable = document.querySelectorAll(".mainTable");

  //Listeners
  changeQuoteBtn.addEventListener("click", editConfirmation);
  printBtn.addEventListener("click", printQuoteReport);

  //Functions

  function editConfirmation() {
    confirmationAlert("¿Desea editar la cotización?", () => {
      window.location = `/cotizaciones/editar/${quoteID}`;
    });
  }
  async function printQuoteReport(e) {
    let body = JSON.stringify({ _id: quoteID });
    if (mainTable.length == 1) {
      blockElem(mainTable[0]);
    } else {
      blockElem(mainTable[0]);
      blockElem(mainTable[1]);
    }

    try {
      let request = await fetch(routes.print, {
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
          if (mainTable.length == 1) {
            unblockElem(mainTable[0]);
          } else {
            unblockElem(mainTable[0]);
            unblockElem(mainTable[1]);
          }
          return;
        } else {
          modalAlert(
            "warning",
            "Aviso",
            `<strong>*${json.message}</strong> <br>`
          );
          if (mainTable.length == 1) {
            unblockElem(mainTable[0]);
          } else {
            unblockElem(mainTable[0]);
            unblockElem(mainTable[1]);
          }
          return;
        }
      }

      let byteArray = new Uint8Array(
        atob(json.response)
          .split("")
          .map((char) => char.charCodeAt(0))
      );
      let blob = new Blob([byteArray], { type: "application/pdf" });

      const url = window.URL.createObjectURL(blob);

      window.open(url, "_blank");

      if (mainTable.length == 1) {
        unblockElem(mainTable[0]);
      } else {
        unblockElem(mainTable[0]);
        unblockElem(mainTable[1]);
      }
    } catch (error) {
      if (mainTable.length == 1) {
        unblockElem(mainTable[0]);
      } else {
        unblockElem(mainTable[0]);
        unblockElem(mainTable[1]);
      }
      errorNotification("Error interno del servidor");
      console.error(error);
    }
  }
});
