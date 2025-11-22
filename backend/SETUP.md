# Backend Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Update the following variables:
     ```env
     NODE_ENV=development
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/stockmaster
     JWT_SECRET=your_super_secret_jwt_key_change_this
     ```

3. **Start MongoDB**
   - Make sure MongoDB is running on your system
   - Or use MongoDB Atlas and update `MONGODB_URI` accordingly

4. **Run the Server**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

## Testing the API

### 1. Register a User
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "fullName": "Admin User",
  "email": "admin@stockmaster.com",
  "password": "password123",
  "role": "inventory_manager",
  "phone": "+1234567890"
}
```

### 2. Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@stockmaster.com",
  "password": "password123"
}
```

Save the `token` from the response for authenticated requests.

### 3. Create a Warehouse
```bash
POST http://localhost:5000/api/warehouses
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "name": "Main Warehouse",
  "code": "WH-001",
  "address": {
    "street": "123 Warehouse St",
    "city": "New York",
    "state": "NY",
    "zip": "10001",
    "country": "USA"
  }
}
```

### 4. Create a Location
```bash
POST http://localhost:5000/api/locations
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "warehouse": "<warehouse_id>",
  "name": "Zone A",
  "code": "A-01",
  "type": "zone",
  "capacity": 1000
}
```

### 5. Create a Product
```bash
POST http://localhost:5000/api/products
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "name": "Steel Rod",
  "sku": "SR-100",
  "description": "High quality steel rod",
  "category": "Raw Material",
  "unitOfMeasure": "pcs",
  "costPrice": 45.00,
  "sellingPrice": 60.00,
  "reorderPoint": 50,
  "reorderQuantity": 100
}
```

### 6. Create a Receipt
```bash
POST http://localhost:5000/api/receipts
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "supplier": {
    "name": "Steel Suppliers Inc.",
    "contact": "+1234567890",
    "email": "contact@steelsuppliers.com"
  },
  "warehouse": "<warehouse_id>",
  "items": [
    {
      "product": "<product_id>",
      "qty": 100,
      "unitPrice": 45.00,
      "location": "<location_id>"
    }
  ]
}
```

### 7. Validate Receipt (Process Stock)
```bash
PUT http://localhost:5000/api/receipts/<receipt_id>/validate
Authorization: Bearer <your_token>
```

## API Base URL

- Development: `http://localhost:5000`
- Production: Update `PORT` in `.env`

## Common Issues

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For MongoDB Atlas, ensure your IP is whitelisted

### JWT Token Issues
- Token expires after 30 days
- Make sure to include `Authorization: Bearer <token>` header
- Token is returned on login/register

### Port Already in Use
- Change `PORT` in `.env`
- Or kill the process using the port

## Project Structure

```
backend/
├── config/          # Configuration files
├── controllers/     # Business logic
├── middleware/      # Auth, error handling
├── models/          # MongoDB schemas
├── routes/          # API routes
├── utils/           # Helper functions
├── app.js           # Express app setup
└── server.js        # Server entry point
```

## Next Steps

1. Connect your frontend to these API endpoints
2. Update frontend API base URL to match backend
3. Test all CRUD operations
4. Set up production environment variables

