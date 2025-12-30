# 🧠 Psycare — Online Psychology Appointment Platform (Frontend)

**Psycare** is a modern web platform that allows users to **book, manage, and track psychological appointments online**, while providing psychologists or clinic administrators with tools to **review, confirm, and organize sessions** efficiently.

---

## 🚀 Project Overview

Psycare is built to streamline the interaction between patients and psychologists by offering a seamless appointment booking experience and an administrative dashboard to manage availability, confirmations, and patient information.

The project is designed for **scalability**, aiming to support **multiple professionals** in the future, while currently simulating a single psychologist setup.

---

## 🧩 Tech Stack

| Layer                | Technology                                     |
| -------------------- | ---------------------------------------------- |
| **Frontend**         | React + Vite                                   |
| **State Management** | Redux (planned implementation)                 |
| **Networking**       | Fetch API + Custom React Hooks                 |
| **Backend**          | Node.js (Express)                              |
| **Database**         | PostgreSQL (Neon)                              |
| **Hosting**          | Backend on Render, frontend pending deployment |
| **Auth**             | JWT + bcrypt password hashing                  |
| **Testing Tools**    | Postman                                        |

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

### 🔐 Authentication & Security

- User authentication (login & registration) with JWT tokens
- Protected routes with role-based access (admin/patient)
- Secure API endpoints with x-token header validation

### 👨‍⚕️ Admin Panel (Psychologist)

- **Dashboard**: Overview with appointment stats and filters
- **Appointment Management**:
  - View all appointments with filtering (status, date range, type)
  - Edit appointment details (date, time, type, status)
  - Delete appointments with confirmation
  - Toggle view: Upcoming / Historical appointments
  - "Próximas Citas" widget showing next 3 sessions
- **Patient Management**:
  - Patient profile pages with contact info and stats
  - Patient-specific appointment history
  - Independent filtering per patient view

### 👤 User Panel (Patient) - **Fase 2 Complete ✅**

#### **Fase 1: Personal Dashboard** ✅

- Custom "userPanel" theme (retro-beach palette)
- **UserStats**: Visual statistics (total, upcoming, completed, cancelled appointments)
- **UserUpcomingAppointments**: Widget displaying next 3 sessions with smart filtering
- **UserAppointmentList**: Full appointment list with:
  - Toggle between "Próximas" (upcoming) and "Historial" (all appointments)
  - Pagination ("Mostrar más" - 20 per page)
  - Intelligent empty states with actionable suggestions
  - Status badges (Pending, Confirmed, Paid, Cancelled)
  - Type badges (Online, In-person)
- Read-only view (editing/cancellation coming in Phase 4)

#### **Fase 2: Appointment Request System** ✅

- **RequestAppointmentModal**: Complete appointment booking flow
  - **Type Selector**: Choose between Online (turquoise) or In-person (blue) sessions
  - **Date Picker**: Calendar with validation (only future dates, excludes weekends)
  - **Time Slot Selector**: 5 daily slots (09:00, 11:00, 13:00, 15:00, 17:00)
  - **Real-time Availability**: Uses `useAvailableSlots` hook to check occupied slots
  - **Anti-spam Protection**: Maximum 3 pending appointments per user
  - **Dynamic Theming**: Color-coded UI based on appointment type
  - **Success Notifications**: Custom in-app success messages (10s display)
  - **Error Handling**: User-friendly error messages with server validation
- **Backend Integration**: POST to `/admin/appo` with proper camelCase fields
- **Redux Integration**: Automatic state updates via `addAppointment` action
- All appointments start with `status: 'pending'` (requires admin confirmation)

### 🔧 Technical Infrastructure

- Redux state management (appointments, users, auth)
- Custom hooks for form handling (useForm)
- Backend–frontend communication via Fetch API
- Endpoint testing through Postman
- Database relationships: `Users` ↔ `Appointments` (one-to-many)

---

## 🧭 Roadmap

| Phase          | Goal                                                         | Status       |
| -------------- | ------------------------------------------------------------ | ------------ |
| ✅ **Phase 1** | Backend deployment & user authentication                     | Complete     |
| ✅ **Phase 2** | Frontend integration, appointment CRUD, admin panel          | Complete     |
| ✅ **Phase 3** | User panel dashboard & appointment viewing (Fase 1)          | Complete     |
| ✅ **Phase 4** | Appointment request system (calendar, availability) (Fase 2) | Complete     |
| 🔜 **Phase 5** | User actions (cancel/reschedule), profile editing (Fase 3-4) | Planned      |
| 🔜 **Phase 6** | Real-time notifications (Socket.io or equivalent)            | Planned      |
| 🔜 **Phase 7** | Payments integration (Stripe / MercadoPago)                  | Planned      |
| 🔮 **Phase 8** | AI-powered assistance and analytics                          | Aspirational |

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
