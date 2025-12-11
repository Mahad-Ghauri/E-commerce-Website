# Velzck Shop Backend

Complete backend API for the Velzck Shop e-commerce website with Node.js, Express, and MongoDB.

## Features

- ✅ RESTful API with Express.js
- ✅ MongoDB database with Mongoose ODM
- ✅ User authentication with JWT
- ✅ Shopping cart for authenticated and guest users
- ✅ Order management system
- ✅ Image upload and storage
- ✅ Product CRUD operations
- ✅ Role-based authorization (Admin/Customer)
- ✅ Session management for guest carts
- ✅ Input validation and error handling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Edit the `.env` file and update the following:
   ```env
   MONGODB_URI=mongodb://localhost:27017/velzck-shop
   # Or use MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/velzck-shop
   
   JWT_SECRET=your-secret-key-here
   SESSION_SECRET=your-session-secret-here
   ```

4. **Start MongoDB:**
   
   If using local MongoDB:
   ```bash
   mongod
   ```

5. **Seed the database:**
   ```bash
   npm run seed
   ```

6. **Start the server:**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login user | No |
| GET | `/profile` | Get user profile | Yes |
| PUT | `/profile` | Update user profile | Yes |

### Products (`/api/products`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all products | No |
| GET | `/:id` | Get single product | No |
| POST | `/` | Create product | Admin |
| PUT | `/:id` | Update product | Admin |
| DELETE | `/:id` | Delete product | Admin |

**Query Parameters for GET /:**
- `category` - Filter by category
- `search` - Search by name/description
- `featured` - Filter featured products

### Cart (`/api/cart`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get cart | Optional |
| POST | `/add` | Add item to cart | Optional |
| PUT | `/update/:itemId` | Update item quantity | Optional |
| DELETE | `/remove/:itemId` | Remove item | Optional |
| DELETE | `/clear` | Clear cart | Optional |

### Orders (`/api/orders`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create order | Yes |
| GET | `/` | Get user orders | Yes |
| GET | `/:id` | Get single order | Yes |
| PUT | `/:id/status` | Update order status | Admin |

### Upload (`/api/upload`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/product` | Upload product image | Admin |
| DELETE | `/product/:filename` | Delete image | Admin |

## Database Models

### User
- name, email, password (hashed)
- role (customer/admin)
- address, phone
- timestamps

### Product
- name, category, description
- price, sizes, images
- stock, featured
- timestamps

### Cart
- user (or sessionId for guests)
- items (product, quantity, size, price)
- totalPrice (auto-calculated)
- timestamps

### Order
- user, orderNumber (auto-generated)
- items, shippingAddress
- paymentMethod, paymentStatus
- orderStatus, totalAmount
- timestamps

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-token>
```

### Creating an Admin User

1. Register a normal user via `/api/auth/register`
2. Connect to MongoDB and update the user's role:
   ```javascript
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   )
   ```

## Frontend Integration

Include the JavaScript files in your HTML:

```html
<script src="/js/api.js"></script>
<script src="/js/auth.js"></script>
<script src="/js/cart.js"></script>
```

### Example Usage

```javascript
// Login
await API.auth.login({ email: 'user@example.com', password: 'password' });

// Get products
const products = await API.products.getAll({ category: 'jordan 1' });

// Add to cart
await API.cart.add(productId, 1, 8); // productId, quantity, size

// Create order
await API.orders.create({
  shippingAddress: { /* address object */ },
  paymentMethod: 'card'
});
```

## Project Structure

```
backend/
├── config/
│   └── db.js              # Database connection
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── cartController.js
│   └── orderController.js
├── middleware/
│   ├── auth.js            # JWT authentication
│   ├── upload.js          # Multer configuration
│   └── errorHandler.js
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Cart.js
│   └── Order.js
├── routes/
│   ├── auth.js
│   ├── products.js
│   ├── cart.js
│   ├── orders.js
│   └── upload.js
├── utils/
│   └── seedProducts.js    # Database seeding
├── uploads/
│   └── products/          # Product images
├── .env                   # Environment variables
├── server.js              # Main server file
└── package.json
```

## Testing

Test the API using tools like:
- Postman
- Insomnia
- cURL
- Thunder Client (VS Code extension)

### Example cURL Request

```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Get products
curl http://localhost:5000/api/products

# Add to cart (with auth token)
curl -X POST http://localhost:5000/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"productId":"PRODUCT_ID","quantity":1,"size":9}'
```

## Error Handling

All errors return a consistent format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Security

- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days (configurable)
- Helmet.js for security headers
- CORS enabled for specified origins
- Input validation on all endpoints
- Role-based access control

## License

MIT License - Copyright (c) 2025 Mahad Ghauri

## Support

For issues or questions, please create an issue in the GitHub repository.
