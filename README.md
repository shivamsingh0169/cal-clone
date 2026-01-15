# Cal.com Clone (Scheduling Platform)

A full-stack scheduling application that mimics the core functionality of Cal.com. It allows users to define availability, share a booking link, and receive appointments.

## 🚀 Tech Stack

- **Frontend:** React (Vite), Tailwind CSS (for pixel-perfect UI), React Calendar.
- **Backend:** Node.js, Express.
- **Database:** PostgreSQL (hosted on Neon.tech).
- **ORM:** Prisma (chosen for type safety and schema management).
- **Tooling:** date-fns for timezone/interval math.

## ✨ Features

- **Public Booking Page:** Dynamic slot generation based on availability and existing bookings.
- **Conflict Detection:** Smart logic to prevent double-booking.
- **Admin Dashboard:** View upcoming bookings and manage event types.
- **Responsive Design:** Mobile-friendly UI tailored to match Cal.com's aesthetic.

## 🛠️ Setup & Installation

### 1. Clone the repository
```bash
git clone [https://github.com/YOUR_USERNAME/cal-clone.git](https://github.com/YOUR_USERNAME/cal-clone.git)
cd cal-clone