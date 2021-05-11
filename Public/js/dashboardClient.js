//DOM Elements
const yesterdaySales = document.querySelector("#yesterdaySales");
const yesterdaySalesLabel = document.querySelector("#yesterdaySalesLabel");
const todaySales = document.querySelector("#todaySales");
const productsTable = document.querySelector("#productsTable");

function populateTable() {
  if (products.length == 0) {
    productsTable.innerHTML = `<tr>
          <td class="text-center w-100">
              Actualmente no cuentas con ningún <br>producto bajo en el inventario ☺️
          </td>
      </tr>`;
  } else {
    let tableBody = "";

    products.forEach((prod) => {
      tableBody += `
              <tr>
                  <td class="text-center" style="white-space:normal">
                      ${prod.name}
                  </td>
                  <td class="text-center" style="white-space:normal">
                      ${prod.brand}
                  </td>
                  <td class="text-center" style="white-space:normal">
                      ${prod.quantity}
                  </td>
              </tr>`;
    });
    productsTable.innerHTML = tableBody;
  }
}

function fillStatCards() {
  fillYestardaySaleStatCard();
  fillTodaySaleStatCard();
}

function fillYestardaySaleStatCard() {
  if (cashOuts.length == 0) {
    yesterdaySales.innerHTML = "-";
  } else {
    let cashOut = cashOuts[cashOuts.length - 1];

    let date = cashOut.date.split("T")[0];

    let year = date.substring(0, 4);
    let month = date.substring(5, 7);
    let day = date.substring(8, 10);
    yesterdaySalesLabel.innerHTML = `Ventas del
              día anterior (${day}/${month}/${year})`;
    yesterdaySales.innerHTML = `$${cashOut.totalSales.toFixed(2)}`;
  }
}

function fillTodaySaleStatCard() {
  todaySales.innerHTML = `$${parseFloat(todaySalesBackEnd).toFixed(2)}`;
}

function createChart() {
  let labels = [];
  let dataArray = [];

  cashOuts.forEach((cashOut) => {
    let date = cashOut.date.split("T")[0];

    let year = date.substring(0, 4);
    let month = date.substring(5, 7);
    let day = date.substring(8, 10);

    labels.push(`${day}/${month}/${year}`);
    dataArray.push(cashOut.totalSales);
  });

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Corte de caja",
        borderColor: "rgb(94, 114, 228)",
        data: dataArray,
        fill: false,
      },
    ],
  };

  const config = {
    type: "line",
    data,
    options: {},
  };

  const chart = new Chart(
    document.getElementById("chart-cashout-dark"),
    config
  );
}

function main() {
  populateTable();
  fillStatCards();
  createChart();
}

//Initial actions
main();
