# 💸 Expense Tracker API

A full-featured backend API for managing personal finances — track income, expenses, user authentication, and profile management with image uploads.

---

## 🚀 Features

* 🔐 User Authentication (Signup/Login with JWT)
* 👤 Profile Management
* 🔑 Change Password
* 🧾 Add / Update / Delete Expenses
* 📊 Expense Summary (Income vs Expense)
* 🗂️ Filter by Date, Category, Type
* 🖼️ Avatar Upload using Cloudinary
* 🛡️ Protected Routes with Middleware

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* Cloudinary (Image Upload)
* Multer (File Handling)
* BcryptJS (Password Hashing)

---

## 📁 Folder Structure

```
backend/
│── config/
│   └── cloudinary.js
│
│── controllers/
│   ├── AuthController.js
│   ├── expenseController.js
│   ├── uploadController.js
│   └── userController.js
│
│── middlewares/
│   ├── AuthMiddleware.js
│   └── upload.js
│
│── models/
│   ├── UserModel.js
│   └── expenseModel.js
│
│── routes/
│   ├── AuthRoutes.js
│   ├── expenseRoutes.js
│   └── userRoutes.js
│
│── utils/
│   └── SecretToken.js
│
│── index.js
│── package.json
│── .env
```

---

## ⚙️ Installation

```bash
git clone https://github.com/your-username/your-repo.git
cd backend
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file in root:

```
PORT=4000
MONGO_URI=your_mongodb_connection
TOKEN_KEY=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## ▶️ Run the Server

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

---

## 🌐 API Base URL

```
http://localhost:4000/api
```

---

## 🔑 Authentication Routes

| Method | Endpoint | Description   |
| ------ | -------- | ------------- |
| POST   | /signup  | Register user |
| POST   | /login   | Login user    |

---

## 💸 Expense Routes (Protected)

| Method | Endpoint          | Description      |
| ------ | ----------------- | ---------------- |
| GET    | /expenses         | Get all expenses |
| POST   | /expenses         | Add expense      |
| PUT    | /expenses/:id     | Update expense   |
| DELETE | /expenses/:id     | Delete expense   |
| GET    | /expenses/summary | Get summary      |

---

## 👤 User Routes (Protected)

| Method | Endpoint       | Description     |
| ------ | -------------- | --------------- |
| PUT    | /user/profile  | Update username |
| PUT    | /user/password | Change password |
| DELETE | /user/account  | Delete account  |
| PUT    | /user/avatar   | Upload avatar   |

---

## 🔐 Authorization

Add token in headers:

```
Authorization: Bearer <your_token>
```

---

## ☁️ Deployment (Render)

1. Push code to GitHub
2. Go to https://render.com
3. Create **Web Service**
4. Add environment variables
5. Deploy 🚀

---

## ⚠️ Security Notes

* Never commit `.env` file
* Use strong JWT secret
* Rotate API keys if exposed
* Enable MongoDB Atlas IP whitelist

---

## 📸 API Example

### Add Expense

```json
POST /api/expenses
{
  "title": "Groceries",
  "amount": 500,
  "category": "Food",
  "date": "2026-01-01",
  "type": "expense"
}
```

---

## 📬 Future Improvements

* 📈 Charts & Analytics
* 🧠 AI Expense Insights
* 📅 Recurring Transactions
* 📤 Export Reports (PDF/CSV)

---

## 👨‍💻 Author

Sameer Dharmadhikari
