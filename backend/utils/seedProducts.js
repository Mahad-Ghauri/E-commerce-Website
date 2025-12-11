const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const connectDB = require('../config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Product data based on existing HTML
const products = [
    {
        name: 'mike air grey',
        category: 'jordan 1',
        description: 'Classic Jordan 1 in elegant grey colorway. Premium leather construction with iconic design.',
        price: 129.99,
        sizes: [7, 8, 9, 10],
        images: ['/uploads/products/1.1.webp'],
        stock: 15,
        featured: true,
    },
    {
        name: 'mike air red',
        category: 'jordan 1',
        description: 'Bold red Jordan 1 sneakers. Stand out with this vibrant colorway.',
        price: 139.99,
        sizes: [7, 8, 9, 10],
        images: ['/uploads/products/1.2.webp'],
        stock: 12,
        featured: true,
    },
    {
        name: 'mike air mid',
        category: 'jordan 1',
        description: 'Mid-top Jordan 1 with classic styling and modern comfort.',
        price: 119.99,
        sizes: [8, 9, 10, 11],
        images: ['/uploads/products/1.3.webp'],
        stock: 20,
        featured: false,
    },
    {
        name: 'mike green',
        category: 'air force 1',
        description: 'Fresh green Air Force 1. A unique take on the classic silhouette.',
        price: 109.99,
        sizes: [7, 8, 9, 10],
        images: ['/uploads/products/1.4.webp'],
        stock: 18,
        featured: false,
    },
    {
        name: 'mike valentine',
        category: 'air force 1',
        description: 'Special Valentine edition Air Force 1 with romantic colorway.',
        price: 124.99,
        sizes: [8, 9, 10, 11],
        images: ['/uploads/products/1.5.webp'],
        stock: 10,
        featured: true,
    },
    {
        name: 'mike champagne',
        category: 'air max 95',
        description: 'Luxurious champagne-colored Air Max 95. Premium materials and comfort.',
        price: 149.99,
        sizes: [8, 9, 10, 11],
        images: ['/uploads/products/1.7.webp'],
        stock: 8,
        featured: false,
    },
    {
        name: 'mike platinum',
        category: 'air max 270',
        description: 'Sleek platinum Air Max 270 with maximum cushioning.',
        price: 159.99,
        sizes: [7, 8, 9, 10],
        images: ['/uploads/products/2.8.webp'],
        stock: 14,
        featured: true,
    },
    {
        name: 'mike react eng',
        category: 'air max 270',
        description: 'React technology meets Air Max 270 for ultimate comfort.',
        price: 164.99,
        sizes: [7, 8, 9, 10],
        images: ['/uploads/products/2.9.webp'],
        stock: 11,
        featured: false,
    },
    {
        name: 'mike fontanka',
        category: 'air force 1',
        description: 'Modern take on Air Force 1 with Fontanka styling.',
        price: 114.99,
        sizes: [7, 8, 9, 10],
        images: ['/uploads/products/2.3.webp'],
        stock: 16,
        featured: false,
    },
    {
        name: 'mike low black',
        category: 'air force 1',
        description: 'Classic black Air Force 1 low. Timeless and versatile.',
        price: 99.99,
        sizes: [7, 8, 9, 10],
        images: ['/uploads/products/2.6.webp'],
        stock: 25,
        featured: true,
    },
    {
        name: 'mike wmns',
        category: 'air max 95',
        description: 'Women\'s Air Max 95 with premium construction and style.',
        price: 144.99,
        sizes: [7, 8, 9, 10],
        images: ['/uploads/products/2.4.webp'],
        stock: 13,
        featured: false,
    },
    {
        name: 'mike mid smoke',
        category: 'jordan 1',
        description: 'Mid-top Jordan 1 in smoke grey. Perfect everyday sneaker.',
        price: 124.99,
        sizes: [7, 8, 9, 10],
        images: ['/uploads/products/2.2.webp'],
        stock: 17,
        featured: false,
    },
    {
        name: 'Retro High Tie Dye',
        category: 'jordan 1',
        description: 'Unique tie-dye pattern on classic Jordan 1 high. Limited edition.',
        price: 179.99,
        sizes: [7, 8, 9, 10],
        images: ['/uploads/products/1.8.webp'],
        stock: 6,
        featured: true,
    },
    {
        name: 'mike low raygun',
        category: 'air force 1',
        description: 'Special Raygun edition Air Force 1 with unique graphics.',
        price: 134.99,
        sizes: [7, 8, 9, 10],
        images: ['/uploads/products/2.5.webp'],
        stock: 9,
        featured: false,
    },
    {
        name: 'mike mid satin grey',
        category: 'jordan 1',
        description: 'Satin grey Jordan 1 mid with premium materials.',
        price: 129.99,
        sizes: [7, 8, 9, 10],
        images: ['/uploads/products/1.9.webp'],
        stock: 12,
        featured: false,
    },
    {
        name: 'mike low white',
        category: 'air force 1',
        description: 'Classic white Air Force 1 low. The ultimate sneaker staple.',
        price: 94.99,
        sizes: [7, 8, 9, 10],
        images: ['/uploads/products/2.7.webp'],
        stock: 30,
        featured: true,
    },
];

const seedProducts = async () => {
    try {
        // Delete all existing products
        await Product.deleteMany();
        console.log('Products deleted');

        // Insert new products
        await Product.insertMany(products);
        console.log('Products seeded successfully');

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedProducts();
