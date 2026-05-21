const db = require('../db');

function getDaysUntilExpiry(expiryDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate + 'T00:00:00');
  expiry.setHours(0, 0, 0, 0);
  return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
}

function getStatus(expiryDate) {
  const days = getDaysUntilExpiry(expiryDate);
  if (days < 0) return 'Tarihi Geçmiş';
  if (days <= 3) return 'Kritik';
  return 'Taze';
}

function enrich(p) {
  return { ...p, daysUntilExpiry: getDaysUntilExpiry(p.expiry_date), status: getStatus(p.expiry_date) };
}

function getAllProducts(userId, { sortBy, filter } = {}) {
  let products = db.prepare('SELECT * FROM products WHERE user_id = ?').all(userId).map(enrich);
  if (filter === 'critical') products = products.filter(p => p.status === 'Kritik' || p.status === 'Tarihi Geçmiş');
  if (sortBy === 'asc') products.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
  if (sortBy === 'desc') products.sort((a, b) => b.daysUntilExpiry - a.daysUntilExpiry);
  return products;
}

function getProductById(id, userId) {
  const p = db.prepare('SELECT * FROM products WHERE id = ? AND user_id = ?').get(id, userId);
  return p ? enrich(p) : null;
}

function createProduct(userId, { name, category, quantity, unit, expiry_date }) {
  if (!name || !category || !quantity || !unit || !expiry_date) throw new Error('Tüm alanlar zorunludur');
  if (isNaN(Date.parse(expiry_date))) throw new Error('Geçersiz tarih formatı');
  if (quantity <= 0) throw new Error('Miktar sıfırdan büyük olmalıdır');
  const result = db.prepare('INSERT INTO products (user_id, name, category, quantity, unit, expiry_date) VALUES (?, ?, ?, ?, ?, ?)').run(userId, name, category, quantity, unit, expiry_date);
  return getProductById(result.lastInsertRowid, userId);
}

function updateProduct(id, userId, { name, category, quantity, unit, expiry_date }) {
  const existing = getProductById(id, userId);
  if (!existing) return null;
  if (quantity !== undefined && quantity <= 0) throw new Error('Miktar sıfırdan büyük olmalıdır');
  if (expiry_date && isNaN(Date.parse(expiry_date))) throw new Error('Geçersiz tarih formatı');
  const updated = {
    name: name ?? existing.name,
    category: category ?? existing.category,
    quantity: quantity ?? existing.quantity,
    unit: unit ?? existing.unit,
    expiry_date: expiry_date ?? existing.expiry_date
  };
  db.prepare('UPDATE products SET name=?, category=?, quantity=?, unit=?, expiry_date=? WHERE id=? AND user_id=?').run(updated.name, updated.category, updated.quantity, updated.unit, updated.expiry_date, id, userId);
  return getProductById(id, userId);
}

function deleteProduct(id, userId) {
  const existing = getProductById(id, userId);
  if (!existing) return false;
  db.prepare('DELETE FROM products WHERE id = ? AND user_id = ?').run(id, userId);
  return true;
}

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, getDaysUntilExpiry, getStatus };
