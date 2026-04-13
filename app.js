let cart = [];
let products = JSON.parse(localStorage.getItem("products") || "{}");

let scanner = null;
let scanning = false;
let scannedCode = null;

function initScanner() {
  if (!scanner) scanner = new Html5Qrcode("scanner");
}

async function toggleScan() {
  if (scanning) stopScan();
  else startScan();
}

async function startScan() {
  document.getElementById("scanner").style.display = "block";

  initScanner();

  try {
    await scanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      (code) => {
        stopScan();
        handleScan(code);
      }
    );
    scanning = true;
  } catch (e) {
    alert("Camera error");
    console.error(e);
  }
}

async function stopScan() {
  try { await scanner.stop(); } catch {}
  try { await scanner.clear(); } catch {}
  document.getElementById("scanner").style.display = "none";
  scanning = false;
}

function handleScan(code) {
  if (products[code]) addToCart(products[code]);
  else {
    scannedCode = code;
    document.getElementById("modal").style.display = "block";
  }
}

function saveNewProduct() {
  const name = mname.value;
  const price = Number(mprice.value);
  const category = mcat.value;

  if (!name || isNaN(price)) return alert("Invalid");

  const p = { code: scannedCode, name, price, category };

  products[scannedCode] = p;
  localStorage.setItem("products", JSON.stringify(products));

  modal.style.display = "none";
  addToCart(p);
}

function addToCart(p) {
  cart.push(p);
  render();
}

function render() {
  cartDiv.innerHTML = "";
  let total = 0;

  cart.forEach(i => {
    total += i.price;
    cartDiv.innerHTML += `<div>${i.name} - ₹${i.price}</div>`;
  });

  totalDiv.innerText = "Total: ₹" + total.toFixed(2);
}

function importCSV(e) {
  const r = new FileReader();

  r.onload = () => {
    r.result.split(/\r?\n/).slice(1).forEach(l => {
      const [c,n,p] = l.split(',');
      if (c && n && p) {
        products[c] = { code:c, name:n, price:Number(p) };
      }
    });

    localStorage.setItem("products", JSON.stringify(products));
    alert("Imported!");
  };

  r.readAsText(e.target.files[0]);
}

function reviewOrder() {
  localStorage.setItem("cart", JSON.stringify(cart));
  location.href = "review.html";
}

function resetApp() {
  if (confirm("Clear cart?")) {
    cart = [];
    render();
  }
}

const cartDiv = document.getElementById("cart");
const totalDiv = document.getElementById("total");
const modal = document.getElementById("modal");

render();