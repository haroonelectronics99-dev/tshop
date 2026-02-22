import express from 'express';
import db from '../db/index.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'mm-tailor-secret-key-change-me';

// Middleware to check if admin
const isAdmin = (req: any, res: any, next: any) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all products
router.get('/', (req, res) => {
  const { category } = req.query;
  let query = 'SELECT * FROM products';
  const params = [];

  if (category && category !== 'All') {
    query += ' WHERE category = ?';
    params.push(category);
  }

  query += ' ORDER BY created_at DESC';

  try {
    const products = db.prepare(query).all(...params);
    // Parse images JSON
    const parsedProducts = products.map((p: any) => ({
      ...p,
      images: JSON.parse(p.images || '[]')
    }));
    res.json(parsedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single product
router.get('/:id', (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id) as any;
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    product.images = JSON.parse(product.images || '[]');
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product (Admin only)
router.post('/', isAdmin, (req, res) => {
  const { name, description, price, category, images, estimated_days } = req.body;

  try {
    const result = db.prepare(
      'INSERT INTO products (name, description, price, category, images, estimated_days) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(name, description, price, category, JSON.stringify(images), estimated_days);

    res.status(201).json({ id: result.lastInsertRowid, message: 'Product created' });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product (Admin only)
router.put('/:id', isAdmin, (req, res) => {
  const { name, description, price, category, images, estimated_days } = req.body;
  const { id } = req.params;

  try {
    db.prepare(
      'UPDATE products SET name = ?, description = ?, price = ?, category = ?, images = ?, estimated_days = ? WHERE id = ?'
    ).run(name, description, price, category, JSON.stringify(images), estimated_days, id);

    res.json({ message: 'Product updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product (Admin only)
router.delete('/:id', isAdmin, (req, res) => {
  try {
    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
