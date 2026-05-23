<div align="center">

# VANI AI
### AI-Powered E-Commerce Shopping Platform

<br/>

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_Site-6366f1?style=for-the-badge)](https://vani-ai-ai-powered-e-commerce-websi-sage.vercel.app)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

<br/>

**VANI AI** is a production-grade, AI-powered e-commerce platform built on a scalable microservices architecture.  
It combines intelligent semantic search, a conversational AI assistant, real-time chat,  
and multi-role dashboards — delivering a complete ecosystem for shoppers, sellers, and admins.

**[vani-ai-ai-powered-e-commerce-websi-sage.vercel.app](https://vani-ai-ai-powered-e-commerce-websi-sage.vercel.app)**

**Status: Active Development**

</div>

---

## Table of Contents

- [Overview](#overview)
- [Screenshots](#screenshots)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [User Roles](#user-roles)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

VANI AI is an end-to-end e-commerce solution powered by **Google Gemini AI** and **MongoDB Atlas Vector Search**. It goes beyond a traditional online store — understanding natural language queries, enabling AI-driven product discovery, and providing a unified platform for **Users**, **Sellers**, and **Admins**.

| Feature | Description |
|---|---|
| AI Assistant | Chatbot that understands shopper intent, not just keywords |
| Semantic Search | Vector-based product discovery via natural language |
| Seller Onboarding | Full product management with admin approval workflow |
| Admin Panel | Moderation, publishing, and account management controls |
| Real-Time Chat | Admin and Seller communication via WebSockets |
| Reviews | User review and star rating system |
| Shopping Flow | Cart → Checkout → Razorpay → Order Tracking |

---

## Screenshots

All screenshots are from the live deployment at [vani-ai-ai-powered-e-commerce-websi-sage.vercel.app](https://vani-ai-ai-powered-e-commerce-websi-sage.vercel.app).

---

### Landing Page

AI-enhanced landing page featuring a hero section, category highlights, featured products, and a semantic search bar.

<img width="1404" height="831" alt="Landing Page Hero" src="https://github.com/user-attachments/assets/599cab72-55e1-44a7-aea0-514b66eb3cb1" />

<br/>

**Review Highlights** — curated user testimonials displayed on the landing page.

<img width="1404" height="831" alt="Landing Page Reviews" src="https://github.com/user-attachments/assets/d4fdce28-2ad2-4a0b-95d8-27f3a42e1e5f" />
<img width="1406" height="831" alt="Screenshot 2026-05-23 at 5 09 03 PM" src="https://github.com/user-attachments/assets/0a4a1dd2-7251-42f8-b1e4-967f9306e54d" />

<br/>

**Footer**

<img width="1404" height="831" alt="Footer" src="https://github.com/user-attachments/assets/edc33e74-ab24-496c-a7f1-badca3c04c61" />

---

### Authentication

Secure, role-based login and registration flows for all three user types.

<img width="1406" height="831" alt="User Login" src="https://github.com/user-attachments/assets/55d1a655-e92e-4545-b2dd-ee5a132a0d7f" />

---

### Shopping Experience

#### Product Listing & Categories

Browse all published products with category filters and semantic search.

<img width="1404" height="831" alt="Product Listing" src="https://github.com/user-attachments/assets/ac9efa90-77a7-48ab-bdce-6a8fb0f7706a" />

#### Product Detail & Reviews

View full product details, images, descriptions, and community reviews.

<img width="1406" height="831" alt="Product Detail" src="https://github.com/user-attachments/assets/2c72ff4b-3546-4828-aac5-fb1634016d24" />

#### Shopping Cart

Manage cart items, update quantities, and view the running total.

<img width="1406" height="831" alt="Cart" src="https://github.com/user-attachments/assets/b29e995a-f801-4863-bc83-83600da3d881" />

#### Checkout

Multi-step checkout with address entry and order summary confirmation.

<img width="1406" height="831" alt="Checkout" src="https://github.com/user-attachments/assets/b7e8f164-1b95-4692-a529-8cabad80df9a" />

#### Payment — Razorpay Integration

Secure payment processing powered by Razorpay.

<img width="1406" height="831" alt="Razorpay Payment" src="https://github.com/user-attachments/assets/f9d4b6e8-e3ce-41d3-ac44-61628f3b6eb2" />

#### Order Confirmation & Summary

Instant post-payment order summary with full transaction details.

<img width="1406" height="831" alt="Order Summary" src="https://github.com/user-attachments/assets/738e8c99-c138-47d9-9887-cdc15d99e1e6" />

#### Order Tracking

Real-time order status and shipment tracking.

<img width="1406" height="831" alt="Order Tracking" src="https://github.com/user-attachments/assets/0ad9a5a0-d409-4ef3-9509-45ce4a93aa8f" />

---

### AI Chat Assistant

Conversational AI powered by Google Gemini — understands natural language, recommends products, and helps users find exactly what they need.

![AI Chat Assistant](https://github.com/user-attachments/assets/b9add2f1-e4a6-4d38-9bd0-050429173da1)

---

### User Profile

Manage personal information, view order history, and update account settings.

<img width="1404" height="831" alt="User Profile" src="https://github.com/user-attachments/assets/7ed3de40-a6dd-4466-bbdb-ee2b6e226365" />

---

### Seller Dashboard

A dedicated workspace for sellers to manage their catalogue, track performance, and communicate with the admin team.

#### Overview

High-level analytics: total products, pending approvals, and sales metrics.

<img width="1404" height="831" alt="Seller Dashboard Overview" src="https://github.com/user-attachments/assets/a511cd3b-aac5-4058-8b66-d6031cb091d7" />

#### My Products

View, edit, and delete listed products. Approval status (Pending / Published / Blocked) is visible at a glance.

<img width="1406" height="831" alt="Seller My Products" src="https://github.com/user-attachments/assets/be59da55-60de-456f-99ac-9b09b2183b7d" />

#### Add / Edit Product

Upload product images, write descriptions, set pricing, and submit for admin review.

<img width="1406" height="831" alt="Add Product" src="https://github.com/user-attachments/assets/b15fe8c2-da99-4a04-abb3-8c2474292cd7" />

#### Chat with Admin

Real-time in-platform messaging with the admin team for queries, updates, and support.

<img width="1406" height="831" alt="Seller Chat with Admin" src="https://github.com/user-attachments/assets/50ca257b-6b93-41de-82ae-3cf05678f7eb" />

**Demo Conversation — Seller and Admin**

| | Message |
|---|---|
| **Seller** | Hi, I just submitted 3 new products. Can you please review them? It's been 2 days. |
| **Admin** | Hi! I can see them. Let me check right now. |
| **Admin** | Reviewed all 3. Two are approved and live on the platform. The third — "Wireless Earbuds Pro X" — has been blocked. |
| **Seller** | Why was it blocked? |
| **Admin** | The product images are blurry and the description contains unverified claims. Please provide clear images (min 800×800px), accurate technical specifications, and remove any misleading statements. |
| **Seller** | Got it. Should I delete and re-add the product or just edit it? |
| **Admin** | Just edit the existing listing and resubmit — it will come back to us for review automatically. |
| **Seller** | Done. I've updated everything. Please check when you get a chance. |
| **Admin** | Looks much better. Approved — it's now live on the platform. Note: products with 4+ images and detailed specs consistently see higher conversion. |
| **Seller** | That's great to know, thank you. One more question — can I set a discount for the upcoming sale? |
| **Admin** | Yes. Go to My Products → Edit → Pricing and enter a sale price. The original price will appear with a strikethrough automatically. |
| **Seller** | Perfect. Thanks for the help. |
| **Admin** | Anytime. Best of luck with your sales. |

#### Seller Login & Registration

| Login | Registration |
|:---:|:---:|
| <img width="1470" height="956" alt="Seller Login" src="https://github.com/user-attachments/assets/4bdaa3cf-4336-4dd3-ac9b-2c21dc9a01be" /> | <img width="1406" height="831" alt="Seller Register" src="https://github.com/user-attachments/assets/85ecdb59-3093-40d1-8dab-333257d6aa3c" /> |

---

### Admin Dashboard

Full-platform oversight: moderate listings, manage users and sellers, and communicate directly with sellers.

#### Overview

Platform-wide metrics — total users, sellers, products, and revenue.

<img width="1404" height="831" alt="Admin Dashboard Overview" src="https://github.com/user-attachments/assets/8f5967c8-5095-42f3-96d1-54403aa25a1c" />

#### Product Moderation

Review seller-submitted products and Approve, Block, or Publish them.

<img width="1404" height="831" alt="Admin Product Moderation" src="https://github.com/user-attachments/assets/610059c2-c37b-4fbc-84f6-9b361b9186bc" />

#### Seller Management

View all registered sellers, their product counts, and block or unblock accounts.

<img width="1404" height="831" alt="Admin Seller Management" src="https://github.com/user-attachments/assets/37adb4a3-1bec-4b75-9e20-567a4756e8b9" />

#### User Management

View all registered users, manage accounts, and block suspicious activity.

<img width="1404" height="831" alt="Admin User Management" src="https://github.com/user-attachments/assets/d03cb094-3566-4a9d-a5a4-9f3dd017024d" />

#### Admin Login

<img width="1406" height="831" alt="Admin Login" src="https://github.com/user-attachments/assets/7cc355e6-f0e5-4b1b-8a77-bcb231b35ac0" />

---

### Admin and Seller Real-Time Chat

Seamless WebSocket-based messaging system enabling direct communication between admins and sellers.

<img width="1406" height="831" alt="Admin Seller Chat" src="https://github.com/user-attachments/assets/b0e3f36a-fb1b-496f-8cbc-f10a9a9a8866" />

---

## Features

### Intelligent Product Search
- Vector-based semantic search using MongoDB Atlas Vector Search
- Embedding generation via Google Gemini
- Supports natural language queries such as *"red shoes under ₹2000"*, *"gaming laptop with fast SSD"*, or *"lightweight jacket for winter"*

### AI Chat Assistant
- Multi-turn conversational agent with context memory
- Powered by Gemini API for query understanding and product recommendations
- LangChain-based orchestration via `agent.ts`
- Runs as an isolated TypeScript service (`chat-backend`)

### Multi-Role System

**User (Shopper)**
- AI-powered product search and browsing
- Cart management and multi-step checkout
- Secure payment via Razorpay
- Order confirmation and live tracking
- Post-purchase reviews and star ratings
- Profile management

**Seller**
- Dedicated seller account with onboarding
- Add, edit, and manage product listings subject to admin approval
- Real-time visibility into product approval status
- In-platform chat with admin
- Seller dashboard with product and order analytics

**Admin**
- Full product moderation: review, approve, block, or publish seller listings
- User and seller account management with block controls
- Real-time messaging with sellers
- Platform-wide analytics dashboard

### Complete Shopping Flow
- Category-based browsing with filters
- Product detail pages with images, specifications, and reviews
- Cart with quantity controls and live price updates
- Multi-step checkout and address management
- Razorpay payment gateway integration
- Order confirmation with full summary
- Order tracking with live status updates

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend (Main) | React 18, Vite, TypeScript, Tailwind CSS, Redux Toolkit |
| Frontend (Admin) | React 18, Vite, JavaScript, Tailwind CSS |
| Main Backend | Node.js, Express, JavaScript, MongoDB |
| Product Backend | Node.js, Express, JavaScript, MongoDB, SQLite |
| AI / Chat Backend | TypeScript, Google Gemini API, LangChain, Node.js |
| Database | MongoDB Atlas, SQLite |
| Authentication | JWT, Bcrypt |
| Payment | Razorpay |
| Real-time | WebSocket / Socket.IO |
| Architecture | Microservices + REST APIs |
| Dev Tools | Nodemon, Postman, ts-node |
| Deployment | Vercel (Frontend), Node.js (Backend services) |

---

## Architecture

The platform is composed of four independently running services plus a React frontend:

```
┌─────────────────────────────────────────────────────────────────────┐
│                     dashboard  (React + Vite)                       │
│              Main frontend — User, Seller, Admin UI                 │
└────────┬──────────────────┬───────────────────────┬─────────────────┘
         │                  │                       │
┌────────▼────────┐ ┌───────▼────────┐ ┌───────────▼──────────┐
│  main-backend   │ │product-backend │ │    chat-backend       │
│  Node.js/Express│ │Node.js/Express │ │  TypeScript + Gemini  │
│  Auth, Orders,  │ │Products, Images│ │  AI Agent, LangChain  │
│  Cart, Reviews  │ │Seller Mgmt     │ │  Semantic Search      │
└─────────────────┘ └────────────────┘ └──────────────────────┘
         │                  │
    MongoDB Atlas       MongoDB +
                         SQLite
```

| Service | Language | Responsibility |
|---|---|---|
| `dashboard` | React + TypeScript | Main frontend for all user roles |
| `main-backend` | Node.js / JavaScript | Auth, orders, cart, reviews, user management |
| `product-backend` | Node.js / JavaScript | Product CRUD, image handling, seller management |
| `chat-backend` | TypeScript | AI agent, Gemini-powered chat, semantic search, data seeding |

---

## Project Structure

```
Ecommerce/
│
├── dashboard/                        # React Frontend (Vite)
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── vercel.json
│   └── package.json
│
├── main-backend/                     # Core API — Auth, Orders, Cart, Reviews
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── product-backend/                  # Product & Seller Management API
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── images/
│   ├── defaultData/
│   ├── backend/
│   ├── auth_server.js
│   ├── server.js
│   ├── database.sqlite
│   └── package.json
│
├── chat-backend/                     # AI Agent & Chat Service (TypeScript)
│   ├── data/
│   ├── agent.ts                      # LangChain AI agent
│   ├── index.ts                      # Service entry point
│   ├── seed-database.ts
│   ├── seed-ecommerce-data.ts
│   ├── seed-real-products.ts
│   ├── products.json
│   ├── tsconfig.json
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| [Node.js](https://nodejs.org/) | v18+ |
| [npm](https://www.npmjs.com/) | Latest |
| [MongoDB Atlas](https://www.mongodb.com/atlas) | With Vector Search enabled |
| [Google Gemini API Key](https://aistudio.google.com/app/apikey) | Active key |
| [Razorpay Account](https://razorpay.com/) | Key ID + Secret |
| [Git](https://git-scm.com/) | Latest |

### 1. Clone the Repository

```bash
git clone https://github.com/Prathit6/VANI.AI-AI-powered-e-commerce-Website.git
cd VANI.AI-AI-powered-e-commerce-Website
```

### 2. Install Dependencies

Each service has its own `package.json`. Install them individually:

```bash
# Frontend
cd dashboard && npm install && cd ..

# Main backend
cd main-backend && npm install && cd ..

# Product backend
cd product-backend && npm install && cd ..

# Chat / AI backend
cd chat-backend && npm install && cd ..
```

### 3. Configure Environment Variables

Create a `.env` file inside each service directory. See the [Environment Variables](#environment-variables) section for all required keys.

### 4. Seed the Database (optional)

The `chat-backend` includes seed scripts to populate initial product data:

```bash
cd chat-backend

# Seed base database
npx ts-node seed-database.ts

# Seed e-commerce product data
npx ts-node seed-ecommerce-data.ts

# Seed real product listings
npx ts-node seed-real-products.ts
```

### 5. Start All Services

Open four separate terminal windows and run each service:

```bash
# Terminal 1 — Main Backend
cd main-backend && npm run dev

# Terminal 2 — Product Backend
cd product-backend && npm run dev

# Terminal 3 — Chat / AI Backend
cd chat-backend && npm run dev

# Terminal 4 — Frontend
cd dashboard && npm run dev
```

### 6. Open the App

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Main Backend | http://localhost:8000 |
| Product Backend | http://localhost:8001 |
| Chat / AI Backend | http://localhost:8002 |

---

## Environment Variables

Create a `.env` file inside each relevant service directory:

**`main-backend/.env`**
```env
# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/vani-ai

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Payment
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Server
PORT=8000
```

**`product-backend/.env`**
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/vani-products
JWT_SECRET=your_jwt_secret_key
PORT=8001
```

**`chat-backend/.env`**
```env
# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# MongoDB Atlas (Vector Search)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/vani-ai

PORT=8002
```

**`dashboard/.env`**
```env
VITE_MAIN_API_URL=http://localhost:8000
VITE_PRODUCT_API_URL=http://localhost:8001
VITE_CHAT_API_URL=http://localhost:8002
```

---

## API Reference

### Auth (main-backend)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/profile` | Get current user profile | Private |
| PUT | `/api/auth/profile` | Update profile information | Private |

### Products (product-backend)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/products` | Get all published products | Public |
| GET | `/api/products/:id` | Get a single product | Public |
| POST | `/api/products` | Add a new product | Seller |
| PUT | `/api/products/:id` | Update a product | Seller |
| DELETE | `/api/products/:id` | Delete a product | Seller / Admin |
| GET | `/api/products/seller/mine` | Get seller's own products | Seller |

### Admin (product-backend)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/admin/products/pending` | Get products pending review | Admin |
| PUT | `/api/admin/products/:id/publish` | Publish a product | Admin |
| PUT | `/api/admin/products/:id/block` | Block a product | Admin |
| GET | `/api/admin/users` | Get all users | Admin |
| PUT | `/api/admin/users/:id/block` | Block a user | Admin |
| GET | `/api/admin/sellers` | Get all sellers | Admin |
| PUT | `/api/admin/sellers/:id/block` | Block a seller | Admin |

### Orders, Payment & Tracking (main-backend)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/cart` | Get user's cart | User |
| POST | `/api/cart/add` | Add item to cart | User |
| DELETE | `/api/cart/:itemId` | Remove item from cart | User |
| POST | `/api/orders/checkout` | Create order from cart | User |
| POST | `/api/orders/payment` | Process Razorpay payment | User |
| GET | `/api/orders/summary/:id` | Get order summary | User |
| GET | `/api/orders/track/:id` | Get live order tracking status | User |

### Reviews (main-backend)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/reviews/:productId` | Get all reviews for a product | Public |
| POST | `/api/reviews/:productId` | Submit a review | User |
| DELETE | `/api/reviews/:id` | Delete a review | User / Admin |

### AI & Chat (chat-backend)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/ai/chat` | Send a message to the AI assistant | User |
| GET | `/api/ai/search?q=` | Semantic product search | Public |
| GET | `/api/chat/messages/:sellerId` | Get chat history | Admin / Seller |
| POST | `/api/chat/send` | Send a chat message | Admin / Seller |

---

## User Roles

### User (Shopper)
- Browse, search, and filter products with AI-powered semantic search
- Use the AI chat assistant for personalized recommendations
- Add items to cart and complete multi-step checkout
- Pay securely via Razorpay and view order confirmation
- Track live order status from the order tracking page
- Submit product reviews and star ratings
- Manage personal profile and account information

### Seller
- Register and maintain a dedicated seller account
- Add and manage product listings pending admin approval before going live
- Monitor approval status: Pending / Published / Blocked
- Communicate directly with admin through built-in real-time chat
- Access a full seller dashboard with product and order analytics
- Upload product images and manage catalogue

### Admin
- Complete platform oversight via the admin dashboard
- Review, approve, block, or publish seller product listings
- Manage user and seller accounts including block and unblock controls
- Real-time chat with sellers for queries and updates
- Monitor platform-wide activity and key metrics

---

## Roadmap

### Completed

- [x] User, Seller, and Admin authentication
- [x] Role-based dashboards for all three roles
- [x] Seller product CRUD with admin moderation flow
- [x] Admin and Seller real-time WebSocket chat
- [x] AI chatbot powered by Google Gemini
- [x] Semantic vector search via MongoDB Atlas
- [x] Full cart, checkout, and Razorpay payment integration
- [x] Order confirmation and order tracking pages
- [x] User reviews and star ratings
- [x] Responsive landing page with hero, reviews, and footer
- [x] User and seller profile pages
- [x] Product detail pages with reviews
- [x] Vercel deployment (frontend)

### Upcoming

- [ ] Email notifications for order confirmation and review alerts
- [ ] Seller analytics dashboard with revenue charts
- [ ] Mobile application (React Native)
- [ ] CI/CD pipeline with GitHub Actions
- [ ] Full cloud deployment (Railway / Render / AWS)
- [ ] Wishlist and Save for Later functionality
- [ ] Advanced search filters (price range, category, rating)

---

## Contributing

Contributions are welcome. To get started:

1. Fork the repository
2. Create a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org/)
   ```bash
   git commit -m "feat: add your feature description"
   ```
4. Push to your branch
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request

Please ensure your code follows the project's style guidelines and that all services start cleanly before submitting.

---

## License

This project is licensed under the **MIT License**.  
See the [LICENSE](./LICENSE) file for full details.

---

## Author

**Prathit** — [github.com/Prathit6](https://github.com/Prathit6)

<div align="center">

**[Live Demo → vani-ai-ai-powered-e-commerce-websi-sage.vercel.app](https://vani-ai-ai-powered-e-commerce-websi-sage.vercel.app)**

<br/>

If you found this project helpful, please consider giving it a star.

<br/>

Built with React · Node.js · TypeScript · Google Gemini AI · MongoDB Atlas · Razorpay

</div>
