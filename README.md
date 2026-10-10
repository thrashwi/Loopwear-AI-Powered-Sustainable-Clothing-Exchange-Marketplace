# Loopwear – AI-Powered Sustainable Clothing Exchange Marketplace

**A Full-Stack Circular Fashion Platform with Direct 1-to-1 Barter, Real-Time Negotiation Chat, and Multi-Pillar Generative AI.**

*Prepared for Unified Mentor Project Evaluation*  
*Developer: Thrashwi Naik*  
*Repository: [thrashwi/Loopwear-AI-Powered-Sustainable-Clothing-Exchange-Marketplace](https://github.com/thrashwi/Loopwear-AI-Powered-Sustainable-Clothing-Exchange-Marketplace)*

---

## 🌟 Executive Summary & Concept

Fast fashion leads to excessive garment disposal, textile waste, and environmental depletion. Millions of wearable, high-quality clothes sit idle in closets simply because consumers lack a convenient, equitable channel for circular exchange.

**Loopwear** is an AI-powered sustainable clothing marketplace dedicated entirely to **cashless barter exchanges**. Users list pre-loved garments, discover nearby wardrobes, evaluate trade fairness using artificial intelligence, negotiate terms via real-time Socket.IO chat, and complete direct swaps—diverting garments from landfills while cutting carbon and water footprints.

---

## 🏗️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6, Lucide React, Socket.IO Client |
| **Backend** | Node.js, Express.js, Socket.IO, Multer, Bcryptjs, JSONWebToken, CORS |
| **Database** | Persistent Storage Engine with dual MongoDB (Mongoose) + Atomic JSON Store (`store.json`) |
| **AI Integration** | Google Gemini 1.5 Flash API + Built-in Smart Heuristic Fallback Engine (Zero-Key Demo Ready) |
| **Testing** | Automated End-to-End Test Suite (`server/test-suite.js` - 20 passing test specs) |

---

## 📱 Complete Application Pages

Loopwear provides an interconnected web application with multi-page routing and quick overlay modals:

1. **Page 1: Landing Page (`/`)**
   - Hero section: *"Swap Wardrobes, Not Cash."*
   - Interactive 3-step lifecycle breakdown (List, Match with AI, Swap & Save).
   - Live featured clothing catalog spotlight.
   - Three pillars of AI technology explanation.
   - Environmental savings counters and direct CTA navigation.

2. **Page 2: Login Page (`/login`)**
   - Professional credential authentication (Email/Username + Password).
   - Show/hide password toggle and Remember-Me persistence.
   - Server-enforced bcrypt verification and JWT generation.
   - One-Click Quick Demo Persona autofill buttons for rapid evaluator testing.

3. **Page 3: Registration Page (`/register`)**
   - Form fields: Full name, username, email, location/city, password, confirm password, and terms checkbox.
   - Client and server-side validation, duplicate rejection, and password strength requirements.
   - Automatic account activation and redirect.

4. **Page 4: User Dashboard (`/dashboard`)**
   - Live authorized metrics: Active listings, incoming offers, outgoing offers, pending requests, completed swaps.
   - Real-time personal sustainability score (kg of CO₂ avoided, liters of water saved, garments diverted).
   - My Wardrobe quick management cards.
   - Recent swap proposals with instant accept/reject/manage actions.
   - Recent messages preview.
   - Location-aware recommended and nearby clothing discoveries.

5. **Page 5: Clothing Listings Page (`/listings`)**
   - Responsive card layout with image, brand, title, size, condition, estimated barter value, location, and owner info.
   - Live keyword search across titles, brands, and tags.
   - Multi-criteria filter drawer: Category, Size, Condition, Brand, City / Locality.
   - Sorting by Newest, Oldest, Price (Low to High), Price (High to Low).
   - Dedicated "View Details" and "Propose Swap" actions.

6. **Page 6: Clothing Item Details Page (`/listings/:id`)**
   - Multi-photo gallery preview with status badges (`available`, `reserved`, `swapped`).
   - Garment attributes breakdown (Size, Category, Condition, Color, Brand).
   - AI estimated barter valuation badge.
   - Owner profile card with rating, completed swaps, and location.
   - Garment environmental impact card.
   - Propose Barter Swap button, Start Conversation button, and Report Listing modal.
   - "More from this wardrobe" catalog showcase.

7. **Page 7: Create Listing (`/create-listing`) & My Wardrobe (`/my-listings`)**
   - Form for publishing pre-loved garments with image URL or local file upload via Multer.
   - **Feature A Integration:** *Generate with AI* button synthesizes title, description, and suggested valuation.
   - **Feature D Integration:** *Scan Photo with AI* auto-classifies category, brand, and color.
   - My Wardrobe view allows owners to toggle item availability, edit details, or permanently delete listings.

8. **Page 8: Swap Requests & Management (`/swaps`)**
   - Full exchange lifecycle state machine: `pending` ➔ `counteroffered` ➔ `accepted` ➔ `completed` / `rejected` / `cancelled`.
   - Incoming Offers, Outgoing Proposals, and Completed History tabs.
   - Visual comparison: Offered items (single or multi-item bundle) vs Requested item.
   - Embedded AI Fair Swap Evaluator card (Fairness verdict, score, value difference, negotiation advice).
   - Recipient actions: Accept (atomically reserves items to prevent conflicting swaps), Decline, Counteroffer.
   - Requester actions: Cancel pending offer.
   - Exchange completion: Participants mark complete to finalize exchange and increment personal and platform sustainability scores.

9. **Page 9: Negotiation Chat (`/chat` & `/chat/:conversationId`)**
   - Dual-pane layout: Conversation list on the left, active chat room on the right.
   - Real-time delivery with Socket.IO room subscriptions.
   - Active swap context banner showing offered items and current status.
   - **Feature C Integration:** AI Negotiation Assistant panel suggests tailored counteroffer and logistics phrasing chips; clicking any chip inserts it directly into the composer.

10. **Page 10: User Profile & History (`/profile`)**
    - Profile editor for display name, city/location, and avatar.
    - Lifetime sustainability achievements (Carbon offset, water preserved, garments diverted).
    - Chronological completed swaps history.
    - Secure session logout.

11. **Page 11: Admin Portal (`/admin`)**
    - Server-enforced role-based access control (`role === 'admin'`).
    - Platform-wide analytics: Registered users, marketplace garments, completed swaps, total emissions prevented.
    - User Management: View users and suspend or reactivate accounts.
    - Content Moderation: View and remove inappropriate listings.
    - Dispute & Reports Management: Review community-submitted reports and mark them resolved or dismissed.
    - Administrative audit log timeline.

---

## 🤖 5 Core AI Features

Loopwear includes multi-pillar AI functionality powered by the Google Gemini API with smart heuristic fallbacks:

| Feature | Endpoint | Description |
| :--- | :--- | :--- |
| **A. AI Listing Description & Valuation** | `POST /api/ai/generate-description` | Generates appealing title, 2–3 sentence styling description, tags, and suggested barter value based on brand, category, condition, and user notes. |
| **B. AI Fair Swap Evaluator** | `POST /api/ai/evaluate-swap` | Compares requested and offered garment values (including multi-item bundles), computes fairness scores (0–100), and provides parity recommendations. |
| **C. AI Negotiation Assistant** | `POST /api/ai/suggest-counteroffer` | Produces polite counteroffer proposals, bundle suggestions, and logistics messages that swappers can insert into chat. |
| **D. AI Photo Scanner** | `POST /api/ai/classify-image` | Scans garment photos to identify probable category, color, silhouette style, and estimated condition. |
| **E. AI Sustainability Calculator** | `POST /api/ai/sustainability-calc` | Calculates exact freshwater liters saved, CO₂ kilograms avoided, and landfill diversion estimates based on garment material and type. |

> **Zero-Key Demo Fallback:** If `GEMINI_API_KEY` is not provided in `.env`, the application automatically activates its built-in rule-based valuation and description heuristics so that all features remain 100% testable out-of-the-box.

---

## 🔐 Security & Access Control

- **Password Security:** Passwords hashed with `bcryptjs` (salt rounds: 10). Plaintext passwords are never stored or logged.
- **Token-Based Authentication:** Signed JWT tokens with 7-day expiration.
- **Server-Side Authorization:** Middleware enforces user ownership before listing updates, deletions, or swap cancellations.
- **Role-Based Access Control (RBAC):** Admin endpoints (`/api/admin/*`) strictly reject non-admin users with `403 Forbidden`.
- **Item Reservation Guard:** Accepting a swap proposal reserves both garments immediately, preventing race conditions or conflicting accepted trades.
- **Sanitized Responses:** Sensitive fields like `passwordHash` are stripped before responses leave the backend.

---

## 👥 Seed Test Accounts

The platform includes pre-seeded accounts configured for immediate local testing:

| Persona | Email / Identifier | Password | Role | Location |
| :--- | :--- | :--- | :--- | :--- |
| **Rahul Sharma** | `rahul@example.com` | `Rahul@123` | User | Indiranagar, Bengaluru |
| **Ananya Verma** | `ananya@example.com` | `Ananya@123` | User | Koramangala, Bengaluru |
| **Priya Patel** | `priya@example.com` | `Priya@123` | User | Bandra, Mumbai |
| **Administrator** | `admin@loopwear.com` | `Admin@12345` | Admin | Bengaluru, India |

*(Evaluators can also use the **Quick Demo Persona Switcher** dropdown in the navigation bar to switch between user perspectives with a single click).*

---

## 🚀 Local Setup & Execution Guide

### 1. Prerequisites
- **Node.js** v18 or higher (v20+ recommended)
- **npm** v9 or higher

### 2. Installation
From the root workspace directory, install dependencies for all modules:

```bash
# Install root monorepo tools
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
cd ..
```

### 3. Environment Setup
Create environment files from the provided examples:

```bash
# Server environment
cp server/.env.example server/.env

# Client environment
cp client/.env.example client/.env
```

### 4. Running the Development Application
Start both the Backend API and Frontend Vite client simultaneously:

**Using root npm script:**
```bash
npm run dev
```

**Or using Windows scripts:**
- Double-click `start-dev.bat` or run `.\start-dev.ps1` in PowerShell.

- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:5000`

---

## 🧪 Automated Test Suite Execution

Loopwear includes an automated end-to-end integration test suite covering authentication, listing CRUD, swap lifecycle, chat messaging, admin RBAC, and all AI endpoints.

Run the test suite:

```bash
# From the root directory:
npm test

# Or directly in the server directory:
cd server
npm test
```

### Test Suite Output Verification:
```text
🧪 Starting Loopwear End-to-End Automated Test Suite...

  ✅ PASS: Health check API returns 200 OK
  ✅ PASS: User registration with bcrypt hashing returns 201 and token
  ✅ PASS: Duplicate registration is rejected with 400 Bad Request
  ✅ PASS: Login with valid credentials succeeds and returns JWT
  ✅ PASS: Login with invalid password rejected with 401 Unauthorized
  ✅ PASS: GET /api/auth/me identifies authenticated user correctly
  ✅ PASS: GET /api/items filters by category correctly
  ✅ PASS: POST /api/items creates listing associated with current user
  ✅ PASS: Unauthorized user cannot delete another users listing
  ✅ PASS: GET /api/dashboard returns authorized live metrics
  ✅ PASS: System prevents user proposing a swap on their own listing
  ✅ PASS: POST /api/swaps initiates swap proposal and AI evaluation
  ✅ PASS: POST /api/swaps/:id/accept reserves items and marks accepted
  ✅ PASS: POST /api/swaps/:id/complete marks swap completed and awards sustainability metrics
  ✅ PASS: POST /api/chat/:id/messages persists and returns message
  ✅ PASS: Regular users cannot access administrative endpoints (RBAC enforced)
  ✅ PASS: Admin can access analytics and user management
  ✅ PASS: AI Clothing Description generator produces title, description and tags
  ✅ PASS: AI Fair Swap Evaluator produces valuation comparison and fairness score
  ✅ PASS: AI Sustainability Calculator computes water, CO2 and landfill savings

========================================
TEST SUMMARY: 20 Passed, 0 Failed
========================================
```

---

## ☁️ Deployment Configuration

### Frontend (e.g., Vercel / Netlify)
1. Build command: `npm run build`
2. Output directory: `dist`
3. Root directory: `client`
4. Set environment variable: `VITE_API_BASE_URL=https://your-backend-service.onrender.com/api`

### Backend (e.g., Render / Railway)
1. Build command: `npm install`
2. Start command: `node index.js`
3. Root directory: `server`
4. Set environment variables:
   - `PORT=5000`
   - `JWT_SECRET=your_production_jwt_secret`
   - `CLIENT_URL=https://your-loopwear-client.vercel.app`
   - `MONGODB_URI=mongodb+srv://...` (Optional; persistent JSON store works automatically)
   - `GEMINI_API_KEY=your_gemini_api_key` (Optional; smart heuristics run if omitted)

---

## 🌿 Environmental Impact Assumptions

Calculations in the Sustainability Engine are based on textile lifecycle research:
- **Carbon Offset:** Average of **3.5 kg CO₂e** saved per exchanged garment (up to 7.5 kg for outerwear).
- **Water Conservation:** Average of **1,800 Liters** of freshwater dyeing/processing wastewater avoided per garment (up to 3,800L for heavy denim/jackets).
- **Landfill Diversion:** ~**450 grams** of textile mass diverted from municipal waste per garment swapped.

---

## 📜 License & Acknowledgments

Developed by **Thrashwi Naik** for the **Unified Mentor** Internship Program.  
Dedicated to advancing responsible circular fashion, software engineering excellence, and practical generative AI applications.
