const phoneNumber = "+243990462408";
const baseUrl = window.location.origin;
let cart = [];

async function loadProducts() {
  const res = await fetch('products.json');
  const products = await res.json();
  renderProducts(products);
}

function renderProducts(products) {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';
  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-name', p.name);
    card.setAttribute('data-category', p.category);
    card.id = p.id;
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <div class="product-card-content">
        <h3>${p.name}</h3>
        <div class="actions">
          <button class="order-btn" data-product="${p.name}">Commander</button>
          <button class="add-cart-btn" onclick="addToCart('${p.name}', '${p.id}')">Ajouter au panier</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
  attachOrderButtons();
}

function attachOrderButtons() {
  document.querySelectorAll('.order-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.product;
      const id = name.toLowerCase().replace(/\s+/g, '-');
      const link = `${baseUrl}/#${id}`;
      const msg = `Bonjour, je suis intéressé par le produit : ${name}%0ALien : ${link}`;
      window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`, '_blank');
    });
  });
}

function filterProducts() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  document.querySelectorAll('.product-card').forEach(card => {
    const name = card.getAttribute('data-name').toLowerCase();
    card.style.display = name.includes(input) ? 'block' : 'none';
  });
}

function filterCategory(category) {
  document.querySelectorAll('.product-card').forEach(card => {
    card.style.display = (category === 'all' || card.getAttribute('data-category') === category) ? 'block' : 'none';
  });
}

function addToCart(productName, productId) {
  const productLink = `${baseUrl}/#${productId}`;
  cart.push({ name: productName, link: productLink });
  displayCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  displayCart();
}

function displayCart() {
  const cartItems = document.getElementById('cartItems');
  cartItems.innerHTML = '';
  cart.forEach((item, index) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = item.link;
    a.textContent = item.name;
    a.target = '_blank';
    const removeBtn = document.createElement('button');
    removeBtn.textContent = '❌';
    removeBtn.className = 'remove-btn';
    removeBtn.onclick = () => removeFromCart(index);
    li.appendChild(a);
    li.appendChild(removeBtn);
    cartItems.appendChild(li);
  });
}

function orderCart() {
  if (cart.length === 0) {
    alert('Votre panier est vide !');
    return;
  }
  const message = cart.map(item => `- ${item.name}\n${item.link}`).join("\n\n");
  const whatsappMessage = `Bonjour, je souhaite commander les produits suivants :\n\n${message}`;
  window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
});
