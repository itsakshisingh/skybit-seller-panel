# Skybet Admin Panel (React + Tailwind CSS)

Complete, responsive Admin Panel built with React, Tailwind CSS, and Lucide Icons, integrating all Skybet Node.js / Express backend APIs.

---

## 🚀 How to Run

### 1. Start the Backend Server (Terminal 1)
```bash
cd skybetBackend
npm run dev
# Server running on http://backend.skybetsolarindustries.com
```

### 2. Start the Admin Panel Frontend (Terminal 2)
```bash
cd adminPenal
npm run dev
# Frontend running on http://localhost:3000
```

Open your browser: `http://localhost:3000`

---

## 🔑 Admin Login Credentials
- **Email:** `admin@skybet.com`
- **Password:** `AdminPassword@123`
*(Or click the one-click **"Fill Admin Credentials"** button on the login screen).*

---

## 📑 Pages & Backend API Integration Mapping

| Page / Section | Backend API Endpoint | Key Features & Actions |
| :--- | :--- | :--- |
| **1. Dashboard Overview** | Aggregated stats | Live metric counters, recent orders & inquiries snapshot |
| **2. Bookings & Orders** | `/api/product-bookings` | Full order lifecycle, live status update (pending ➔ confirmed ➔ shipped ➔ delivered), delivery address modal, search & filter |
| **3. Product Inquiries** | `/api/product-inquiries` | Customer pre-sales queries, status update (pending ➔ contacted ➔ completed), customer contact & query modal |
| **4. Products Catalog** | `/api/products`<br>`/api/solarlightproduct`<br>`/api/solarpanelproduct`<br>`/api/regionalproduct` | Unified catalog with 4 sub-collections, image upload, wattage/guarantee specs, add & delete items |
| **5. Contact Leads** | `/api/contact` | Customer contact form leads, company & city details, view modal & delete |
| **6. Job Applications** | `/api/jobapplication` | Career applications, candidate experience, department, cover letter reason, view & delete |
| **7. Testimonials & Reviews** | `/api/testimonials` | Star ratings (1-5), client photo upload, client quotes, create & delete reviews |
| **8. Company Gallery** | `/api/companygallery` | Photo gallery with project titles, image upload & delete |
| **9. Solar Programs** | `/api/program` | Government & company solar subsidy schemes & initiatives, icon upload & delete |
| **10. User Accounts** | `/api/auth/users` | Registered user list, roles (`admin` / `user`), user deletion with safeguard |
