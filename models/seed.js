// seed.js - Script to populate database with sample products

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./products');

// Sample products data
const sampleProducts = [
  {
    name: 'MacBook Pro 16"',
    description: 'High-performance laptop with M3 Pro chip, 16GB RAM, and 512GB SSD',
    price: 2499.99,
    category: 'electronics',
    inStock: true,
  },
  {
    name: 'Wireless Gaming Mouse',
    description: 'Ergonomic wireless gaming mouse with RGB lighting and 16000 DPI',
    price: 79.99,
    category: 'electronics',
    inStock: true,
  },
  {
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with Cherry MX switches',
    price: 149.99,
    category: 'electronics',
    inStock: true,
  },
  {
    name: 'Smart Coffee Maker',
    description: 'WiFi-enabled programmable coffee maker with mobile app control',
    price: 129.99,
    category: 'kitchen',
    inStock: true,
  },
  {
    name: 'Blender Pro 3000',
    description: 'Professional-grade blender with 10 speed settings and 2L capacity',
    price: 89.99,
    category: 'kitchen',
    inStock: false,
  },
];

async function runSeed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI is not set in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to MongoDB');

    const beforeCount = await Product.countDocuments();
    console.log(`ℹ️  Products before seeding: ${beforeCount}`);

    await Product.deleteMany({});
    const inserted = await Product.insertMany(sampleProducts, { ordered: true });

    const afterCount = await Product.countDocuments();
    console.log(`✅ Inserted ${inserted.length} products. Total now: ${afterCount}`);

    // Ensure text index exists (in case model indexing is delayed)
    await Product.syncIndexes();
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

runSeed();


