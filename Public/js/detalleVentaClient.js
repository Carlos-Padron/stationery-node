window.addEventListener("DOMContentLoaded", () => {
  const routes = {
    delete: "/cancelSale",
  };

  const saleID = document.querySelector("#saleId").value;
  const mainTable = document.querySelector("#mainTable");
  const cancelSaleBtn = document.querySelector("#cancelSaleBtn");
  const changeSaleBtn = document.querySelector("#changeSaleBtn");

  //Listeners
  cancelSaleBtn.addEventListener("click", cancelConfirmation);
  changeSaleBtn.addEventListener("click", editConfirmation);

  //Functions

  async function cancelSale(_id) {
    blockElem(mainTable);
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
          unblockElem(mainTable);
          modalAlert("warning", "Aviso", messages);
          return;
        } else {
          unblockElem(mainTable);

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
      unblockElem(mainTable);
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
});
