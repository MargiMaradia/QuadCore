# StockMaster Backend API

Backend API for StockMaster Inventory Management System built with Node.js, Express, and MongoDB.

## Features

- User authentication and authorization (JWT)
- Product management
- Warehouse and location management
- Stock tracking and management
- Receipt processing
- Delivery order management
- Internal transfers
- Stock adjustments
- Stock ledger (audit trail)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

3. Create a `.env` file in the backend root directory and add your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stockmaster
JWT_SECRET=your_super_secret_jwt_key

# Email Configuration (for password reset)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

**See `ENV_SETUP.md` for detailed setup instructions.**

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in `.env`).

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Send OTP to email for password reset
- `POST /api/auth/verify-otp` - Verify OTP (optional)
- `POST /api/auth/reset-password` - Reset password with OTP
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Manager only)
- `PUT /api/products/:id` - Update product (Manager only)
- `DELETE /api/products/:id` - Delete product (Manager only)
- `GET /api/products/low-stock` - Get low stock products

### Warehouses
- `GET /api/warehouses` - Get all warehouses
- `GET /api/warehouses/:id` - Get single warehouse
- `POST /api/warehouses` - Create warehouse (Manager only)
- `PUT /api/warehouses/:id` - Update warehouse (Manager only)
- `DELETE /api/warehouses/:id` - Delete warehouse (Manager only)

### Locations
- `GET /api/locations` - Get all locations
- `GET /api/locations/:id` - Get single location
- `POST /api/locations` - Create location (Manager only)
- `PUT /api/locations/:id` - Update location (Manager only)
- `DELETE /api/locations/:id` - Delete location (Manager only)

### Stock
- `GET /api/stock` - Get all stock records
- `GET /api/stock/:id` - Get single stock record
- `POST /api/stock` - Create or update stock (Manager only)
- `PUT /api/stock/:id` - Update stock (Manager only)
- `GET /api/stock/summary` - Get stock summary

### Receipts
- `GET /api/receipts` - Get all receipts
- `GET /api/receipts/:id` - Get single receipt
- `POST /api/receipts` - Create receipt
- `PUT /api/receipts/:id` - Update receipt
- `PUT /api/receipts/:id/validate` - Validate and process receipt (Manager only)
- `DELETE /api/receipts/:id` - Delete receipt

### Deliveries
- `GET /api/deliveries` - Get all delivery orders
- `GET /api/deliveries/:id` - Get single delivery order
- `POST /api/deliveries` - Create delivery order
- `PUT /api/deliveries/:id` - Update delivery order
- `PUT /api/deliveries/:id/pick` - Update picking status
- `PUT /api/deliveries/:id/pack` - Update packing status
- `PUT /api/deliveries/:id/complete` - Complete delivery
- `DELETE /api/deliveries/:id` - Delete delivery order

### Transfers
- `GET /api/transfers` - Get all transfers
- `GET /api/transfers/:id` - Get single transfer
- `POST /api/transfers` - Create transfer
- `PUT /api/transfers/:id` - Update transfer
- `PUT /api/transfers/:id/complete` - Complete transfer
- `DELETE /api/transfers/:id` - Delete transfer

### Adjustments
- `GET /api/adjustments` - Get all adjustments
- `GET /api/adjustments/:id` - Get single adjustment
- `POST /api/adjustments` - Create adjustment
- `PUT /api/adjustments/:id` - Update adjustment
- `PUT /api/adjustments/:id/approve` - Approve adjustment (Manager only)
- `PUT /api/adjustments/:id/reject` - Reject adjustment (Manager only)
- `DELETE /api/adjustments/:id` - Delete adjustment

### Ledger
- `GET /api/ledger` - Get all ledger entries
- `GET /api/ledger/:id` - Get single ledger entry
- `GET /api/ledger/product/:productId` - Get product ledger
- `GET /api/ledger/type/:type` - Get ledger by transaction type

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## User Roles

- `inventory_manager` - Full access to all features
- `warehouse_staff` - Limited access (cannot create/update/delete products, warehouses, locations)

## Error Handling

The API uses standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Project Structure

```
backend/
├── config/
│   └── database.js
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── warehouseController.js
│   ├── locationController.js
│   ├── stockController.js
│   ├── receiptController.js
│   ├── deliveryController.js
│   ├── transferController.js
│   ├── adjustmentController.js
│   └── ledgerController.js
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   └── asyncHandler.js
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Warehouse.js
│   ├── Location.js
│   ├── Stock.js
│   ├── Receipt.js
│   ├── DeliveryOrder.js
│   ├── InternalTransfer.js
│   ├── StockAdjustment.js
│   └── StockLedger.js
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── warehouseRoutes.js
│   ├── locationRoutes.js
│   ├── stockRoutes.js
│   ├── receiptRoutes.js
│   ├── deliveryRoutes.js
│   ├── transferRoutes.js
│   ├── adjustmentRoutes.js
│   └── ledgerRoutes.js
├── utils/
│   ├── generateToken.js
│   └── generateNumber.js
├── app.js
├── server.js
├── package.json
└── .env.example
```

## License

ISC

