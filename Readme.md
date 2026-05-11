# 🌐 Web-Builder

A full-stack web application for building websites visually.

🔗 **Live Demo:** [web-builder-1.onrender.com](https://web-builder-1.onrender.com)

---

## 📁 Folder Structure

```
web-builder/
├── client/          # Frontend application (React)
│   └── src/
│       └── App.jsx
└── server/          # Backend application (Node.js)
    └── controllers/
        ├── paymentController
        └── billingController
```

---

## 🛠️ Tech Stack

| Language   | Usage  |
|------------|--------|
| JavaScript | 95.0%  |
| CSS        | 4.5%   |
| HTML       | 0.5%   |

---

## 🚀 Getting Started (Local Setup)

### 1. Clone the Repository

```bash
git clone https://github.com/ayushpatwal011/web-builder.git
cd web-builder
```

### 2. Start the Server

```bash
cd server
npm install
npm run dev
```

### 3. Start the Client

```bash
cd ../client
npm install
npm run dev
```

### 4. Configure the API URL

Open `client/source/app.js` and update the `SERVER_URL`:

```js
// Comment this line (production URL)
// export const SERVER_URL = 'https://web-builder-xlqe.onrender.com'

// Uncomment this line (local development)
export const SERVER_URL = 'http://localhost:8000'
```

> ⚠️ **Remember to revert this change before deploying to production.**

---

## 👤 Author

**Ayush Patwal** — [@ayushpatwal011](https://github.com/ayushpatwal011)
