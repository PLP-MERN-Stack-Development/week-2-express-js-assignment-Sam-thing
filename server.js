// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require('express');
const { v4: uuidv4 } = require('uuid');

// .env (dotenv) set-up
dotenv.config();

// Initialize Express app
const dotenv = require('dotenv');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(express.json());

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Logger Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Authentication Middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader === 'Bearer secrettoken') {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// TODO: Implement the following routes:
// GET /api/products - Get all products
// GET /api/products/:id - Get a specific product
// POST /api/products - Create a new product
// PUT /api/products/:id - Update a product
// DELETE /api/products/:id - Delete a product

// Example route implementation for GET /api/products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// GET /api/products/:id - Get a specific product
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// POST /api/products - Create a new product
app.post('/api/products', authMiddleware, (req, res) => {
  try {
    console.log('Received body:', req.body);
    const { name, description, price, category, inStock } = req.body;
    if (!name || !description || typeof price !== 'number') {
      return res.status(400).json({ message: 'Invalid product data' });
    }

    const newProduct = {
      id: uuidv4(),
      name,
      description,
      price,
      category,
      inStock: Boolean(inStock)
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error in POST /api/products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/products/:id - Update a product
app.put('/api/products/:id', authMiddleware, (req, res) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  if (productIndex === -1) return res.status(404).json({ message: 'Product not found' });

  const updatedData = req.body;
  products[productIndex] = { ...products[productIndex], ...updatedData };
  res.json(products[productIndex]);
});

// DELETE /api/products/:id - Delete a product
app.delete('/api/products/:id', authMiddleware,  (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Product not found' });

  products.splice(index, 1);
  res.status(204).send();
});


// TODO: Implement custom middleware for:
// - Request logging

// - Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app; 