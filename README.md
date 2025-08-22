# 📦 Parcel Delivery System API

A secure, modular, and role-based backend API for a **Parcel Delivery System** (inspired by Pathao / Sundarban Courier).  
This system allows **senders** to create parcels, **receivers** to manage incoming parcels, and **admins** to monitor and control the overall process.

---

##  Live Demo

Visit the live deployment of the project here:

[Parcel Delivery System – Live Link](https://percel-delivary.vercel.app)

---

## 🚀 Features
- 🔐 **Authentication & Authorization** (JWT + Google OAuth2)
- 👤 **Role-based Access Control** (Sender, Receiver, Admin)
- 📦 **Parcel Management** (create, cancel, confirm, track)
- 🛠 **Admin Controls** (block/unblock users & parcels, update parcel status)
- 🔄 **Status Tracking** with logs
- ✅ Secure password management (set/change password)

---

## 🛠 Tech Stack
- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **TypeScript**
- **JWT Authentication**
- **Passport.js (Google OAuth)**

---

## 🔑 Admin Credential
For testing purposes, use the following **Admin account**:

email: rumana@gmail.com
password: 1234@MN



---

## 📂 API Routes

### 🔐 Auth Routes (`/api/v1/auth`)
| Method | Endpoint        | Description |
|--------|-----------------|-------------|
| POST   | `/register`     | Register a new user (sender/receiver) |
| GET    | `/refresh`      | Get new access token |
| POST   | `/logout`       | Logout user |
| POST   | `/change-password` | Change password (auth required) |
| POST   | `/set-password` | Set password (auth required) |
| GET    | `/google`       | Google login (redirect) |
| GET    | `/google/callback` | Google login callback |

---

### 👤 User Routes (`/api/v1/users`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/register` | Register a new user (Sender/Receiver) |
| GET    | `/` | Get logged-in user info |
| PATCH  | `/` | Update logged-in user info |

---

### 📦 Parcel Routes (`/api/v1/parcels`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST   | `/` | Create new parcel | Sender |
| GET    | `/me` | Get my created parcels | Sender / Receiver |
| GET    | `/incoming` | Get incoming parcels | Receiver |
| POST   | `/cancel/:id` | Cancel my parcel | Sender |
| POST   | `/confirmed/:id` | Confirm received parcel | Receiver |
| GET    | `/status-log/:id` | Get parcel status logs | All Roles |
| GET    | `/:id` | Get my parcel by ID | Sender |
| GET    | `/incoming/:id` | Get my incoming parcel by ID | Receiver |

---

### 🛠 Admin Routes (`/api/v1/admin`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/users` | Get all users |
| GET    | `/parcels` | Get all parcels |
| PATCH  | `/parcels/status/:id` | Update parcel status |
| PATCH  | `/:id` | Update admin info |
| PATCH  | `/user/blocked/:id` | Block a user |
| PATCH  | `/user/unblocked/:id` | Unblock a user |
| PATCH  | `/percel/blocked/:id` | Block a parcel |
| PATCH  | `/percel/unblocked/:id` | Unblock a parcel |

---

## ⚙️ Installation & Setup

```bash
# Clone the repo
git clone <your-repo-url>

# Move into project folder
cd parcel-delivery-backend

# Install dependencies
npm install

# Create a .env file and add environment variables
cp .env.example .env

# Run in development mode
npm run dev

# Build for production
npm run build
