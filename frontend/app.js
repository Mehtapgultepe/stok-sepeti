const API = 'http://localhost:3001/api/products';
let currentFilter = '';
let currentSort = '';

async function fetchProducts() {
  const params = new URLSearchParams();
  if (currentFilter) params.append('filter', currentFilter);
  if (currentSort) params.append('sortBy', currentSort);
  const res = await fetch(`${API}?${params}`);
  return res.json();
}

function renderStats(products) {
  const total = products.length;
  const kritik = products.filter(p => p.status === 'Kritik').length;
  const gecmis = products.filter(p => p.status === 'Tarihi Geçmiş').length;
  document.getElementById('stats').innerHTML = `
    <div class="stat-card"><div class="num">${total}</div><div class="label">Toplam Ürün</div></div>
    <div class="stat-card"><div class="num" style="color:#f4a261">${kritik}</div><div class="label">Kritik</div></div>
    <div class="stat-card"><div class="num" style="color:#e63946">${gecmis}</div><div class="label">Tarihi Geçmiş</div></div>
  `;
}

function renderProducts(products) {
  const list = document.getElementById('product-list');
  if (!products.length) { list.innerHTML = '<div class="empty">Ürün bulunamadı.</div>'; return; }
  list.innerHTML = products.map(p => {
    const cls = p.status === 'Tarihi Geçmiş' ? 'Tarihi' : p.status;
    const badgeCls = p.status === 'Tarihi Geçmiş' ? 'Tarihi' : p.status;
    const days = p.daysUntilExpiry < 0 ? `${Math.abs(p.daysUntilExpiry)} gün geçmiş` : `${p.daysUntilExpiry} gün kaldı`;
    return `
      <div class="product-card ${cls}">
        <div class="product-info">
          <h3>${p.name}</h3>
          <p>${p.quantity} ${p.unit} · ${p.category} · ${p.expiry_date} · ${days}</p>
        </div>
        <div class="product-meta">
          <span class="badge ${badgeCls}">${p.status}</span>
          <div class="product-actions">
            <button class="edit-btn" onclick="startEdit(${p.id})">Düzenle</button>
            <button class="delete-btn" onclick="deleteProduct(${p.id})">Sil</button>
          </div>
        </div>
      </div>`;
  }).join('');
}

async function loadProducts() {
  const products = await fetchProducts();
  renderStats(products);
  renderProducts(products);
}

document.getElementById('product-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('edit-id').value;
  const body = {
    name: document.getElementById('name').value.trim(),
    category: document.getElementById('category').value.trim(),
    quantity: parseFloat(document.getElementById('quantity').value),
    unit: document.getElementById('unit').value.trim(),
    expiry_date: document.getElementById('expiry_date').value,
  };
  if (id) {
    await fetch(`${API}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  } else {
    await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  }
  resetForm();
  loadProducts();
});

async function startEdit(id) {
  const res = await fetch(`${API}/${id}`);
  const p = await res.json();
  document.getElementById('edit-id').value = p.id;
  document.getElementById('name').value = p.name;
  document.getElementById('category').value = p.category;
  document.getElementById('quantity').value = p.quantity;
  document.getElementById('unit').value = p.unit;
  document.getElementById('expiry_date').value = p.expiry_date;
  document.getElementById('form-title').textContent = 'Ürünü Düzenle';
  document.getElementById('submit-btn').textContent = 'Güncelle';
  document.getElementById('cancel-btn').style.display = 'inline-block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteProduct(id) {
  if (!confirm('Ürün silinsin mi?')) return;
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  loadProducts();
}

function resetForm() {
  document.getElementById('product-form').reset();
  document.getElementById('edit-id').value = '';
  document.getElementById('form-title').textContent = 'Yeni Ürün Ekle';
  document.getElementById('submit-btn').textContent = 'Ekle';
  document.getElementById('cancel-btn').style.display = 'none';
}

document.getElementById('cancel-btn').addEventListener('click', resetForm);

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    loadProducts();
  });
});

document.getElementById('sort-select').addEventListener('change', (e) => {
  currentSort = e.target.value;
  loadProducts();
});

loadProducts();
