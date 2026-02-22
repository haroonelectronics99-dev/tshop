import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const dbPath = path.join(process.cwd(), 'mm_tailor.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

export function initDb() {
  const schema = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT CHECK(role IN ('admin', 'customer')) NOT NULL DEFAULT 'customer',
      phone TEXT,
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      images TEXT NOT NULL, -- JSON array of image URLs
      estimated_days INTEGER DEFAULT 7,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      status TEXT CHECK(status IN ('Pending', 'In Progress', 'Ready', 'Delivered', 'Cancelled')) NOT NULL DEFAULT 'Pending',
      total_price REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      delivery_date DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      price_at_purchase REAL NOT NULL,
      customization_details TEXT, -- JSON object with measurements, notes
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS measurements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      profile_name TEXT NOT NULL,
      values_json TEXT NOT NULL, -- JSON object with specific measurements
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `;

  db.exec(schema);

  // Seed admin user if not exists
  const adminExists = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@mmtailor.com');
  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)')
      .run('Master Tailor', 'admin@mmtailor.com', hashedPassword, 'admin');
    console.log("Admin user created: admin@mmtailor.com / admin123");
  }

  // Seed products if empty
  const productsCount = db.prepare('SELECT count(*) as count FROM products').get() as { count: number };
  if (productsCount.count === 0) {
    const seedProducts = [
      {
        name: 'Classic White Shalwar Kameez',
        description: 'Premium Egyptian cotton fabric, soft finish with stiff collar. Perfect for Friday prayers and casual gatherings.',
        price: 4500,
        category: 'Shalwar Kameez',
        images: JSON.stringify(['https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=1934&auto=format&fit=crop']),
        estimated_days: 5
      },
      {
        name: 'Black Prince Coat Set',
        description: 'Luxurious black jamawar prince coat with matching shalwar kameez. Ideal for weddings and formal events.',
        price: 25000,
        category: 'Prince Coat',
        images: JSON.stringify(['https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=2080&auto=format&fit=crop']),
        estimated_days: 12
      },
      {
        name: 'Cream Waistcoat Suit',
        description: 'Elegant cream waistcoat with embroidery, paired with off-white shalwar kameez.',
        price: 12000,
        category: 'Waistcoat',
        images: JSON.stringify(['https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?q=80&w=1887&auto=format&fit=crop']),
        estimated_days: 7
      },
      {
        name: 'Royal Blue Sherwani',
        description: 'Hand-embroidered royal blue sherwani for the groom who wants to stand out.',
        price: 55000,
        category: 'Sherwani',
        images: JSON.stringify(['https://images.unsplash.com/photo-1594938298603-c8148c472f29?q=80&w=2070&auto=format&fit=crop']),
        estimated_days: 20
      },
      {
        name: 'Charcoal Grey Kurta Pajama',
        description: 'Modern cut kurta with straight pajama in breathable wash-and-wear fabric.',
        price: 6500,
        category: 'Kurta',
        images: JSON.stringify(['https://images.unsplash.com/photo-1596783074918-c84cb06531ca?q=80&w=2070&auto=format&fit=crop']),
        estimated_days: 6
      }
    ];

    const insert = db.prepare('INSERT INTO products (name, description, price, category, images, estimated_days) VALUES (?, ?, ?, ?, ?, ?)');
    seedProducts.forEach(p => {
      insert.run(p.name, p.description, p.price, p.category, p.images, p.estimated_days);
    });
    console.log('Seeded initial products');
  }
}

export default db;
