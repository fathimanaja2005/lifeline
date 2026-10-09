# 🩸 Lifeline - Blood Bank Management System (MERN Stack)

A production-grade, full-stack Blood Bank and Donation Management Web Application built with **Node.js, Express, MongoDB (Mongoose), React (Vite + Tailwind CSS), and JavaScript**.

Lifeline coordinates blood donors, patients/recipients in urgent need, and blood bank administrators with real-time stock monitoring, shortage alerts, and automated requisition fulfillment.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ (v24 LTS installed)
- **MongoDB**: Supports standard MongoDB (`mongodb://127.0.0.1:27017/bloodbank`), MongoDB Atlas, or uses the automatic **embedded in-memory MongoDB fallback** with zero external database setup required!

### 2. Running the Backend API
```powershell
cd backend
npm install
npm start
# Server starts on http://localhost:5000
```
*(On first boot, the system automatically seeds realistic demo data for blood inventory, donors, patients, and hospital requests).*

### 3. Running the React Client
```powershell
cd frontend
npm install
npm run dev
# Vite dev server runs at http://localhost:5173
```

---

## 🔑 Ready-to-Use Demo Accounts

You can log in directly using the 1-click demo buttons on the Login page (`http://localhost:5173/login`):

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@lifeline.org` | `admin123` | Chief Medical Officer, stock management & approvals |
| **Eligible Donor** | `donor@lifeline.org` | `donor123` | Blood Group O+, eligible (75 days since last donation) |
| **Cooldown Donor** | `sarah.donor@lifeline.org` | `donor123` | Blood Group A-, 36 days cooldown remaining |
| **Patient 1** | `patient@lifeline.org` | `patient123` | Blood Group B+, active surgery requisitions |
| **Patient 2** | `elena.patient@lifeline.org` | `patient123` | Blood Group O-, emergency trauma cases |

---

## 🌟 Core Features & Modules

### 1. Blood Donor Portal
- **Eligibility Engine**: Real-time evaluation of the 56-day (8-week) minimum interval between donations, minimum 50 kg body weight check, and medical history screening.
- **Appointment Scheduling**: Book donation slots at blood banks or mobile blood donation camps.
- **Donation History & Digital Hero Certificates**: Unique certificate ID generation upon verified collection.

### 2. Patient & Hospital Requisition Portal
- **Emergency Requisitions**: Specify blood group, units, hospital/ward, doctor name, and urgency level (`Normal`, `Urgent`, `Critical`).
- **Live Requisition Tracking**: Status progression from `Pending` &rarr; `Approved` &rarr; `Dispatched` &rarr; `Completed`.

### 3. Blood Bank Administrator Operations Hub
- **Real-Time Blood Stock Telemetry**: Instant live counts across all 8 blood groups (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`).
- **Automated Inventory Debit/Credit**: Approving a requisition verifies availability and automatically deducts units from stock; completing a donor collection automatically increments units.
- **Shortage Alerts**: Visual warning indicators when units drop below minimum safety thresholds.
- **Community Blood Drives**: Schedule and organize donation drives with target unit goals.

### 4. Interactive Blood Compatibility Matrix
- Visual guide identifying compatible red blood cell and plasma donors and recipients (e.g. O- universal donor, AB+ universal receiver).

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React icons, React Router DOM v6, Axios with JWT interceptors.
- **Backend**: Node.js, Express.js REST API, JSON Web Tokens (JWT), Bcrypt.js, Mongoose ODM.
- **Database**: MongoDB / MongoMemoryServer.
