# commerce-nexus
Advanced MERN e-commerce ecosystem with real-time inventory, OTP authentication, and Payment gateway

## 🧱 Architecture
```mermaid
graph TD
    subgraph Client_Side [Frontend: React.js & Tailwind]
        UI[User Interface]
        State[React Context API]
        Router[React Router]
    end

    subgraph External_Services [Third-Party APIs]
        Stripe[Stripe Payment Gateway]
        Cloudinary[Cloudinary Image Hosting]
        Mail[Nodemailer / OTP Service]
    end

    subgraph Server_Side [Backend: Node.js & Express]
        Auth[JWT & OTP Middleware]
        Controllers[Business Logic / Controllers]
        Routes[API Endpoints]
        Errors[Global Error Handler]
    end

    subgraph Database_Layer [Data: MongoDB Atlas]
        Mongoose[Mongoose ODM]
        Collections[(Collections: Users, Products, Orders)]
    end

    %% Connections
    UI <--> State
    UI <--> Router
    Router <--> Routes
    
    Routes <--> Auth
    Auth <--> Controllers
    Controllers <--> Mongoose
    Mongoose <--> Collections
    
    %% Service Integrations
    Controllers <--> Stripe
    Controllers <--> Cloudinary
    Controllers <--> Mail
```

### 🎨 Frontend
[![React](https://img.shields.io/badge/React-UI-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styling-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![React Router](https://img.shields.io/badge/Routing-ReactRouter-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com)

### ⚙️ Backend
[![Node.js](https://img.shields.io/badge/Node.js-Runtime-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express.js](https://img.shields.io/badge/Express.js-API-000000?logo=express&logoColor=white)](https://expressjs.com)

### 🗄️ Database
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://mongodb.com)
[![Mongoose](https://img.shields.io/badge/Mongoose-ODM-880000?logo=mongoose&logoColor=white)](https://mongoosejs.com)

### 🔐 Auth & Security
[![JWT](https://img.shields.io/badge/JWT-Auth-black?logo=jsonwebtokens)](https://jwt.io)
[![Nodemailer](https://img.shields.io/badge/Nodemailer-OTP-009688?logo=gmail&logoColor=white)](https://nodemailer.com)

### 💳 Payments & Media
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?logo=stripe&logoColor=white)](https://stripe.com)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5?logo=cloudinary&logoColor=white)](https://cloudinary.com)

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

