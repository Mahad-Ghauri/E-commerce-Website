const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const connectDB = require('../config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Updated product data with new prices ($120-$750)
const products = [
  {
    name: 'mike air grey',
    price: 189.99
  },
  {
    name: 'mike air red',
    price: 199.99
  },
  {
    name: 'mike air mid',
    price: 169.99
  },
  {
    name: 'mike green',
    price: 149.99
  },
  {
    name: 'mike valentine',
    price: 179.99
  },
  {
    name: 'mike champagne',
    price: 249.99
  },
  {
    name: 'mike platinum',
    price: 299.99
  },
  {
    name: 'mike react eng',
    price: 319.99
  },
  {
    name: 'mike fontanka',
    price: 159.99
  },
  {
    name: 'mike low black',
    price: 129.99
  },
  {
    name: 'mike wmns',
    price: 239.99
  },
  {
    name: 'mike mid smoke',
    price: 179.99
  },
  {
    name: 'Retro High Tie Dye',
    price: 749.99
  },
  {
    name: 'mike low raygun',
    price: 219.99
  },
  {
    name: 'mike mid satin grey',
    price: 189.99
  },
  {
    name: 'mike low white',
    price: 119.99
  },
];

const updatePrices = async () => {
  try {
    console.log('Updating product prices...');

    // Update each product
    for (const productData of products) {
      const result = await Product.updateOne(
        { name: productData.name },
        { $set: { price: productData.price } }
      );
      if (result.matchedCount > 0) {
        console.log(`Updated ${productData.name}: $${productData.price}`);
      } else {
        console.log(`Product not found: ${productData.name}`);
      }
    }

    console.log('\n✅ All product prices updated successfully!');
    console.log('Price range: $119.99 - $749.99');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

updatePrices();
