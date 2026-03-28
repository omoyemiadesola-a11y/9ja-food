const menuData = [
  { id: 1, category: 'African', type: 'rice', name: 'Jollof Rice & Chicken', description: 'Smoky party jollof with grilled pepper chicken.', price: 12.5, popular: true, image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=1200&q=80' },
  { id: 2, category: 'African', type: 'soup', name: 'Egusi & Pounded Yam', description: 'Rich melon seed soup with assorted protein.', price: 14.0, popular: true, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80' },
  { id: 3, category: 'Chinese', type: 'noodles', name: 'Chicken Chow Mein', description: 'Wok tossed noodles with vegetables and sauce.', price: 11.0, popular: false, image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=1200&q=80' },
  { id: 4, category: 'Chinese', type: 'rice', name: 'Special Fried Rice', description: 'Egg fried rice with shrimp, beef and chicken.', price: 13.0, popular: true, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1200&q=80' },
  { id: 5, category: 'Fast Food', type: 'chicken', name: 'Crispy Chicken Bucket', description: 'Golden fried chicken with our spicy dip.', price: 15.0, popular: true, image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=1200&q=80' },
  { id: 6, category: 'Fast Food', type: 'snacks', name: 'Beef Burger Combo', description: 'Juicy burger served with fries and drink.', price: 10.5, popular: false, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80' },
  { id: 7, category: 'Pizza', type: 'pizza', name: 'Pepperoni Fiesta', description: 'Stone baked pizza with loaded pepperoni.', price: 16.0, popular: true, image: 'https://images.unsplash.com/photo-1548365328-9f547fb0953f?auto=format&fit=crop&w=1200&q=80' },
  { id: 8, category: 'Pizza', type: 'pizza', name: 'Veggie Delight', description: 'Tomato base, peppers, olives and sweet corn.', price: 14.5, popular: false, image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=1200&q=80' },
  { id: 9, category: 'Bakery', type: 'snacks', name: 'Meat Pie Trio', description: 'Flaky golden pies with savory minced filling.', price: 8.5, popular: true, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80' },
  { id: 10, category: 'Bakery', type: 'bread', name: 'Fresh Banana Bread', description: 'Moist banana loaf with warm cinnamon notes.', price: 6.5, popular: false, image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=1200&q=80' },
  { id: 11, category: 'Breakfast', type: 'breakfast', name: 'Pancake Morning Stack', description: 'Buttermilk pancakes with syrup and berries.', price: 9.5, popular: true, image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80' },
  { id: 12, category: 'Breakfast', type: 'breakfast', name: 'English Breakfast', description: 'Eggs, sausages, beans and toasted bread.', price: 11.5, popular: false, image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1200&q=80' }
];

const featuredCategories = [
  ['African Meals', 'Traditional favorites and home-style classics.', 'African', 'https://images.unsplash.com/photo-1604908554027-91e10f5a5d15?auto=format&fit=crop&w=1200&q=80'],
  ['Chinese Dishes', 'Wok-fresh noodles, rice, and tasty sauces.', 'Chinese', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80'],
  ['Fast Food', 'Quick, crispy, and satisfying comfort bites.', 'Fast Food', 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?auto=format&fit=crop&w=1200&q=80'],
  ['Pizza', 'Cheesy stone-baked pies for every craving.', 'Pizza', 'https://images.unsplash.com/photo-1601924638867-3ec2b48bdbbb?auto=format&fit=crop&w=1200&q=80'],
  ['Bakery', 'Fresh breads, pies, and sweet baked treats.', 'Bakery', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80'],
  ['Breakfast', 'Start your day with warm, hearty options.', 'Breakfast', 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=1200&q=80']
];

const locations = [
  { name: 'Mega Chicken Ikeja', address: '22 Allen Avenue, Ikeja, Lagos', hours: 'Daily • 8:00am - 11:00pm', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Mega Chicken Lekki', address: '4 Admiralty Way, Lekki Phase 1, Lagos', hours: 'Daily • 8:00am - 11:30pm', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Mega Chicken Surulere', address: '15 Bode Thomas Street, Surulere, Lagos', hours: 'Daily • 9:00am - 10:30pm', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80' }
];

function getCart() {
  return JSON.parse(localStorage.getItem('demo-cart') || '[]');
}

function setCart(cart) {
  localStorage.setItem('demo-cart', JSON.stringify(cart));
}

function addToCart(itemId) {
  const cart = getCart();
  const found = cart.find((i) => i.id === itemId);
  if (found) {
    found.qty += 1;
  } else {
    const item = menuData.find((m) => m.id === itemId);
    cart.push({ id: itemId, name: item.name, price: item.price, qty: 1 });
  }
  setCart(cart);
  showToast('Added to cart');
}

function updateQty(itemId, delta) {
  const cart = getCart().map((item) => item.id === itemId ? { ...item, qty: item.qty + delta } : item).filter((i) => i.qty > 0);
  setCart(cart);
  renderCart();
}

function showToast(text) {
  const toast = document.createElement('div');
  toast.textContent = text;
  Object.assign(toast.style, {
    position: 'fixed', bottom: '95px', right: '16px', background: '#1f8b4c', color: '#fff', padding: '10px 14px', borderRadius: '999px', fontWeight: '700', zIndex: '999', boxShadow: '0 8px 20px rgba(0,0,0,.16)'
  });
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 1200);
}

function menuCard(item) {
  return `
    <article class="card fade-in">
      <img src="${item.image}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p class="small">${item.description}</p>
      <div class="inline-space">
        <span class="price">$${item.price.toFixed(2)}</span>
        <button class="btn btn-primary" data-add="${item.id}">Add to Cart</button>
      </div>
    </article>
  `;
}

function bindAddButtons(scope = document) {
  scope.querySelectorAll('[data-add]').forEach((btn) => {
    btn.addEventListener('click', () => addToCart(Number(btn.dataset.add)));
  });
}

function renderHome() {
  const categoryContainer = document.getElementById('categories');
  const featured = document.getElementById('featured-meals');
  const locationContainer = document.getElementById('location-preview');

  if (categoryContainer) {
    categoryContainer.innerHTML = featuredCategories.map(([title, text, filter, image]) => `
      <a href="menu.html?category=${encodeURIComponent(filter)}" class="card fade-in">
        <img src="${image}" alt="${title}">
        <h3>${title}</h3>
        <p class="small">${text}</p>
      </a>
    `).join('');
  }

  if (featured) {
    featured.innerHTML = menuData.filter((item) => item.popular).slice(0, 8).map(menuCard).join('');
    bindAddButtons(featured);
  }

  if (locationContainer) {
    locationContainer.innerHTML = locations.map((branch) => `
      <article class="card fade-in">
        <img src="${branch.image}" alt="${branch.name}">
        <h3>${branch.name}</h3>
        <p>${branch.address}</p>
        <button class="btn btn-secondary" style="margin-top:.7rem">View Details</button>
      </article>
    `).join('');
  }
}

function renderMenu() {
  const grid = document.getElementById('menu-grid');
  if (!grid) return;

  const params = new URLSearchParams(window.location.search);
  let activeCategory = params.get('category') || 'All';
  let search = '';
  let activeType = 'all';
  let popularOnly = false;

  const tabs = document.querySelectorAll('.tab');
  const filterChips = document.querySelectorAll('.filter-chip');
  const searchInput = document.getElementById('menu-search');

  const repaint = () => {
    const list = menuData.filter((item) => {
      const passCategory = activeCategory === 'All' || item.category === activeCategory;
      const passSearch = item.name.toLowerCase().includes(search) || item.description.toLowerCase().includes(search);
      const passType = activeType === 'all' || item.type === activeType;
      const passPopular = !popularOnly || item.popular;
      return passCategory && passSearch && passType && passPopular;
    });

    grid.innerHTML = list.length ? list.map(menuCard).join('') : '<p>No meals found for this filter.</p>';
    bindAddButtons(grid);

    tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.category === activeCategory));
    filterChips.forEach((chip) => {
      const isActive = chip.dataset.filter === activeType || (chip.dataset.filter === 'popular' && popularOnly);
      chip.classList.toggle('active', isActive);
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      activeCategory = tab.dataset.category;
      repaint();
    });
  });

  filterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      if (chip.dataset.filter === 'popular') {
        popularOnly = !popularOnly;
      } else {
        activeType = chip.dataset.filter;
      }
      repaint();
    });
  });

  searchInput?.addEventListener('input', (event) => {
    search = event.target.value.toLowerCase().trim();
    repaint();
  });

  repaint();
}

function renderCart() {
  const cartList = document.getElementById('cart-list');
  const totalEl = document.getElementById('cart-total');
  if (!cartList || !totalEl) return;

  const cart = getCart();
  if (!cart.length) {
    cartList.innerHTML = '<p class="small">Your demo cart is empty. Add meals from the menu.</p>';
    totalEl.textContent = '$0.00';
    return;
  }

  cartList.innerHTML = cart.map((item) => `
    <article class="cart-item fade-in">
      <div>
        <h3>${item.name}</h3>
        <p class="small">$${item.price.toFixed(2)} each</p>
      </div>
      <div>
        <div class="qty-controls">
          <button class="qty-btn" data-qty="${item.id}" data-delta="-1">−</button>
          <strong>${item.qty}</strong>
          <button class="qty-btn" data-qty="${item.id}" data-delta="1">+</button>
        </div>
      </div>
    </article>
  `).join('');

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  totalEl.textContent = `$${total.toFixed(2)}`;

  cartList.querySelectorAll('[data-qty]').forEach((btn) => {
    btn.addEventListener('click', () => updateQty(Number(btn.dataset.qty), Number(btn.dataset.delta)));
  });
}

function renderLocations() {
  const container = document.getElementById('locations-list');
  if (!container) return;
  container.innerHTML = locations.map((branch) => `
    <article class="card fade-in">
      <img src="${branch.image}" alt="${branch.name}">
      <h3>${branch.name}</h3>
      <p>${branch.address}</p>
      <p class="small"><strong>Hours:</strong> ${branch.hours}</p>
      <div class="hero-actions">
        <button class="btn btn-secondary">Call</button>
        <button class="btn btn-ghost">Get Directions</button>
        <button class="btn btn-primary">Order from this branch</button>
      </div>
    </article>
  `).join('');
}

function setupDemoForms() {
  document.querySelectorAll('[data-demo-submit]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      showToast('Demo only: submission captured');
      form.reset();
    });
  });
}

function setActiveLinks() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll(`[data-link="${page}"]`).forEach((link) => link.classList.add('active'));
}

document.addEventListener('DOMContentLoaded', () => {
  setActiveLinks();
  renderHome();
  renderMenu();
  renderCart();
  renderLocations();
  setupDemoForms();
});
