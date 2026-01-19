# ECOMMERCE Application

A full‑stack eCommerce web application that enables users to browse products, manage a shopping cart, place orders, and handle secure authentication. The system is designed with scalability, performance, 
and maintainability in mind.

---

## 🚀 Features

### User Features

* User registration and authentication (JWT & cookies)
* Secure login and logout
* Browse products by category
* Product search and filtering
* Add/remove products from cart
* Checkout and order placement
* Order history tracking

### Admin Features

* Admin authentication
* Product management (create, update, delete)
* Category management
* Order management
* User management

### Technical Features

* RESTful API architecture
* Secure password hashing
* Role‑based access control (RBAC)
* Error handling and validation
* Responsive frontend UI

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Redux / Context API (state management)
* Axios (API requests)
* Tailwind CSS / CSS Modules

### Backend

* Node.js
* Express.js
* MongoDB with Mongoose
* JWT Authentication
* Cookie‑based sessions

### Tools & Utilities

* bcryptjs
* dotenv
* Nodemon
* Postman (API testing)

---

## 📂 Project Structure

```
ecommerce/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── app.js
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── utils/
│   │   └── App.jsx
│   └── main.jsx
│
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites

* Node.js (v16+ recommended)
* MongoDB (local or cloud)
* npm or yarn

### Clone Repository

```
git clone https://github.com/your-username/ecommerce.git
cd ecommerce
```

### Backend Setup

```
cd backend
npm install
```

Create a `.env` file:

```
PORT=8001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Run backend server:

```
npm run dev
```

### Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

| Variable   | Description               |
| ---------- | ------------------------- |
| PORT       | Backend server port       |
| MONGO_URI  | MongoDB connection string |
| JWT_SECRET | Secret key for JWT        |

---

## 📡 API Overview

### Auth Routes

* `POST /api/auth/register`
* `POST /api/auth/login`
* `POST /api/auth/logout`

### Product Routes

* `GET /api/products`
* `POST /api/products` (Admin)
* `PUT /api/products/:id` (Admin)
* `DELETE /api/products/:id` (Admin)

### Order Routes

* `POST /api/orders`
* `GET /api/orders/user`
* `GET /api/orders` (Admin)

---

## 🧪 Testing

* Use **Postman** or **Insomnia** to test API endpoints
* Frontend tested manually via browser

---

## 📦 Deployment

* Frontend: Vercel / Netlify
* Backend: Render / Railway / DigitalOcean
* Database: MongoDB Atlas

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👤 Author

**Clinton Clinton**
Backend Engineer | Full‑Stack Developer

---

## ⭐ Acknowledgements

* Open‑source community
* Node.js & React.js teams
* MongoDB
