# NexTalk — Blog Application

NexTalk is a modern blog platform built with a monorepo architecture, featuring user authentication, blog post management, commenting, and an admin dashboard for full content moderation.

---

## 🚀 Highlights

- 📝 Blog Management  
- 💬 Commenting System  
- 🔐 User Authentication  
- 🧑‍💼 Admin Dashboard  
- ✏️ Full CRUD for Blog Users  

---

## 📌 Features

### 🔐 User Authentication
- Register with username, email, and password  
- Secure login using JWT tokens  
- Passwords are safely stored using hashing  
- Authenticated routes protected via middleware  

---

### 📝 Blog Post Management
- Full CRUD operations for blog posts  
- Each post includes:
  - Title  
  - Content  
  - Author  
  - Created date  
- Only authenticated users can create posts  
- Users may only edit or delete their own posts  

---

### 👥 All Users
- View all posts  
- View individual post details  

---

### 💬 Commenting System
- All users can view comments on any post  
- Authenticated users can add comments  
- Each comment is associated with the blog post it belongs to  
- Comments include author info and timestamps  

---

### 🧑‍💼 Admin Features
- Admin can delete any post  
- Admin can remove any comment  
- Elevated permissions handled via middleware  

---

## ⚙️ Tech Stack

### Backend
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- JWT Authentication  
- Bcrypt Password Hashing  

### Frontend
- Vue  
- REST API integration  

