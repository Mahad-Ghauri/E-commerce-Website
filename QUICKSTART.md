# Velzck Shop - Quick Start Guide

## 🚀 Getting Started

This guide will help you get the complete e-commerce website running with backend and frontend.

## Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- Modern web browser

## Step 1: Start MongoDB

### Option A: Local MongoDB
```bash
# Start MongoDB service
mongod
```

### Option B: MongoDB Atlas
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get your connection string
4. Update `.env` file in backend directory

## Step 2: Configure Backend

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Update environment variables:**
   
   Edit `backend/.env` if needed:
   ```env
   MONGODB_URI=mongodb://localhost:27017/velzck-shop
   # Or use your MongoDB Atlas connection string
   ```

3. **Install dependencies (already done):**
   ```bash
   npm install
   ```

## Step 3: Seed the Database

```bash
cd backend
npm run seed
```

This will populate your database with 16 sneaker products.

## Step 4: Start the Backend Server

```bash
cd backend
npm run dev
```

The backend API will start on `http://localhost:5000`

You should see:
```
Server running in development mode on port 5000
MongoDB Connected: localhost
```

## Step 5: Start the Frontend

Open a new terminal window:

```bash
# From project root
npx serve
```

Or use any static file server:
```bash
python -m http.server 8000
# or
php -S localhost:8000
```

The frontend will be available at `http://localhost:3000` (or your chosen port)

## Step 6: Test the Application

1. **Open your browser** and go to `http://localhost:3000`

2. **Register a new account:**
   - Click "Sign Up" button
   - Fill in your details
   - Submit the form

3. **Browse products:**
   - Scroll down to see all 16 products
   - Products are loaded from the backend API

4. **Add items to cart:**
   - Click on a product's shopping cart icon
   - Select a size
   - Click "Add to Cart"

5. **View your cart:**
   - Click the cart icon in the header
   - See your items
   - Update quantities
   - Remove items

6. **Checkout:**
   - Click "Checkout" in the cart
   - (Note: Full checkout flow requires additional implementation)

## Creating an Admin User

To access admin features (create/edit/delete products):

1. Register a normal user first
2. Connect to MongoDB:
   ```bash
   mongosh
   use velzck-shop
   db.users.updateOne(
     { email: "your-email@example.com" },
     { $set: { role: "admin" } }
   )
   ```

## API Endpoints

The backend exposes these endpoints:

- **Products:** `http://localhost:5000/api/products`
- **Cart:** `http://localhost:5000/api/cart`
- **Auth:** `http://localhost:5000/api/auth`
- **Orders:** `http://localhost:5000/api/orders`
- **Upload:** `http://localhost:5000/api/upload`

## Testing the API

You can test the API using:

### Get all products:
```bash
curl http://localhost:5000/api/products
```

### Register a user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check the connection string in `.env`
- For Atlas, ensure your IP is whitelisted

### Port Already in Use
- Change the PORT in `.env` file
- Or kill the process using the port:
  ```bash
  lsof -ti:5000 | xargs kill
  ```

### CORS Errors
- Make sure backend is running on port 5000
- Check CLIENT_URL in `.env` matches your frontend URL

### Images Not Loading
- Ensure images were copied to `backend/uploads/products/`
- Check that the backend is serving static files from `/uploads`

## Project Structure

```
E-commerce Website/
├── backend/                 # Backend API
│   ├── server.js           # Main server
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth, upload, errors
│   ├── uploads/            # Product images
│   └── .env                # Environment variables
├── js/                     # Frontend JavaScript
│   ├── api.js              # API client
│   ├── auth.js             # Authentication
│   └── cart.js             # Shopping cart
├── css/                    # Stylesheets
│   ├── style.css
│   ├── responsive.css
│   └── cart-auth.css
├── imgs/                   # Original images
└── index.html              # Main page
```

## Next Steps

1. **Customize Products:**
   - Edit `backend/utils/seedProducts.js`
   - Run `npm run seed` again

2. **Add More Features:**
   - Product reviews
   - Wishlist
   - Order tracking
   - Payment integration (Stripe)

3. **Deploy:**
   - Backend: Heroku, Railway, or Render
   - Frontend: Netlify, Vercel, or GitHub Pages
   - Database: MongoDB Atlas

## Support

For issues or questions:
- Check the backend README: `backend/README.md`
- Review the implementation plan
- Check browser console for errors
- Check backend terminal for API errors

## License

MIT License - Copyright (c) 2025 Mahad Ghauri
