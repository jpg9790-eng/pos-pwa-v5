const cart = JSON.parse(localStorage.getItem("cart") || "[]");

const GST_RATES = {
  food: 5,
  electronics: 18,
  other: 12
};

let subtotal = 0;
let gstTotal = 0;

let html = "<h3>Receipt</h3>";

cart.forEach(item => {
  const gstRate = GST_RATES[item.category] || 12;
  const base = item.price / (1 + gstRate / 100);
  const gst = item.price - base;

  subtotal += base;
  gstTotal += gst;

  html += `
    <div class="row">
      <span>${item.name}</span>
      <span>₹${item.price.toFixed(2)}</span>
    </div>
  `;
});

const total = subtotal + gstTotal;

html += `
  <hr>
  <div class="row"><span>Subtotal</span><span>₹${subtotal.toFixed(2)}</span></div>
  <div class="row"><span>GST</span><span>₹${gstTotal.toFixed(2)}</span></div>
  <div class="row total"><span>Total</span><span>₹${total.toFixed(2)}</span></div>
`;

document.getElementById("bill").innerHTML = html;

/* PRINT */
function printBill() {
  window.print();
}

/* DOWNLOAD */
function downloadBill() {
  const text = document.getElementById("bill").innerText;

  const blob = new Blob([text], { type: "text/plain" });
  const a = document.createElement("a");

  a.href = URL.createObjectURL(blob);
  a.download = "receipt.txt";
  a.click();
}