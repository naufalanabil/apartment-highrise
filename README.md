# Apartment Highrise

A modern web application for high-rise apartment management, built with Next.js, Prisma, and TypeScript.

---

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database & ORM:** [Prisma](https://www.prisma.io/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)

---

## 🛠️ Getting Started

Follow these instructions to run the project locally on your machine.

### Prerequisites

Make sure you have Node.js and npm installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/naufalanabil/apartment-highrise.git](https://github.com/naufalanabil/apartment-highrise.git)
   cd apartment-highrise

   Install dependencies:

npm install
Set up Environment Variables:
Buat file .env di folder utama (root) proyek kamu, lalu tambahkan konfigurasi database:

DATABASE_URL="postgresql://username:password@localhost:5432/apartment_db"
Setup Database with Prisma:

npx prisma db push
Run the Development Server:

npm run dev
Buka http://localhost:3000 di browser untuk melihat hasilnya.

📂 Project Structure

apartment-highrise/
├── prisma/           # Database schema & migrations
├── public/           # Static assets (images, icons)
├── src/              # Source code (components, pages, styles)
├── .env              # Environment variables
├── package.json      # Dependencies and scripts
└── README.md         # Project documentation

📝 License
This project is open-source and available under the MIT License.