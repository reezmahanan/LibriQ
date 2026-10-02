# LibriQ - Sri Lankan University Library Management System

**இலங்கை பல்கலைக்கழக நூலக முகாமைத்துவ கட்டமைப்பு**  
**ශ්‍රී ලංකා විශ්වවිද්‍යාල පුස්තකාල තොරතුරු පද්ධතිය**

LibriQ is a modern, full-stack **MERN (MongoDB, Express.js, React, Node.js)** university library management and circulation platform engineered specifically for Sri Lankan higher education institutes, universities, and academic colleges.

---

## 1. System Overview

LibriQ provides an end-to-end digital library platform for university librarians, faculty members, and undergraduate students. It supports automated circulation tracking, barcoded accession numbers, Dewey Decimal Call numbers (DDC), student index registrations, and late return fine calculations in Sri Lankan Rupees (LKR / Rs.).

### Trilingual Language Selection (`EN ˅` / `TA ˅` / `SI ˅`)
LibriQ includes a dedicated, clean language dropdown switcher on both the top navigation bar and authentication screens:
- **EN (English)**: Standard academic and administrative language.
- **TA (தமிழ்)**: Full contextual Tamil interface across circulation desks, catalog, and patron rosters.
- **SI (සිංහල)**: Official Sinhala interface for cataloging and patron services.
- **Clean Single-Language Rendering**: When a language is selected, the entire UI renders strictly in that language with no confusing multi-language clutter on the same screen. The selection is automatically remembered via browser `localStorage`.

---

## 2. Key Features

### Role-Based Access Control (RBAC)
- **Senior Assistant Librarian (Staff / Admin)**:
  - Catalog accessions with Accession Number (`ACC-...`), Dewey Decimal Call Number, shelf location, and lending classification.
  - Issue books to students with configurable loan durations (7, 14, 21, 28 days).
  - Process book returns and calculate overdue fines in Sri Lankan Rupees (Rs. 10.00/day).
  - Manage student records with university Index No (e.g. `23IT0480`), National Identity Card (NIC), and Faculty/Department.
- **Undergraduate Student / Patron**:
  - Search library stack collection by Title, Author, ISBN, Accession Number, or Call Number.
  - View real-time physical stack location and available shelf copies.
  - Review active loans, return due dates, and outstanding fine balances.

### Sri Lankan Library Classification
- **Lending**: Standard loan copies for undergraduate borrowing.
- **Scheduled Reference (SR)**: Overnight and short-term study loans.
- **Permanent Reference (PR)**: Restricted to in-library reading stack only.
- **Past Exam Paper Repository**: Semester examination question archives and syllabi references.

### Circulation & Fine Policy
- Automated loan tracking with overdue detection.
- Late return penalty: **Rs. 10.00 per day** (configurable via `.env`).
- Safe deletion check preventing removal of titles currently in patron possession.

---

## 3. UI Color Palette & Design

The user interface follows clean academic typography and an official university palette:

- **Primary (`#1E3A5F`)**: Deep Ceylon Navy for brand emblems, navigation headers, and primary actions.
- **Secondary (`#2E6F95`)**: Ocean Blue for secondary actions, callout badges, and borders.
- **Accent (`#F4B942`)**: Sri Lankan Gold / Amber for active highlights, stock indicators, and fine tags.
- **Background (`#F7F9FC`)**: Clean, subtle off-white for soft contrast and readability.
- **Text (`#1F2937`)**: Slate Charcoal for high-contrast, accessible typography.
- **Background Imagery**: Modern architectural library visuals with brand gradient overlays on authentication screens and dashboard banners.

---

## 4. Default Seeded Accounts

The database includes pre-seeded accounts for immediate testing:

| Role | Name | Identifier / Index No | Email | Password |
|---|---|---|---|---|
| **Senior Librarian** | Dr. Senarath Bandara | `STAFF-LIB-01` | `admin@lms.com` | `admin123` |
| **Undergraduate Student** | Reezma Hanan | `23IT0480` | `student@lms.com` | `student123` |

---

## 5. Technology Stack

