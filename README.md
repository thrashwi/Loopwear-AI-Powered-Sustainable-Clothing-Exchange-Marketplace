# 🌿 Loopwear — AI-Powered Sustainable Clothing Exchange Marketplace

> **Swap wardrobes, not cash.** An intelligent, circular fashion barter platform that empowers users to trade pre-loved clothes directly with AI-assisted fairness checks, automated listing copywriting, multi-item bundling, photo recognition, and real-time negotiation coaching.

---

## 🌟 Complete AI Capabilities Overview

```
                                  LOOPWEAR AI SUITE
                                          │
        ┌───────────────────┬─────────────┴─────────────┬───────────────────┐
        │                   │                           │                   │
        ▼                   ▼                           ▼                   ▼
 📝 Feature 1:        ⚖️ Feature 2:               💬 Feature 3:        🔍 Feature 4:
 AI Description &     AI Fair Swap Evaluator      AI Negotiation       AI Photo Scanner
 Valuation Generator  (with Multi-Item Bundling)  Assistant (Chat)     & Classifier
```

### 1. 📝 AI Clothing Description & Valuation Generator
- **Location:** Listing Creation (`/create-listing` modal)
- **Endpoint:** `POST /api/ai/generate-description`
- **What it does:** Generates a professional listing title, engaging styling copy, market valuation (₹), and tags based on garment brand, category, condition, and user notes.

### 2. ⚖️ AI Fair Swap Evaluator (with Multi-Item Bundle Support!)
- **Location:** Swap Proposal Modal (`/propose-swap`)
- **Endpoint:** `POST /api/ai/evaluate-swap`
- **What it does:** 
  - Allows users to select **1 or multiple wardrobe items** to bundle into an offer.
  - Dynamically calculates the combined equity vs the target item (e.g., ₹1,600 Hoodie + ₹800 Top = ₹2,400 vs ₹2,500 Jacket).
  - Emits real-time fairness badges: 🟢 **Fair Swap**, 🟡 **Slightly Unbalanced**, or 🔴 **Unbalanced** with custom AI tips.

### 3. 💬 AI Negotiation Assistant
- **Location:** Real-Time Swap Negotiation Chat (`My Swaps`)
- **Endpoint:** `POST /api/ai/suggest-counteroffer`
- **What it does:** Displays clickable **AI suggestion chips** above the message composer tailored to the exact items and equity gap, allowing users to propose bundles or finalize meetups with zero awkwardness.

### 4. 🔍 AI Photo Scanner & Classifier
- **Location:** Listing Creation Photo Uploader
- **Endpoint:** `POST /api/ai/classify-image`
- **What it does:** Analyzes the garment image URL/photo to identify category, likely brand, garment style (e.g., *Classic Denim Trucker Jacket*), color wash, and condition with confidence scoring.

### 5. ♻️ Interactive AI Sustainability & Lifecycle Estimator
- **Location:** Eco Impact Dashboard
- **Endpoint:** `POST /api/ai/sustainability-calc`
- **What it does:** Allows users to pick any garment type and fabric material to calculate personalized water conservation in liters and carbon offset in kg.

---

## 🏗️ Architecture & Technology Stack

- **Frontend:**
  - **React 18** (Vite bundler)
  - **Tailwind CSS** (Custom sustainable forest & sage palette)
  - **Lucide Icons**
  - **Socket.IO Client** (Real-time live messaging)
- **Backend:**
  - **Node.js & Express.js**
  - **Socket.IO Server** (Rooms, real-time message broadcasting)
  - **CORS & JSON Middleware**
- **AI Integration:**
  - **Google Gemini API** (`gemini-1.5-flash`) on the backend
  - **Zero-Key Heuristic Fallback Engine:** If `GEMINI_API_KEY` is omitted, Loopwear seamlessly activates its built-in rule-based valuation & copywriting engine so demos never crash or error out during presentations!
- **Data Persistence:**
  - High-fidelity pre-seeded in-memory store with realistic users, items, and swap proposals.
  - Multi-user demo switcher in the navigation bar (switch effortlessly between **Rahul Sharma**, **Ananya Verma**, and **Priya Patel** to demonstrate two-way barter proposals locally).

---

## 🚀 How to Run the Application

### Option A: One Command (Root Workspace)
In this directory, simply run:
```bash
npm run dev
```
*(Runs both Express backend on port 5000 and Vite React client on port 5173 via concurrently)*

### Option B: One-Click Windows Script
Double-click:
```bash
start-dev.bat
```
*(or run `powershell ./start-dev.ps1`)*

### Access Points:
- **Frontend Web UI:** `http://localhost:5173`
- **Backend REST API & Socket.IO:** `http://localhost:5000`

---

## 🔑 Activating Live Google Gemini AI (Optional)
In `server/.env`, paste your Gemini API key:
```env
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=loopwear_super_secret_jwt_key_2026
GEMINI_API_KEY=your_actual_gemini_api_key_here
```
Then restart the server. The server log will display:
```
🤖 AI Status: Gemini API Connected
```
