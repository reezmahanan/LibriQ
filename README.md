# LibriQ - Library Management System (MERN Stack)

A modern, full-stack **Library Management System (LMS)** built with MongoDB, Express.js, React (Vite + Tailwind CSS), and Node.js.

---

## 🌟 Key Features

### 🔐 Authentication & Roles
- **Role-Based Access Control (RBAC)**:
  - **Librarian / Admin**: Add, edit, remove books, issue books to students, track overdue loans, manage patrons, view real-time KPIs.
  - **Student / Member**: Explore collection, check live availability, view current loans, return deadlines, and calculate overdue fines.
- **JWT-Protected REST API** with password encryption (`bcryptjs`).

### 📚 Catalog Management
- Book titles, authors, ISBNs, genre/category tags, rack/shelf locations, and cover images.
- Full-text search and category filter.
- Stock availability tracker (total copies vs. available copies).

### 🔄 Issue & Return Workflow
- 1-click issue to registered members with custom loan periods (7, 14, 21, 30 days).
- Automated overdue status updates with fine calculation ($5/day configurable in `.env`).
- Safe deletion check preventing deletion of titles currently checked out.

### 📊 Modern User Experience
- Clean, responsive dashboard designed with **Tailwind CSS** and **Lucide React**.
- Quick demo login buttons to test Admin and Student views instantly.

---

## 🔑 Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| **Librarian (Admin)** | `admin@lms.com` | `admin123` |
| **Student (Member)** | `student@lms.com` | `student123` |

---

## 🚀 How to Run the Project

### Prerequisites
- Node.js installed (v18+)
- MongoDB installed and running on `mongodb://localhost:27017`

### 1. Backend Server
```bash
cd backend
npm install
npm run seed     # (Optional) Populates sample books & demo users
npm run dev      # Starts Express API on http://localhost:5000
```

### 2. Frontend Client
```bash
cd frontend
npm install
npm run dev      # Starts Vite React app on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Authenticate & get JWT token
- `GET /api/auth/me` - Get current profile (Protected)

### Books
- `GET /api/books` - List books (search, category, availability filters)
- `GET /api/books/categories` - List distinct categories
- `GET /api/books/:id` - Book details
- `POST /api/books` - Add new book (Admin only)
- `PUT /api/books/:id` - Update book details (Admin only)
- `DELETE /api/books/:id` - Remove book from catalog (Admin only)

### Transactions & Dashboard
- `GET /api/transactions/dashboard` - Analytics metrics & recent transactions (Protected)
- `GET /api/transactions` - List loans (Admin: all, Member: own)
- `POST /api/transactions/issue` - Issue book to member (Admin only)
- `POST /api/transactions/return/:id` - Process return & fine calculation (Admin only)

### Members
- `GET /api/users/members` - List registered patrons with active loan counts (Admin only)
- `GET /api/users/members/:id` - Patron profile & history (Protected)
