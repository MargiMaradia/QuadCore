# Stock Sync - Inventory Management System

A comprehensive, full-stack inventory management system built with React and Node.js. Stock Sync provides real-time stock tracking, warehouse management, delivery processing, and complete audit trails for businesses of all sizes.

![Stock Sync](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-ISC-green)
![Node](https://img.shields.io/badge/Node.js-v14+-green)
![React](https://img.shields.io/badge/React-v19.2-blue)

## 🚀 Features

### Core Functionality
- **Product Management**: Create, update, and track products with SKU, pricing, and categorization
- **Warehouse Management**: Multi-warehouse support with location tracking
- **Stock Tracking**: Real-time inventory levels with low stock alerts
- **Receipt Processing**: Manage incoming stock with validation workflow
- **Delivery Orders**: Complete delivery order lifecycle (picking → packing → completion)
- **Internal Transfers**: Transfer stock between warehouses and locations
- **Stock Adjustments**: Adjust inventory with approval workflow
- **Stock Ledger**: Complete audit trail of all stock movements
- **CSV Export**: Export stock and product data for reporting

### User Features
- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Roles**: Support for warehouse workers, inventory managers, and admins
- **Password Reset**: Email-based password reset with OTP verification
- **User Profiles**: Manage user information and preferences
- **Dashboard**: Real-time KPIs, charts, and notifications

### Technical Features
- **Responsive Design**: Mobile-friendly UI built with Tailwind CSS
- **Error Handling**: Comprehensive error boundaries and error handling
- **API Documentation**: RESTful API with clear endpoints
- **Data Validation**: Input validation on both frontend and backend
- **Security**: Secure authentication, password hashing, and protected routes

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **npm** or **yarn** package manager
- **Git** for version control

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/MargiMaradia/QuadCore.git
cd QuadCore
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp env.example.txt .env
```

Edit the `.env` file with your configuration:

```env
NODE_ENV=development
PORT=5000

# MongoDB Connection
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/stockmaster

# OR MongoDB Atlas (Cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stockmaster?retryWrites=true&w=majority

# JWT Secret (Change this to a random string in production - minimum 32 characters)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_characters

# Email Configuration for Password Reset
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-here
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create .env file (optional - for custom API URL)
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Frontend will run on `http://localhost:3000`

### Production Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
# Serve the build folder using a static file server
```

## 📁 Project Structure

```
QuadCore/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/             # Route controllers
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── warehouseController.js
│   │   ├── stockController.js
│   │   ├── receiptController.js
│   │   ├── deliveryController.js
│   │   ├── transferController.js
│   │   ├── adjustmentController.js
│   │   └── ledgerController.js
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication middleware
│   │   ├── errorHandler.js     # Error handling middleware
│   │   └── asyncHandler.js     # Async error wrapper
│   ├── models/                  # Mongoose models
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Warehouse.js
│   │   ├── Location.js
│   │   ├── Stock.js
│   │   ├── Receipt.js
│   │   ├── DeliveryOrder.js
│   │   ├── InternalTransfer.js
│   │   ├── StockAdjustment.js
│   │   └── StockLedger.js
│   ├── routes/                  # API routes
│   ├── utils/                   # Utility functions
│   │   ├── generateToken.js
│   │   ├── generateOTP.js
│   │   ├── generateNumber.js
│   │   └── emailService.js
│   ├── app.js                   # Express app configuration
│   ├── server.js                # Server entry point
│   └── package.json
│
├── frontend/
│   ├── public/                  # Static files
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── layouts/             # Layout components
│   │   │   └── Layout.jsx
│   │   ├── pages/               # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Inventory.jsx
│   │   │   ├── Deliveries.jsx
│   │   │   ├── Documents.jsx
│   │   │   ├── StockLedger.jsx
│   │   │   └── ...
│   │   ├── services/            # API services
│   │   │   └── api.js
│   │   ├── utils/               # Utility functions
│   │   ├── App.js               # Main App component
│   │   └── index.js             # Entry point
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset OTP
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/reset-password` - Reset password with OTP
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Manager/Admin only)
- `PUT /api/products/:id` - Update product (Manager/Admin only)
- `DELETE /api/products/:id` - Delete product (Manager/Admin only)
- `GET /api/products/low-stock` - Get low stock products

### Warehouses
- `GET /api/warehouses` - Get all warehouses
- `GET /api/warehouses/:id` - Get single warehouse
- `POST /api/warehouses` - Create warehouse (Manager/Admin only)
- `PUT /api/warehouses/:id` - Update warehouse (Manager/Admin only)
- `DELETE /api/warehouses/:id` - Delete warehouse (Manager/Admin only)

### Stock
- `GET /api/stock` - Get all stock entries
- `GET /api/stock/:id` - Get single stock entry
- `POST /api/stock` - Create or update stock
- `PUT /api/stock/:id` - Update stock
- `GET /api/stock/summary` - Get stock summary

### Receipts
- `GET /api/receipts` - Get all receipts
- `GET /api/receipts/:id` - Get single receipt
- `POST /api/receipts` - Create receipt
- `PUT /api/receipts/:id` - Update receipt
- `PUT /api/receipts/:id/validate` - Validate receipt
- `DELETE /api/receipts/:id` - Delete receipt

### Deliveries
- `GET /api/deliveries` - Get all deliveries
- `GET /api/deliveries/:id` - Get single delivery
- `POST /api/deliveries` - Create delivery
- `PUT /api/deliveries/:id` - Update delivery
- `PUT /api/deliveries/:id/pick` - Update picking status
- `PUT /api/deliveries/:id/pack` - Update packing status
- `PUT /api/deliveries/:id/complete` - Complete delivery
- `DELETE /api/deliveries/:id` - Delete delivery

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
- `PUT /api/adjustments/:id/approve` - Approve adjustment
- `PUT /api/adjustments/:id/reject` - Reject adjustment
- `DELETE /api/adjustments/:id` - Delete adjustment

### Ledger
- `GET /api/ledger` - Get all ledger entries
- `GET /api/ledger/:id` - Get single ledger entry
- `GET /api/ledger/product/:productId` - Get ledger by product
- `GET /api/ledger/type/:type` - Get ledger by transaction type

### Export
- `GET /api/export/stock` - Export stock data as CSV
- `GET /api/export/products` - Export products data as CSV

## 👥 User Roles

- **warehouse_worker**: Can process receipts, deliveries, and view inventory
- **inventory_manager**: Full access to products, warehouses, and stock management
- **admin**: Complete system access including user management

## 🎨 Technology Stack

### Frontend
- **React** 19.2 - UI library
- **React Router** 7.9 - Routing
- **Tailwind CSS** 3.4 - Styling
- **Recharts** 3.4 - Data visualization
- **Lucide React** - Icons
- **Axios/Fetch** - API calls

### Backend
- **Node.js** - Runtime environment
- **Express** 4.18 - Web framework
- **MongoDB** - Database
- **Mongoose** 8.0 - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Express Validator** - Input validation

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
- Check if MongoDB is running
- Verify `.env` file exists and has correct `MONGODB_URI`
- Ensure port 5000 is not in use

**Frontend shows white screen:**
- Check browser console for errors
- Verify backend is running on port 5000
- Check `REACT_APP_API_URL` in frontend `.env`

**Authentication issues:**
- Verify JWT_SECRET is set in backend `.env`
- Check token expiration
- Clear browser localStorage

**Database connection errors:**
- Verify MongoDB is running
- Check connection string format
- For Atlas, ensure IP is whitelisted

## 📝 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stockmaster
JWT_SECRET=your_super_secret_jwt_key
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Authors

- **Margi Maradia** - [GitHub](https://github.com/MargiMaradia)

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB for the robust database solution
- All open-source contributors whose packages made this possible

## 📞 Support

For support, email support@stocksync.com or open an issue in the repository.

---

**Made with ❤️ for efficient inventory management**

