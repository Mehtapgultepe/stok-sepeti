const express = require('express');
const router = express.Router();
const service = require('../services/productService');
const authenticate = require('../middleware/auth');

router.use(authenticate);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Tüm ürünleri listele
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum: [critical]
 *     responses:
 *       200:
 *         description: Urun listesi
 */
router.get('/', (req, res) => {
  try {
    const products = service.getAllProducts(req.user.id, req.query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: ID ile urun getir
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Urun bulundu
 *       404:
 *         description: Urun bulunamadi
 */
router.get('/:id', (req, res) => {
  try {
    const product = service.getProductById(Number(req.params.id), req.user.id);
    if (!product) return res.status(404).json({ error: 'Urun bulunamadi' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Yeni urun ekle
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, category, quantity, unit, expiry_date]
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               quantity:
 *                 type: number
 *               unit:
 *                 type: string
 *               expiry_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Urun olusturuldu
 *       400:
 *         description: Gecersiz istek
 */
router.post('/', (req, res) => {
  try {
    const product = service.createProduct(req.user.id, req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Urun guncelle
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               quantity:
 *                 type: number
 *               unit:
 *                 type: string
 *               expiry_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Urun guncellendi
 *       404:
 *         description: Urun bulunamadi
 */
router.put('/:id', (req, res) => {
  try {
    const product = service.updateProduct(Number(req.params.id), req.user.id, req.body);
    if (!product) return res.status(404).json({ error: 'Urun bulunamadi' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Urun sil
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Urun silindi
 *       404:
 *         description: Urun bulunamadi
 */
router.delete('/:id', (req, res) => {
  try {
    const deleted = service.deleteProduct(Number(req.params.id), req.user.id);
    if (!deleted) return res.status(404).json({ error: 'Urun bulunamadi' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
