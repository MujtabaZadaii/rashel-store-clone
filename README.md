# 🛒 Rashel Store Clone - Full Stack MERN Application

<div align="center">
  <img src="frontend/public/hero_rice/Rice_Water_Serum_Website_Banner-01_11zon.png" alt="Rashel Store Banner" />
</div>

<br />

Welcome to the **Rashel Store Clone**! This project is a comprehensive, full-stack eCommerce web application. I have meticulously replicated the beautiful UI/UX of the original Rashel Store while building a robust, custom backend to handle real-world eCommerce operations.

**Live Demo**: [https://peppy-manatee-ec0269.netlify.app](https://peppy-manatee-ec0269.netlify.app)

---

## 🌟 Key Features

### 🛍️ Frontend (Customer Facing)
*   **Stunning UI/UX**: Pixel-perfect clone of the original store with modern animations and responsive design.
*   **Dynamic Product Catalog**: Browse products by categories (Face Care, Body Care, etc.), bestsellers, and special promotions (BOGO deals, Combos).
*   **Shopping Cart System**: Add to cart, adjust quantities, and proceed to checkout smoothly.
*   **Advanced Search & Filtering**: Find products instantly.
*   **Customer Authentication**: Secure login and registration using JWT.
*   **User Dashboard**: Customers can track their order history and manage their profiles.

### 🛡️ Backend & Admin (Management)
*   **Secure API**: Built with Node.js and Express, secured via JWT middleware.
*   **Admin Dashboard**: Dedicated panel for store managers.
*   **Product Management**: Add, edit, or delete products and variants.
*   **Order Management**: View and update order statuses (Processing, Shipped, Delivered).
*   **Banner/Promo Management**: Dynamically update homepage sliders and promotional banners from the dashboard.

---

## 🚀 Tech Stack

### Frontend
*   **React.js** (Vite)
*   **Tailwind CSS** (for rapid, responsive styling)
*   **Axios** (for API communication)
*   **React Router DOM** (for navigation)

### Backend
*   **Node.js & Express.js** (RESTful API architecture)
*   **MySQL / SQL** (Relational database structure for orders and products)
*   **JWT (JSON Web Tokens)** (Authentication & Authorization)
*   **Bcrypt.js** (Password hashing)

---

## 📂 Project Structure

```text
rashel-store/
├── backend/                # Node.js Express API
│   ├── config/             # Database connection settings
│   ├── controllers/        # Business logic for routes
│   ├── database/           # SQL schemas and seed data
│   ├── middleware/         # Auth & validation middlewares
│   ├── routes/             # Express API routes
│   └── server.js           # Entry point for backend
│
└── frontend/               # React User Interface
    ├── public/             # Static assets (images, banners)
    ├── src/                
    │   ├── components/     # Reusable UI components (Navbar, Footer, Cart)
    │   ├── context/        # React Context (AuthContext, CartContext)
    │   ├── pages/          # Main views (Home, Shop, Checkout, Admin)
    │   └── App.jsx         # Main routing component
    └── vite.config.js      # Vite configuration
```

---

## 🛠️ Complete Installation Guide

Follow these steps to run the project locally on your machine.

### 1. Prerequisites
*   [Node.js](https://nodejs.org/) (v16 or higher)
*   [Git](https://git-scm.com/)
*   A local MySQL server (like XAMPP, WAMP, or standalone)

### 2. Clone the Repository
```bash
git clone https://github.com/MujtabaZadaii/rashel-store-clone.git
cd rashel-store-clone
```

### 3. Database Setup
1. Open your MySQL management tool (e.g., phpMyAdmin, MySQL Workbench).
2. Create a new database named `rashel_store`.
3. Import the schema and seed files located in `backend/database/` to create tables and mock data.

### 4. Backend Configuration
```bash
cd backend
npm install
```
Rename `.env.example` to `.env` and fill in your database credentials:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=rashel_store
JWT_SECRET=your_jwt_secret
```
Start the backend server:
```bash
npm run dev
```
*The server should now be running on `http://localhost:5000`*

### 5. Frontend Configuration
Open a new terminal window and navigate to the frontend folder:
```bash
cd frontend
npm install
npm run dev
```
*The frontend will start on `http://localhost:5173`*

---

## 🌐 Deployment

*   **Frontend**: Easily deployable on platforms like **Netlify** or **Vercel**. Just set the build command to `npm run build` and publish directory to `dist`.
*   **Backend**: Can be deployed on **Render**, **Railway**, or **Heroku**. Ensure you add the environment variables in the host's dashboard.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👨‍💻 About The Developer

This clone was developed entirely by **Mujtaba Zadaii**. 
It serves as a portfolio piece demonstrating proficiency in building scalable, real-world MERN stack applications, UI replication, and REST API development.

*Disclaimer: This is a personal educational project. All product images and brand names belong to their respective original owners.*
