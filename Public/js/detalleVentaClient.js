window.addEventListener("DOMContentLoaded", () => {
  const routes = {
    delete: "/cancelSale",
    print: "/printSaleDetail",
  };

  const saleID = document.querySelector("#saleId").value;
  const mainTable = document.querySelectorAll(".mainTable");
  const cancelSaleBtn = document.querySelector("#cancelSaleBtn");
  const changeSaleBtn = document.querySelector("#changeSaleBtn");
  const printBtn = document.querySelector("#print");

  //Listeners
  cancelSaleBtn.addEventListener("click", cancelConfirmation);
  changeSaleBtn.addEventListener("click", editConfirmation);
  printBtn.addEventListener("click", printSaleReport);

  //Functions

  async function cancelSale(_id) {
    if (mainTable.length == 1) {
      blockElem(mainTable[0]);
    } else {
      blockElem(mainTable[0]);
      blockElem(mainTable[1]);
    }

    let body = JSON.stringify({ _id });

    try {
      let request = await fetch(`${routes.delete}`, {
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
          if (mainTable.length == 1) {
            unblockElem(mainTable[0]);
          } else {
            unblockElem(mainTable[0]);
            unblockElem(mainTable[1]);
          }
          modalAlert("warning", "Aviso", messages);
          return;
        } else {
          if (mainTable.length == 1) {
            unblockElem(mainTable[0]);
          } else {
            unblockElem(mainTable[0]);
            unblockElem(mainTable[1]);
          }

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
          window.location = `/ventas/historialVentas`;
        }
      );
    } catch (error) {
      errorNotification(error);
      if (mainTable.length == 1) {
        unblockElem(mainTable[0]);
      } else {
        unblockElem(mainTable[0]);
        unblockElem(mainTable[1]);
      }
      console.error(error);
    }
  }

  function cancelConfirmation() {
    confirmationAlert("¿Desea cancelar la venta?", () => {
      cancelSale(saleID);
    });
  }

  function editConfirmation() {
    confirmationAlert("¿Desea editar la venta?", () => {
      window.location = `/ventas/cambio-devolucion/${saleID}`;
    });
  }

  async function printSaleReport(e) {
    let body = JSON.stringify({ _id: saleID });
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