- **Database**: MongoDB (Mongoose ODM) with text search indexing (`language_override: 'searchLanguage'`).
- **Backend**: Node.js + Express.js REST API (ES Modules).
- **Frontend**: React 18 + Vite + Tailwind CSS.
- **Icons**: Lucide React (Clean, standard administrative icons).
- **Authentication**: JSON Web Tokens (JWT) + `bcryptjs` password hashing.

---

## 6. Installation & Local Setup

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://localhost:27017` (or MongoDB Atlas connection string)

### Quick Start (From Project Root)
```bash
# Install all root, backend, and frontend dependencies
npm run install-all

# Seed database with Sri Lankan books and test patrons
npm run seed

# Run backend API (Port 5000)
npm run server

# Run frontend client (Port 5174 or 5173)
npm run client
```

### Manual Setup

#### Backend Setup
```bash
cd backend
npm install
npm run seed    # Seeds sample Sri Lankan university books and students
npm run dev     # Starts Express server at http://localhost:5000
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev     # Starts Vite development server
```

Open **[http://localhost:5174](http://localhost:5174)** in your browser.

---

## 7. Cloud Deployment Guide (AWS & Azure)

### Option A: Deploying on AWS
1. **Database**: Use **MongoDB Atlas** (free M0 tier or dedicated cluster) and obtain the `MONGODB_URI`.
2. **Backend**:
   - Deploy to **AWS App Runner** or **AWS Elastic Beanstalk** (Node.js runtime).
   - Set environment variables: `PORT=5000`, `MONGODB_URI=<your-atlas-uri>`, `JWT_SECRET=<secure-random-key>`, `FINE_PER_DAY=10`.
3. **Frontend**:
   - Run `npm run build` in `frontend/`.
   - Deploy the `dist/` directory to **AWS Amplify Hosting** or **Amazon S3 + CloudFront CDN**.
   - Configure rewrite rule to route all requests to `index.html`.

### Option B: Deploying on Microsoft Azure
1. **Database**: Use **Azure Cosmos DB for MongoDB** (vCore / RU) or **MongoDB Atlas on Azure**.
2. **Backend**:
   - Deploy `backend/` to **Azure App Service (Linux, Node.js 18/20 LTS)**.
   - In App Service Configuration -> Application settings, add `MONGODB_URI`, `JWT_SECRET`, `FINE_PER_DAY`.
3. **Frontend**:
   - Deploy `frontend/` to **Azure Static Web Apps**.
   - Set build preset to `Vite`, app location `/frontend`, and output location `dist`.

---

## 8. REST API Documentation

### Authentication
- `POST /api/auth/register` - Register new student or staff patron (Index No, NIC, Faculty, Phone)
- `POST /api/auth/login` - Authenticate patron and issue JWT bearer token
- `GET /api/auth/me` - Retrieve authenticated patron profile (Protected)

### Book Catalog
- `GET /api/books` - Retrieve catalog titles with search, category, and lending classification filters
- `GET /api/books/categories` - List all active catalog categories
- `GET /api/books/:id` - Fetch single title details
- `POST /api/books` - Register new accession record (Admin only)
- `PUT /api/books/:id` - Update catalog title and stock counts (Admin only)
- `DELETE /api/books/:id` - Remove title from catalog (Protected against active loans)

### Circulation Transactions
- `GET /api/transactions/dashboard` - Analytics metrics, fine totals, and recent circulation records
- `GET /api/transactions` - List circulation loans (Admin: all patrons; Student: own history)
- `POST /api/transactions/issue` - Issue stack copy to registered patron (Admin only)
- `POST /api/transactions/return/:id` - Process return and calculate Sri Lankan Rupee late fine (Admin only)

### Patron Directory
- `GET /api/users/members` - Retrieve student roster with active loan counters (Admin only)
- `GET /api/users/members/:id` - View patron circulation history (Protected)

---

## 9. License & Authorship

Developed for Sri Lankan University & College Libraries.  
Maintained by **M. Reezma Hanan** ([@reezmahanan](https://github.com/reezmahanan)).
