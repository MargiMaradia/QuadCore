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


