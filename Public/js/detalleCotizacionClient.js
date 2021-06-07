window.addEventListener("DOMContentLoaded", () => {
  const routes = {
    print: "/printQuoteDetail",
  };

  const quoteID = document.querySelector("#quoteId").value;
  const changeQuoteBtn = document.querySelector("#changeQuoteBtn");
  const printBtn = document.querySelector("#print");
  const mainTable = document.querySelector(".mainTable");

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

    blockElem(mainTable);

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
          unblockElem(mainTable);

          return;
        } else {
          modalAlert(
            "warning",
            "Aviso",
            `<strong>*${json.message}</strong> <br>`
          );
          unblockElem(mainTable);

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

      unblockElem(mainTable);

    } catch (error) {
      unblockElem(mainTable);

      errorNotification("Error interno del servidor");
      console.error(error);
    }
  }
});
