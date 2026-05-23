

# VANI AI
### AI-Powered E-Commerce Shopping Platform

<br/>

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Site-6366f1?style=for-the-badge)](https://vani-ai-ai-powered-e-commerce-websi-sage.vercel.app)<img width="1404" height="831" alt="Screenshot 2026-05-23 at 3 40 40 PM" src="https://github.com/user-attachments/assets/094d4c32-d757-43c8-91c7-ca416f17a545" />

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

<br/>

> **VANI AI** is a production-grade, AI-powered e-commerce platform built on a scalable microservices architecture.
> It combines intelligent semantic search, a conversational AI assistant, real-time chat,
> and multi-role dashboards — delivering a complete ecosystem for shoppers, sellers, and admins.

**🔗 [vani-ai-ai-powered-e-commerce-websi-sage.vercel.app](https://vani-ai-ai-powered-e-commerce-websi-sage.vercel.app)**

**🚧 Status: Active Development**

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Live Screenshots](#-live-screenshots)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Microservices Architecture](#-microservices-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [User Roles](#-user-roles)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**VANI AI** is an end-to-end e-commerce solution powered by **Google Gemini AI** and **MongoDB Atlas Vector Search**. It goes beyond a traditional online store — it understands natural language queries, enables AI-driven product discovery, and provides a complete ecosystem for **Users**, **Sellers**, and **Admins** to interact on one unified platform.

Key highlights:

| | Feature |
|---|---|
| 🤖 | AI chatbot that understands shopper *intent*, not just keywords |
| 🔍 | Semantic vector search for intelligent product discovery |
| 🏪 | Full seller onboarding with product management and admin approval flow |
| 🛡️ | Admin control panel with moderation, publishing, and user management |
| 💬 | Real-time Admin ↔ Seller chat via WebSockets |
| ⭐ | User review and star rating system |
| 🛒 | End-to-end shopping flow: cart → checkout → Razorpay → order tracking |

---

## 📸 Live Screenshots

> 📌 **All screenshots are from the live deployment at [vani-ai-ai-powered-e-commerce-websi-sage.vercel.app](https://vani-ai-ai-powered-e-commerce-websi-sage.vercel.app)**

---

### 🏠 Landing Page

> AI-enhanced landing page featuring a hero section, category highlights, featured products, and a semantic search bar.

![Landing Page — Hero Section]<img width="1404" height="831" alt="Screenshot 2026-05-23 at 3 42 05 PM" src="https://github.com/user-attachments/assets/599cab72-55e1-44a7-aea0-514b66eb3cb1" />



> ⭐ **Review Highlights** — curated user testimonials displayed on the landing page.

![Landing Page — Reviews Section]<img width="1404" height="831" alt="Screenshot 2026-05-23 at 3 42 19 PM" src="https://github.com/user-attachments/assets/d4fdce28-2ad2-4a0b-95d8-27f3a42e1e5f" />


> 🦶 **Footer**

![Footer]<img width="1404" height="831" alt="Screenshot 2026-05-23 at 3 42 31 PM" src="https://github.com/user-attachments/assets/edc33e74-ab24-496c-a7f1-badca3c04c61" />


---

### 🔐 Authentication

> Secure, role-based login and registration flows for all three user types.

| User Login | User Register |
|:---:|:---:|
| ![Login](./screenshots/login.png)<img width="1406" height="831" alt="Screenshot 2026-05-23 at 3 47 12 PM" src="https://github.com/user-attachments/assets/55d1a655-e92e-4545-b2dd-ee5a132a0d7f" />
<img width="1406" height="831" alt="Screenshot 2026-05-23 at 4 01 54 PM" src="https://github.com/user-attachments/assets/ca863531-0b67-4e90-b34a-f9f45ae8a9c4" />
<img width="1406" height="831" alt="Screenshot 2026-05-23 at 4 02 10 PM" src="https://github.com/user-attachments/assets/5ef58441-ddb7-432f-8d63-86498db5bc42" />
<img width="1406" height="831" alt="Screenshot 2026-05-23 at 4 02 05 PM" src="https://github.com/user-attachments/assets/1a38882c-211f-4c2a-9f5c-c0cf2c293098" />

 | ![Register](./screenshots/register.png) |

---

### 🛍️ Shopping Experience

#### Product Listing & Categories
> Browse all published products with category filters and semantic search.

![Products Page]<img width="1404" height="831" alt="Screenshot 2026-05-23 at 3 40 40 PM" src="https://github.com/user-attachments/assets/ac9efa90-77a7-48ab-bdce-6a8fb0f7706a" />


#### Product Detail & Reviews
> View full product details, images, descriptions, and community reviews.

![Product Detail]<img width="1406" height="831" alt="Screenshot 2026-05-23 at 3 46 26 PM" src="https://github.com/user-attachments/assets/2c72ff4b-3546-4828-aac5-fb1634016d24" />


#### Shopping Cart
> Manage cart items, update quantities, and view the running total.

![Cart]<img width="1406" height="831" alt="Screenshot 2026-05-23 at 3 46 43 PM" src="https://github.com/user-attachments/assets/b29e995a-f801-4863-bc83-83600da3d881" />


#### Checkout Page
> Multi-step checkout with address and order summary confirmation.

![Checkout]<img width="1406" height="831" alt="Screenshot 2026-05-23 at 3 46 43 PM" src="https://github.com/user-attachments/assets/b7e8f164-1b95-4692-a529-8cabad80df9a" />


#### Payment — Razorpay Integration
> Secure payment processing powered by **Razorpay**.

![Payment — Razorpay]<img width="1406" height="831" alt="Screenshot 2026-05-23 at 3 46 51 PM" src="https://github.com/user-attachments/assets/f9d4b6e8-e3ce-41d3-ac44-61628f3b6eb2" />


#### Order Confirmation & Summary
> Instant post-payment order summary with all transaction details.

![Order Summary]<img width="1406" height="831" alt="Screenshot 2026-05-23 at 3 47 06 PM" src="https://github.com/user-attachments/assets/738e8c99-c138-47d9-9887-cdc15d99e1e6" />


#### Order Tracking
> Real-time order status and shipment tracking page.

![Order Tracking]<img width="1406" height="831" alt="Screenshot 2026-05-23 at 3 47 12 PM" src="https://github.com/user-attachments/assets/0ad9a5a0-d409-4ef3-9509-45ce4a93aa8f" />


---

### 🤖 AI Chat Assistant

> Conversational AI powered by **Google Gemini** — understands natural language, recommends products, and helps users find exactly what they need.

![AI Chat Assistant]![Screenshot 2025-11-19 at 1 54 10 PM](https://github.com/user-attachments/assets/b9add2f1-e4a6-4d38-9bd0-050429173da1)

---

### 👤 User Profile

> Manage personal information, view order history, and update account settings.

![User Profile]



---

### 🏪 Seller Dashboard

> A dedicated workspace for sellers to manage their catalogue, track performance, and communicate with the admin.

#### Overview Dashboard
> High-level analytics: total products, pending approvals, and sales metrics.

![Seller Dashboard — Overview]<img width="1404" height="831" alt="Screenshot 2026-05-23 at 3 45 01 PM" src="https://github.com/user-attachments/assets/a511cd3b-aac5-4058-8b66-d6031cb091d7" />


#### My Products
> View, edit, and delete listed products. See approval status (Pending / Published / Blocked) at a glance.

![Seller — My Products]<img width="1406" height="831" alt="Screenshot 2026-05-23 at 3 45 20 PM" src="https://github.com/user-attachments/assets/be59da55-60de-456f-99ac-9b09b2183b7d" />


#### Add / Edit Product
> Upload product images, write descriptions, set pricing, and submit for admin review.

![Seller — Add Product]


#### Chat with Admin
> Real-time in-platform messaging with the admin team for queries, updates, and support.

![Seller — Chat with Admin]<img width="1406" height="831" alt="Screenshot 2026-05-23 at 3 45 46 PM" src="https://github.com/user-attachments/assets/50ca257b-6b93-41de-82ae-3cf05678f7eb" />


#### Seller Login & Registration
| Seller Login | Seller Registration |
|:---:|:---:|
| ![Seller Login]![Uploading Screenshot 2026-05-23 at 4.02.05 PM.png…]()
| ![Seller Register]
|

---

### 🛡️ Admin Dashboard

> Full-platform oversight: moderate listings, manage users, and communicate directly with sellers.

#### Overview Dashboard
> Platform-wide metrics — total users, sellers, products, and revenue.

![Admin Dashboard — Overview]


#### Product Moderation
> Review seller-submitted products and **Approve**, **Block**, or **Publish** them.

![Admin — Product Moderation]


#### Seller Management
> View all registered sellers, their product counts, and block/unblock accounts.

![Admin — Seller Management]


#### User Management
> View all registered users, manage accounts, and block suspicious activity.

![Admin — User Management]


#### Admin Login & Registration
| Admin Login |
|:---:|:---:|
| ![Admin Login]![Uploading Screenshot 2026-05-23 at 4.02.10 PM.png…]()

---

### 💬 Admin ↔ Seller Real-Time Chat

> Seamless WebSocket-based messaging system enabling direct communication between admins and sellers.

![Admin ↔ Seller Chat]<img width="1406" height="831" alt="Screenshot 2026-05-23 at 4 13 09 PM" src="https://github.com/user-attachments/assets/b0e3f36a-fb1b-496f-8cbc-f10a9a9a8866" />


---

## ✨ Features

### 🔍 Intelligent Product Search
- Vector-based semantic search using **MongoDB Atlas Vector Search**
- Embedding generation via **Google Gemini**
- Supports rich natural language queries:
  - *"red shoes under ₹2000"*
  - *"gaming laptop with fast SSD"*
  - *"lightweight jacket for winter"*

### 🤖 AI Chat Assistant
- Multi-turn conversational agent with context memory
- Powered by **Gemini API** for query understanding and product recommendations
- **LangChain**-based orchestration
- Runs as an isolated AI microservice

### 👥 Multi-Role System

#### 🙍 User (Shopper)
- AI-powered product search and browsing
- Cart management and multi-step checkout
- Secure payment via **Razorpay**
- Order confirmation and live tracking
- Post-purchase reviews and star ratings
- Profile management

#### 🏪 Seller
- Dedicated seller account with onboarding
- Add, edit, and manage product listings (subject to admin approval)
- Real-time visibility into product approval status
- In-platform chat with admin
- Seller dashboard with product and order analytics

#### 🛡️ Admin
- Full product moderation: review, approve, block, or publish seller listings
- User and seller account management with block controls
- Real-time messaging with sellers
- Platform-wide analytics dashboard

### 🛒 Complete Shopping Flow
- Category-based browsing with filters
- Product detail pages with images, specs, and reviews
- Cart with quantity controls and live price updates
- Multi-step checkout and address management
- **Razorpay** payment gateway integration
- Order confirmation page with summary
- Order tracking with status updates

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Tailwind CSS, Redux Toolkit |
| **Backend** | Node.js, Express, TypeScript |
| **AI / LLM** | Google Gemini API, LangChain |
| **Database** | MongoDB Atlas (Vector Search + standard collections) |
| **Authentication** | JWT (JSON Web Tokens), Bcrypt |
| **Payment** | Razorpay Payment Gateway |
| **Real-time** | WebSocket / Socket.IO |
| **Architecture** | Microservices + REST APIs |
| **Dev Tools** | Nodemon, ts-node, Postman, Docker |
| **Deployment** | Vercel (Frontend), Docker Compose (Backend) |

---

## 🧩 Microservices Architecture

The backend is split into independently deployable services:

```
┌─────────────────────────────────────────────────────────────┐
│                        API Gateway                          │
│         Routes all incoming traffic to microservices        │
└────────┬────────────────┬──────────────────────┬────────────┘
         │                │                      │
┌────────▼────────┐ ┌─────▼──────────┐ ┌────────▼────────┐
│  Auth Service   │ │Product Service │ │  AI Agent Svc   │
│ JWT + User CRUD │ │ CRUD + Vectors │ │ Gemini + LC     │
└─────────────────┘ └────────────────┘ └─────────────────┘
         │                │                      │
┌────────▼────────┐ ┌─────▼──────────┐ ┌────────▼────────┐
│  Order Service  │ │  Chat Service  │ │ Review Service  │
│Cart+Pay+Tracking│ │ Admin↔Seller   │ │ Ratings + CRUD  │
└─────────────────┘ └────────────────┘ └─────────────────┘
```

| Service | Responsibility |
|---|---|
| **API Gateway** | Routes all incoming traffic to the correct microservice |
| **Auth Service** | User / Seller / Admin registration, login, JWT handling |
| **Product Service** | Product CRUD, image handling, vector embedding storage |
| **AI Agent Service** | Gemini-powered chatbot, semantic search, LangChain orchestration |
| **Order Service** | Cart management, checkout, Razorpay payment, order tracking |
| **Chat Service** | Real-time Admin ↔ Seller messaging via WebSockets |
| **Review Service** | User review and rating creation, retrieval, and moderation |

Each service runs independently and communicates over HTTP/REST or WebSocket.

---

## 📁 Project Structure

```
VANI.AI/
├── client/                          # React Frontend
│   └── src/
│       ├── components/
│       │   ├── Header/
│       │   ├── Footer/
│       │   ├── ProductCard/
│       │   ├── CategoryNav/
│       │   ├── ChatWidget/
│       │   └── ReviewCard/
│       ├── pages/
│       │   ├── LandingPage/
│       │   ├── Auth/
│       │   │   ├── Login.tsx
│       │   │   └── Register.tsx
│       │   ├── Products/
│       │   │   ├── ProductList.tsx
│       │   │   └── ProductDetail.tsx
│       │   ├── Cart/
│       │   ├── Checkout/
│       │   ├── Payment/
│       │   ├── OrderTracking/
│       │   ├── Profile/
│       │   ├── Admin/
│       │   │   ├── AdminDashboard.tsx
│       │   │   ├── AdminProducts.tsx
│       │   │   ├── AdminSellers.tsx
│       │   │   ├── AdminUsers.tsx
│       │   │   └── AdminChat.tsx
│       │   └── Seller/
│       │       ├── SellerDashboard.tsx
│       │       ├── AddProduct.tsx
│       │       ├── ManageProducts.tsx
│       │       └── SellerChat.tsx
│       ├── store/                   # Redux store + slices
│       ├── hooks/
│       ├── utils/
│       └── App.tsx
│
├── server/                          # Backend Microservices
│   ├── gateway/                     # API Gateway
│   ├── auth-service/                # Authentication Service
│   ├── product-service/             # Product Management + Embeddings
│   ├── ai-agent-service/            # AI Chatbot + Semantic Search
│   ├── order-service/               # Cart, Checkout, Payment, Tracking
│   ├── chat-service/                # Admin ↔ Seller Real-time Chat
│   └── review-service/              # Reviews & Ratings
│
├── screenshots/                     # README screenshots
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| [Node.js](https://nodejs.org/) | v18+ |
| [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) | Latest |
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

**Frontend:**
```bash
cd client && npm install
```

**Backend (all services):**
```bash
for service in gateway auth-service product-service ai-agent-service order-service chat-service review-service; do
  cd server/$service && npm install && cd ../..
done
```

Or install each individually:
```bash
cd server/auth-service      && npm install && cd ../..
cd server/product-service   && npm install && cd ../..
cd server/ai-agent-service  && npm install && cd ../..
cd server/order-service     && npm install && cd ../..
cd server/chat-service      && npm install && cd ../..
cd server/review-service    && npm install && cd ../..
cd server/gateway           && npm install && cd ../..
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

See the [Environment Variables](#-environment-variables) section below for all required keys.

### 4. Start All Services

**Option A — Individual terminals:**
```bash
cd server/gateway           && npm run dev
cd server/auth-service      && npm run dev
cd server/product-service   && npm run dev
cd server/ai-agent-service  && npm run dev
cd server/order-service     && npm run dev
cd server/chat-service      && npm run dev
cd server/review-service    && npm run dev
cd client                   && npm run dev
```

**Option B — Docker Compose (recommended):**
```bash
docker-compose up --build
```

### 5. Open the App

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| API Gateway | http://localhost:8000 |

---

## 🔐 Environment Variables

Create a `.env` file at the root and in each service directory:

```env
# ── Database ──────────────────────────────────────────────
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/vani-ai

# ── Authentication ────────────────────────────────────────
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# ── AI ────────────────────────────────────────────────────
GEMINI_API_KEY=your_gemini_api_key

# ── Payment (Razorpay) ────────────────────────────────────
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# ── Service Ports ─────────────────────────────────────────
GATEWAY_PORT=8000
AUTH_SERVICE_PORT=8001
PRODUCT_SERVICE_PORT=8002
AI_AGENT_PORT=8003
ORDER_SERVICE_PORT=8004
CHAT_SERVICE_PORT=8005
REVIEW_SERVICE_PORT=8006

# ── Frontend ──────────────────────────────────────────────
VITE_API_BASE_URL=http://localhost:8000
```

---

## 📡 API Reference

### Auth Endpoints

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| POST | `/api/auth/seller/register` | Register a new seller | Public |
| POST | `/api/auth/seller/login` | Login seller | Public |
| POST | `/api/auth/admin/login` | Login admin | Public |
| GET | `/api/auth/profile` | Get current user profile | Private |
| PUT | `/api/auth/profile` | Update profile information | Private |

### Product Endpoints

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/products` | Get all published products | Public |
| GET | `/api/products/:id` | Get a single product | Public |
| POST | `/api/products` | Add a new product | Seller |
| PUT | `/api/products/:id` | Update a product | Seller |
| DELETE | `/api/products/:id` | Delete a product | Seller / Admin |
| GET | `/api/products/seller/mine` | Get seller's own products | Seller |

### Admin Endpoints

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/admin/products/pending` | Get products pending review | Admin |
| PUT | `/api/admin/products/:id/publish` | Publish a product | Admin |
| PUT | `/api/admin/products/:id/block` | Block a product | Admin |
| GET | `/api/admin/users` | Get all users | Admin |
| PUT | `/api/admin/users/:id/block` | Block a user | Admin |
| GET | `/api/admin/sellers` | Get all sellers | Admin |
| PUT | `/api/admin/sellers/:id/block` | Block a seller | Admin |

### Order, Payment & Tracking Endpoints

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/cart` | Get user's cart | User |
| POST | `/api/cart/add` | Add item to cart | User |
| DELETE | `/api/cart/:itemId` | Remove item from cart | User |
| POST | `/api/orders/checkout` | Create order from cart | User |
| POST | `/api/orders/payment` | Process Razorpay payment | User |
| GET | `/api/orders/summary/:id` | Get order summary | User |
| GET | `/api/orders/track/:id` | Get live order tracking status | User |

### Review Endpoints

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/reviews/:productId` | Get all reviews for a product | Public |
| POST | `/api/reviews/:productId` | Submit a review | User |
| DELETE | `/api/reviews/:id` | Delete a review | User / Admin |

### AI & Chat Endpoints

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/ai/chat` | Send a message to the AI assistant | User |
| GET | `/api/ai/search?q=` | Semantic product search | Public |
| GET | `/api/chat/messages/:sellerId` | Get chat history | Admin / Seller |
| POST | `/api/chat/send` | Send a chat message | Admin / Seller |

---

## 👥 User Roles

### 🙍 User (Shopper)
- Browse, search, and filter products with AI-powered semantic search
- Use the AI chat assistant for personalized recommendations
- Add items to cart and complete multi-step checkout
- Pay securely via **Razorpay** and view order confirmation
- Track live order status from the order tracking page
- Submit product reviews and star ratings
- Manage personal profile and account info

### 🏪 Seller
- Register and maintain a dedicated seller account
- Add and manage product listings (pending admin approval before going live)
- Monitor approval status: Pending / Published / Blocked
- Communicate directly with admin through the built-in real-time chat
- Access a full seller dashboard with product and order analytics
- Upload product images and manage catalogue

### 🛡️ Admin
- Complete platform oversight via the admin dashboard
- Review, approve, block, or publish seller product listings
- Manage user and seller accounts including block/unblock controls
- Real-time chat with sellers for queries and updates
- Monitor platform-wide activity and key metrics

---

## 🗺️ Roadmap

### ✅ Completed
- [x] User / Seller / Admin authentication
- [x] Role-based dashboards for all three roles
- [x] Seller product CRUD with admin moderation flow
- [x] Admin ↔ Seller real-time WebSocket chat
- [x] AI chatbot powered by Google Gemini
- [x] Semantic vector search via MongoDB Atlas
- [x] Full cart, checkout, and Razorpay payment integration
- [x] Order confirmation and order tracking pages
- [x] User reviews and star ratings
- [x] Responsive landing page with hero, reviews, and footer
- [x] User and seller profile pages
- [x] Product detail pages with reviews
- [x] Vercel deployment (frontend)

### 🔜 Upcoming
- [ ] Email notifications (order confirmation, review alerts)
- [ ] Seller analytics dashboard with revenue charts
- [ ] Mobile app (React Native)
- [ ] CI/CD pipeline with GitHub Actions
- [ ] Full Docker + cloud deployment (Railway / Render / AWS)
- [ ] Wishlist / Save for Later functionality
- [ ] Advanced search filters (price range, category, rating)

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit** your changes following [Conventional Commits](https://www.conventionalcommits.org/)
   ```bash
   git commit -m "feat: add your feature description"
   ```
4. **Push** to your branch
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open** a Pull Request

Please ensure your code passes existing tests and follows the project's TypeScript style guidelines.

---

## 📄 License

This project is licensed under the **MIT License**.
See the [LICENSE](./LICENSE) file for full details.

---

## 👨‍💻 Author

**Prathit** — [GitHub @Prathit6](https://github.com/Prathit6)

<div align="center">

🔗 **[Live Demo → vani-ai-ai-powered-e-commerce-websi-sage.vercel.app](https://vani-ai-ai-powered-e-commerce-websi-sage.vercel.app)**

<br/>

⭐ **If you found this project helpful, please give it a star!** ⭐

<br/>

Built with ❤️ using React · Node.js · TypeScript · Google Gemini AI · MongoDB Atlas · Razorpay

</div>
