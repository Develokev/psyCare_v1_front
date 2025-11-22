# 🧠 Psycare — Online Psychology Appointment Platform (Frontend)

**Psycare** is a modern web platform that allows users to **book, manage, and track psychological appointments online**, while providing psychologists or clinic administrators with tools to **review, confirm, and organize sessions** efficiently.

---

## 🚀 Project Overview

Psycare is built to streamline the interaction between patients and psychologists by offering a seamless appointment booking experience and an administrative dashboard to manage availability, confirmations, and patient information.

The project is designed for **scalability**, aiming to support **multiple professionals** in the future, while currently simulating a single psychologist setup.

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React + Vite |
| **State Management** | Redux (planned implementation) |
| **Networking** | Fetch API + Custom React Hooks |
| **Backend** | Node.js (Express) |
| **Database** | PostgreSQL (Neon) |
| **Hosting** | Backend on Render, frontend pending deployment |
| **Auth** | JWT + bcrypt password hashing |
| **Testing Tools** | Postman |

---

## 👥 User Roles & Flows

### 👤 **User (Patient)**
- Register and log in securely.
- View available appointment slots.
- Request an appointment → status defaults to `pending`.
- Modify or cancel booked appointments.
- Track appointments by status: `pending`, `confirmed`, `paid`, `cancelled`.
- Receive notifications when the psychologist confirms or updates a booking.

### 🧑‍⚕️ **Admin (Psychologist)**
- Access an administrative panel.
- View all appointments by status or user.
- Accept or reject pending bookings.
- Update appointment statuses (which notifies patients in real time).
- Manage patients and their appointment history.
- Add internal notes or observations.
- (Future) Manage custom work hours and availability.

---

## 📅 Appointment Logic

- The system simulates **3 available time slots per day** within working hours.
- Patients can only select **non-overlapping time slots**.
- Once an admin confirms a booking, that time slot becomes **unavailable** to other users.
- In future updates, a **dynamic calendar system** will handle real availability and scheduling logic.

---

## 🔔 Notifications (Planned Feature)

A key goal of Psycare is to enable **real-time communication** between users and administrators.

**Possible implementations:**
- **WebSockets (Socket.io)** for instant updates on booking status.
- **Email notifications** via Nodemailer or SendGrid.
- **Push notifications** for users (optional, via Firebase Cloud Messaging).

---

## 🛠️ Current Functionality

- 🔐 User authentication (login & registration)  
- 📅 Appointment creation, retrieval, and filtering by status or user  
- ⚙️ Backend–frontend communication via custom hooks  
- 🧪 Endpoint testing through Postman  
- 🧱 Established database relationships:  
  - `Users` ↔ `Appointments` (one-to-many)

---

## 🧭 Roadmap

| Phase | Goal |
|-------|------|
| ✅ **Phase 1** | Backend deployment & user authentication |
| 🚧 **Phase 2** | Frontend integration, appointment CRUD, login form testing |
| 🔜 **Phase 3** | Calendar system & admin panel |
| 🔜 **Phase 4** | Real-time notifications (Socket.io or equivalent) |
| 🔜 **Phase 5** | Payments integration (Stripe / MercadoPago) |
| 🔮 **Phase 6** | AI-powered assistance and analytics |

---

## 🤖 Future AI Integrations (Aspirational)

Psycare is envisioned as a **smart mental health assistant** over time. Potential AI-driven features include:

- 💬 **Chat-based emotional support assistant** for initial guidance or triage.  
- 📊 **Sentiment and tone analysis** in therapist notes or patient feedback.  
- 🕒 **Predictive scheduling**, recommending optimal slots based on behavior patterns.  
- 🔔 **Smart reminders** for both patients and professionals.  
- 📈 **AI dashboards** analyzing attendance, engagement, or therapy trends.

---

## 🧱 Project Structure (Frontend)

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js ≥ 18
- npm or yarn

### Steps

# Clone the repository
git clone https://github.com/yourusername/psycare-frontend.git

# Navigate into the folder
cd psycare-frontend

# Install dependencies
npm install

# Run the development server
npm run dev

---