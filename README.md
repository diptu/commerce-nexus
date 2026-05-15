# commerce-nexus
Advanced MERN e-commerce ecosystem with real-time inventory, OTP authentication, and Payment gateway

## 🛠️ Tech Stack

[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express.js](https://img.shields.io/badge/Framework-Express.js-000000?logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](https://mongodb.com)
[![JWT](https://img.shields.io/badge/Auth-JWT-black?logo=jsonwebtokens)](https://jwt.io)


## 🚀 Core Features

### 🛒 Customer Experience
- **Dynamic Product Discovery:** Multi-criteria filtering (Price, Category) and real-time search.
- **Secure Authentication:** Passwordless OTP-based login system for enhanced security.
- **Cart & Checkout:** Persistent cart state with integrated Stripe Payment Gateway.
- **Order Tracking:** Automated email confirmations and printable PDF invoices.
- **Responsive UI:** Dark/Light mode support with a mobile-first glassmorphism design.

### 🛡️ Admin Management
- **Inventory Control:** Full CRUD operations for products with real-time stock updates.
- **Order Management:** State-driven order pipeline (Pending → Shipped → Delivered).
- **Data Analytics:** Visualized sales data using interactive charts and metrics.
- **Media Management:** Cloud-integrated image uploads and automated optimizations.

## 🛠️ Technical Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js, Tailwind CSS, Lucide Icons, React Router |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Atlas), Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT), Nodemailer (OTP) |
| **Payments** | Stripe API |
| **Storage** | Cloudinary API |


## 🏗️ Architecture & Engineering
- **Modular Backend:** Separated routes, controllers, and models for high maintainability.
- **State Architecture:** Global state management using React Context to handle cart and user sessions.
- **Middleware Integration:** Custom error handling, authentication guards, and file upload processing.
- **Security:** Environment variable protection, CORS configuration, and data sanitization.

