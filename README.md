# WhatsPing

WhatsPing is a premium business communication platform designed to help businesses notify their customers about new products and updates instantly via WhatsApp.

## Features

- **Business Dashboard**: Manage your products and broadcasts in one place.
- **Client Management**: Organize your customer base for targeted messaging.
- **Broadcast System**: Create product notifications with images and send them to your clients.
- **Admin Approval**: Quality control system where admins review broadcasts before they go live.
- **Secure Authentication**: Role-based access control for Businesses and Admins.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Vanilla CSS with CSS Modules

## Getting Started

First, install the dependencies:

```bash
npm install
```

Second, set up the database:

```bash
npx prisma generate
npx prisma db push
```

Third, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Admin Access

Initial admin credentials:
- **Email**: `admin@whatsping.com`
- **Password**: `adminpassword`


