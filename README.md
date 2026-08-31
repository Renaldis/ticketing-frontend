# 🎟️ TICKETIX - Cyber-Enterprise Frontend App

Frontend web application untuk platform pemesanan tiket konser, maraton, seminar, dan festival berkapasitas tinggi. Dibangun menggunakan **Next.js 15 (App Router), Tailwind CSS, TypeScript, React Hook Form, Zod Validation, dan Google Stitch Design System**.

---

## 🎨 Design System & UI/UX

- **Aesthetic**: Cyber-Enterprise Dark Mode & Professional Glassmorphism.
- **Color Palette**: Obsidian Surface (`#0d0d15`), Electric Cyan (`#4cd7f6`), Violet Indigo (`#6366f1`), dan Purple Glow (`#ddb7ff`).
- **Typography**: Plus Jakarta Sans.
- **Layout Architecture**: Full Nested Layouts, Fixed Sidebar Persistence, and Independent Content Scroll.

---

## 🚀 Fitur Utama

### 1. 🌐 Customer & Discovery Portal
- **Home & Landing Showcase (`/`)**: Hero section berlatar grid cyber dengan ambient glow, 3 Bento feature cards, dan preview event unggulan.
- **Discovery Hub & Universal Filter (`/events`)**: Katalog lengkap dengan filter kategori interaktif (*Concert, Sports & Marathon, Seminar, Workshop, Exhibition, Webinar*), pencarian lokasi, dan live stock badge.
- **SEO-Friendly Slug Event Details (`/events/[slug]`)**:
  - Halaman detail event berdasar URL slug (misal: `/events/neon-symphony-live-concert-2026`).
  - Panel pemilihan tiket interaktif dengan live availability check, stepper kuantitas (+/-), rincian platform fee (2%), dan checkout tombol terlindungi idempotency key.
  - Integrasi modal pembayaran Midtrans Snap JS.
- **My Bookings & Digital Pass (`/my-orders`)**:
  - Riwayat transaksi pemesanan tiket dengan status real-time (`PAID`, `CHECKED_IN`, `PENDING`, `CANCELLED`).
  - **Tombol Check Payment**: Melakukan query status pembayaran langsung ke Midtrans API.
  - **Modal E-Ticket Digital Pass**: Menampilkan QR Code scan-ready berlatar kartu resmi.

### 2. 🔐 Authentication & Session Security (`/login`, `/register`)
- **Dedicated Independent Layout**: Halaman login & register terisolasi penuh tanpa navbar/footer publik.
- **Zod & React Hook Form**: Validasi input ketat sebelum submit.
- **Auto-Relogin / Session Expiration**: Menangkap response `401 Unauthorized` dari backend secara otomatis melalui Axios response interceptor dan me-redirect ke login dengan notifikasi sesi habis.

### 3. 📊 Executive Admin Management Portal (`/admin/*`)
- **Nested Layout & Fixed Navigation Sidebar**:
  - **Platform Overview (`/admin`)**: Telemetri global seluruh platform (Total Revenue, Total Sold, Gate Attendance, Available Inv.) dan filter telemetri per event.
  - **Event Catalog CRUD (`/admin/events`)**: Grid inventori event lengkap dengan tombol *Add New Event Modal* (menggunakan Dynamic Ticket Tier Builder tanpa JSON mentah), *Edit Modal*, *Delete*, dan *Preview*.
  - **Ticket & Stock Manager (`/admin/tickets`)**: Manajemen kuota tiket live dengan tombol cepat **`+10`**, **`+1`**, **`-1`**, **`-5`** dan form penambahan kategori tier baru.
  - **Global Order Ledger (`/admin/orders`)**: Audit log seluruh transaksi customer dengan pencarian instan (nama/email/ID) dan filter status.
  - **Gate Scanner Optical View (`/admin/scanner`)**: Pemindai kamera QR Code untuk staf pintu masuk konser dengan feedback instan: 🟢 *Access Granted* atau 🔴 *Access Denied*.
  - **Platform Security & Timer Settings (`/admin/settings`)**: Konfigurasi durasi countdown pembatalan BullMQ (2 s/d 60 menit) yang tersimpan di Redis.

---

## 📁 Arsitektur Direktori (DRY, Modular & Scalable)

```text
src/
├── app/
│   ├── (auth)/             # Route Group Autentikasi (Layout Mandiri)
│   │   ├── login/          # Page & _hooks
│   │   └── register/       # Page & _hooks
│   ├── (client)/           # Route Group Pengunjung Publik (Navbar & Footer)
│   │   ├── _components/    # HeroSection, FeatureBento, EventCard
│   │   ├── _hooks/         # useHomeEvents
│   │   ├── events/         # Full Catalog Discovery & _hooks
│   │   │   └── [slug]/     # Event Detail (EventInfo, BookingCard, useEventDetail)
│   │   ├── my-orders/      # OrderCard, TicketPassModal, useMyOrders
│   │   └── page.tsx        # Home Landing Page
│   ├── admin/              # Nested Admin Layout (AdminSidebar Terpusat)
│   │   ├── _components/    # TelemetryTiles, EventsOverviewGrid
│   │   ├── _hooks/         # useAdminOverview
│   │   ├── events/         # Admin Events CRUD (_components, _hooks)
│   │   ├── tickets/        # Stock Manager (_components, _hooks)
│   │   ├── orders/         # Global Ledger (_components, _hooks)
│   │   ├── scanner/        # Gate Optical Scanner (_hooks)
│   │   ├── settings/       # Platform TTL Settings
│   │   └── layout.tsx      # Fixed Admin Sidebar Layout
│   ├── globals.css         # Styling Tema Cyber-Enterprise Stitch
│   └── layout.tsx          # Root Layout & Font Plus Jakarta Sans
├── components/
│   ├── admin/              # AdminSidebar, AdminHeader, EventFormModal, AddCategoryModal
│   ├── ui/                 # StatusBadge
│   └── Navbar.tsx          # Public Navigation Bar
├── context/
│   └── AuthContext.tsx     # JWT Session Provider
├── lib/
│   └── api.ts              # Axios Client Wrapper, JWT Interceptors & Auto-Relog
├── schemas/
│   └── index.ts            # Skema Validasi Zod
└── types/
    └── index.ts            # Interface TypeScript Global
```

---

## ⚙️ Panduan Menjalankan Frontend

### 1. Install Dependencies
```bash
npm install
```

### 2. Konfigurasi Environment (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_midtrans_client_key
```

### 3. Menjalankan Server
```bash
# Mode Development
npm run dev

# Mode Production Build
npm run build
npm start
```

Aplikasi dapat diakses di:
👉 **`http://localhost:3000`**
