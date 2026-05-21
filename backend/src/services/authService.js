const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const SECRET = process.env.JWT_SECRET || 'stoksepeti_secret';

function register(username, password) {
  if (!username || !password) throw new Error('Kullanıcı adı ve şifre zorunludur');
  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (existing) throw new Error('Bu kullanıcı adı zaten alınmış');
  const hashed = bcrypt.hashSync(password, 10);
  const result = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, hashed);
  return { id: result.lastInsertRowid, username };
}

function login(username, password) {
  if (!username || !password) throw new Error('Kullanıcı adı ve şifre zorunludur');
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user) throw new Error('Kullanıcı bulunamadı');
  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) throw new Error('Hatalı şifre');
  const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '24h' });
  return { token, username: user.username };
}

function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

module.exports = { register, login, verifyToken };
