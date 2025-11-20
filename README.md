# VANI AI — AI-Powered E-Commerce Microservice System

VANI AI is an end-to-end, AI-powered e-commerce assistant designed with a scalable **microservices architecture**.  
It provides AI-based product search, natural-language chatbot interactions, multi-service backend orchestration, and vector search using **MongoDB Atlas**.

This project is currently **in active development**.

![Screenshot 2025-11-19 at 1 54 10 PM](https://github.com/user-attachments/assets/b9add2f1-e4a6-4d38-9bd0-050429173da1)


## 🚀 Features

### 🛍️ Intelligent Product Search
- Vector-based semantic search using **MongoDB Atlas Search**  
- Embedding generation using **Google Gemini**  
- Supports natural language queries (“red shoes under ₹2000”, “gaming laptop with SSD”)

### 🤖 AI Chat Assistant
- Multi-turn conversational agent  
- Uses Gemini API for:
  - Query understanding  
  - Product recommendations  
  - Context-aware dialogue  
- Custom prompts + LangChain-based orchestration  
- Independent AI microservice

### 🧩 Microservices Architecture
The system is split into multiple backend services:

| Service | Description |
|--------|-------------|
| **Gateway / API Gateway** | Routes traffic to all services |
| **Product Service** | Product CRUD + vector embedding storage |
| **Auth Service** | JWT-based authentication and user logic |
| **AI Agent Service** | Chatbot / LLM agent using Gemini |
| **Utility Services** | Helper microservices (optional) |

Each service runs independently and communicates over HTTP/REST.

### 📦 Tech Stack
- **Backend:** Node.js, Express, TypeScript  
- **AI:** Google Gemini API, LangChain  
- **Database:** MongoDB Atlas (Vector Search)  
- **Frontend (optional):** React + Tailwind + Redux  
- **Auth:** JWT + Middleware  
- **Architecture:** Microservices + REST APIs  
- **Dev Tools:** Nodemon, ts-node, Postman, GitHub Actions (optional)

---

## 📁 Project Structure

