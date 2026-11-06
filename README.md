# WFH Absent App — Employee Attendance Portal

Sistem presensi WFH (Work From Home) karyawan berbasis web dengan verifikasi biometrik selfie real-time dan dasbor pemantauan absensi terintegrasi.

---

## 📋 Overview

Aplikasi fullstack yang terdiri dari **2 use case** utama:

| # | Use Case | Deskripsi |
|---|----------|-----------|
| 1 | **Absensi WFH Karyawan** | Karyawan login, absen dengan timestamp & verifikasi foto selfie liveness |
| 2 | **Monitoring Karyawan (Admin HRD)** | Admin kelola data master karyawan & rekapitulasi data absensi harian |

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Backend** | NestJS (TypeScript) |
| **Frontend** | React.js (TypeScript) |
| **Database** | MySQL |
| **ORM** | TypeORM |
| **Auth** | JWT (JSON Web Token) |
| **File Upload** | Multer |
| **API Style** | REST API |

---

## 📁 Struktur Project

```
wfh-absent-app/
├── backend/          # NestJS API
├── frontend/         # React.js App
├── schema.sql        # Database schema import (MySQL)
└── README.md
```

---

## 🚀 Cara Menjalankan

### Prerequisites
- Node.js >= 18
- MySQL >= 8
- npm / yarn / pnpm

### Database Setup
1. Buat database di MySQL (atau Laragon / XAMPP):
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS wfh_absent_db;"
```
2. Import schema & seed user admin:
```bash
mysql -u root -p wfh_absent_db < schema.sql
```
*(Atau import file `schema.sql` via phpMyAdmin / DBeaver / Navicat)*

### Backend
```bash
cd backend
npm install
cp .env.example .env   # sesuaikan konfigurasi DB jika perlu
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
