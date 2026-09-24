# LibriQ - Sri Lankan University Library Management System

**இலங்கை பல்கலைக்கழக நூலக முகாமைத்துவ கட்டமைப்பு**  
**ශ්‍රී ලංකා විශ්වවිද්‍යාල පුස්තකාල තොරතුරු පද්ධතිය**

A full-stack **MERN (MongoDB, Express.js, React, Node.js)** university library management and circulation system designed according to Sri Lankan higher education and institutional library standards.

---

## 1. System Overview / கண்ணோட்டம்

LibriQ provides an end-to-end digital library platform for university librarians, faculty members, and undergraduate students. It supports automated circulation tracking, barcoded accession numbers, Dewey Decimal Call numbers (DDC), student index registrations, and late return fine calculations in Sri Lankan Rupees (LKR / Rs.).

### Language Support / மொழி ஆதரவு
- **English**: Academic link language and administrative interface.
- **தமிழ் (Tamil)**: Full contextual labels across circulation desks, catalog, and patron portals.
- **සිංහල (Sinhala)**: National university institutional titles and collection metadata.

---

## 2. Key Features / முக்கிய அம்சங்கள்

### Role-Based Access Control (RBAC) / பயனர் அனுமதி
- **Senior Assistant Librarian (நூலகர் / நிர்வாகி)**:
  - Catalog accessions with Accession Number (`ACC-...`), Dewey Decimal Call Number, and lending classification.
  - Issue books to students with configurable loan durations (7, 14, 21, 28 days).
  - Process book returns and calculate overdue fines in Sri Lankan Rupees (Rs. 10.00/day).
  - Manage student records with university Index No (e.g. `23IT0480`), National Identity Card (NIC), and Faculty/Department.
- **Undergraduate Student / Patron (மாணவர் / அங்கத்தவர்)**:
  - Search library stack collection by Title, Author, ISBN, Accession Number, or Call Number.
  - View real-time physical stack location and available shelf copies.
  - Review active loans, return due dates, and outstanding fine balances.

### Sri Lankan Library Classification / நூல் வகைப்படுத்தல்
- **Lending (සාමාන්‍ය ණයට දීම / பொதுக் கடன்)**: Standard loan copies.
- **Scheduled Reference - SR (විමර්ශන / குறிப்பு இரவல்)**: Overnight and short-term study loans.
- **Permanent Reference - PR (ස්ථිර විමර්ශන / நிலையான குறிப்பு)**: In-library reading only.
- **Past Exam Paper Repository (கடந்த கால வினாத்தாள்கள்)**: Semester question archives and model solutions.

### Circulation & Fine Policy / கடன் வழங்கல் & தாமதக் கட்டணம்
- Automated loan tracking with overdue detection.
- Late return penalty: **Rs. 10.00 per day** (configurable via `.env`).
- Safe deletion check preventing removal of titles currently in patron possession.

---

## 3. UI Color Palette / இடைமுக நிறங்கள்

The user interface is styled with clean academic typography and an official university color scheme:

- **Primary (`#1E3A5F`)**: Deep Ceylon Navy for brand emblems, navigation headers, and primary actions.
- **Secondary (`#2E6F95`)**: Ocean Blue for secondary actions, callout badges, and borders.
- **Accent (`#F4B942`)**: Sri Lankan Gold / Amber for active highlights, stock indicators, and fine tags.
- **Background (`#F7F9FC`)**: Clean, subtle off-white for soft contrast and readability.
- **Text (`#1F2937`)**: Slate Charcoal for high-contrast, accessible typography.

---

## 4. Demo Login Credentials / மாதிரி பயனர் விபரங்கள்

The system includes pre-seeded demonstration accounts with 1-click login on the authentication screen:

| Role / பதவி | Name / பெயர் | Identification / பதிவு இலக்கம் | Email / மின்னஞ்சல் | Password / கடவுச்சொல் |
|---|---|---|---|---|
| **Senior Librarian (நூலகர்)** | Dr. Senarath Bandara | `STAFF-LIB-01` | `admin@lms.com` | `admin123` |
| **Student (மாணவர்)** | Reezma Hanan | `23IT0480` | `student@lms.com` | `student123` |

---

## 5. Technology Stack / பயன்படுத்தப்பட்ட தொழில்நுட்பங்கள்

- **Database**: MongoDB (Mongoose ODM) with search indexing.
- **Backend**: Node.js v24 + Express.js REST API (ES Modules).
- **Frontend**: React 18 + Vite + Tailwind CSS.
- **Icons**: Lucide React (Clean, standard administrative icons).
- **Authentication**: JSON Web Tokens (JWT) + `bcryptjs` password hashing.

---

## 6. Installation & Execution / நிறுவல் முறை

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://localhost:27017` (or MongoDB Atlas URI)

### Quick Start (Single Command from Root)
```bash
# Install all dependencies
npm run install-all

# Seed database with Sri Lankan books and demo users
npm run seed

# Run backend API (Port 5000)
npm run server

# Run frontend client (Port 5173)
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
npm run dev     # Starts Vite development server at http://localhost:5173
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 7. REST API Documentation / ஏபிஐ முனையங்கள்

### Authentication / அங்கீகாரம்
- `POST /api/auth/register` - Register new student or staff patron (Index No, NIC, Faculty, Phone)
- `POST /api/auth/login` - Authenticate patron and issue JWT bearer token
- `GET /api/auth/me` - Retrieve authenticated patron profile (Protected)

### Book Catalog / நூல் விபரம்
- `GET /api/books` - Retrieve catalog titles with search, category, and lending classification filters
- `GET /api/books/categories` - List all active catalog categories
- `GET /api/books/:id` - Fetch single title details
- `POST /api/books` - Register new accession record (Admin only)
- `PUT /api/books/:id` - Update catalog title and stock counts (Admin only)
- `DELETE /api/books/:id` - Remove title from catalog (Protected against active loans)

### Circulation Transactions / கடன் & மீளளித்தல்
- `GET /api/transactions/dashboard` - Analytics metrics, fine totals, and recent circulation records
- `GET /api/transactions` - List circulation loans (Admin: all patrons; Student: own history)
- `POST /api/transactions/issue` - Issue stack copy to registered patron (Admin only)
- `POST /api/transactions/return/:id` - Process return and calculate Sri Lankan Rupee late fine (Admin only)

### Patron Directory / அங்கத்தவர் விபரம்
- `GET /api/users/members` - Retrieve student roster with active loan counters (Admin only)
- `GET /api/users/members/:id` - View patron circulation history (Protected)

---

## 8. License & Authorship

Developed for Sri Lankan University & College Libraries.  
Maintained by **M. Reezma Hanan** ([@reezmahanan](https://github.com/reezmahanan)).
