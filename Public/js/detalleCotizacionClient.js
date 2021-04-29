window.addEventListener("DOMContentLoaded", () => {
  const quoteID = document.querySelector("#quoteId").value;
  const changeQuoteBtn = document.querySelector("#changeQuoteBtn");

  //Listeners
  changeQuoteBtn.addEventListener("click", editConfirmation);

  //Functions

  function editConfirmation() {
    confirmationAlert("¿Desea editar la cotización?", () => {
      window.location = `/cotizaciones/editar/${quoteID}`;
    });
  }
});
