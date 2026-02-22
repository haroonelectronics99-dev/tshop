import express from 'express';
import db from '../db/index.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'mm-tailor-secret-key-change-me';

// Middleware to check authentication
const isAuthenticated = (req: any, res: any, next: any) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Create Order
router.post('/', isAuthenticated, (req: any, res) => {
  const { items, total_price } = req.body; // items: [{ product_id, quantity, customization_details }]
  const userId = req.user.id;

  const insertOrder = db.prepare('INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)');
  const insertItem = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase, customization_details) VALUES (?, ?, ?, ?, ?)');

  const transaction = db.transaction(() => {
    const result = insertOrder.run(userId, total_price, 'Pending');
    const orderId = result.lastInsertRowid;

    for (const item of items) {
      // Get current price to lock it in
      const product = db.prepare('SELECT price FROM products WHERE id = ?').get(item.product_id) as any;
      if (!product) throw new Error(`Product ${item.product_id} not found`);

      insertItem.run(
        orderId,
        item.product_id,
        item.quantity,
        product.price,
        JSON.stringify(item.customization_details || {})
      );
    }
    return orderId;
  });

  try {
    const orderId = transaction();
    res.status(201).json({ orderId, message: 'Order placed successfully' });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

// Get My Orders (Customer)
router.get('/my-orders', isAuthenticated, (req: any, res) => {
  try {
    const orders = db.prepare(`
      SELECT o.*, 
             json_group_array(
               json_object(
                 'product_name', p.name,
                 'quantity', oi.quantity,
                 'price', oi.price_at_purchase,
                 'customization', oi.customization_details
               )
             ) as items
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `).all(req.user.id);

    const parsedOrders = orders.map((o: any) => ({
      ...o,
      items: JSON.parse(o.items)
    }));

    res.json(parsedOrders);
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get All Orders (Admin)
router.get('/admin/all', isAuthenticated, (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

  try {
    const orders = db.prepare(`
      SELECT o.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone,
             json_group_array(
               json_object(
                 'product_name', p.name,
                 'quantity', oi.quantity,
                 'price', oi.price_at_purchase,
                 'customization', oi.customization_details
               )
             ) as items
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `).all();

    const parsedOrders = orders.map((o: any) => ({
      ...o,
      items: JSON.parse(o.items)
    }));

    res.json(parsedOrders);
  } catch (error) {
    console.error('Fetch all orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Order Status (Admin)
router.put('/:id/status', isAuthenticated, (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  
  const { status } = req.body;
  const { id } = req.params;

  try {
    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
    res.json({ message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
