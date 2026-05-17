const express = require('express');
const router = express.Router();
const service = require('../services/productService');

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         category:
 *           type: string
 *         quantity:
 *           type: number
 *         unit:
 *           type: string
 *         expiry_date:
 *           type: string
 *           format: date
 *         daysUntilExpiry:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [Taze, Kritik, Tarihi Geçmiş]
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Tüm ürünleri listele
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
 *         description: Ürün listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/', (req, res) => {
  try {
    const { sortBy, filter } = req.query;
    const products = service.getAllProducts({ sortBy, filter });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: ID ile ürün getir
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ürün bulundu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Ürün bulunamadı
 */
router.get('/:id', (req, res) => {
  try {
    const product = service.getProductById(Number(req.params.id));
    if (!product) return res.status(404).json({ error: 'Ürün bulunamadı' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Yeni ürün ekle
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
 *         description: Ürün oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Geçersiz istek
 */
router.post('/', (req, res) => {
  try {
    const product = service.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Ürün güncelle
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
 *         description: Ürün güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Ürün bulunamadı
 */
router.put('/:id', (req, res) => {
  try {
    const product = service.updateProduct(Number(req.params.id), req.body);
    if (!product) return res.status(404).json({ error: 'Ürün bulunamadı' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Ürün sil
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Ürün silindi
 *       404:
 *         description: Ürün bulunamadı
 */
router.delete('/:id', (req, res) => {
  try {
    const deleted = service.deleteProduct(Number(req.params.id));
    if (!deleted) return res.status(404).json({ error: 'Ürün bulunamadı' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
