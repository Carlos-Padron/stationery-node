//DOM Elements
const yesterdaySales = document.querySelector("#yesterdaySales");
const todaySales = document.querySelector("#todaySales");
const productsTable = document.querySelector("#productsTable");

console.log(cashOuts);
console.log(products);

//Initial actions

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
