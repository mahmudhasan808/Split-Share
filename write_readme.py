content = '''# SplitShare

SplitShare is a modern, peer-to-peer subscription sharing platform that allows users to create teams, split the cost of SaaS subscriptions (like Netflix, Spotify, ChatGPT), and securely share credentials upon verified payment.

## Features

- **User Authentication**: Secure JWT-based login and registration.
- **Team Management**: Create teams, set subscription rules, and define pricing.
- **Join Requests**: Users can request to join teams, which the host can approve.
- **Automated Payments**: Integrated with **SSLCommerz** Sandbox for automated, secure payment processing.
- **Secure Credentials Vault**: Shared credentials are locked and only revealed to members who have successfully paid their dues.
- **Admin Dashboards**: Fully integrated management panels for team owners.

## Tech Stack

- **Frontend**: React (Vite), TypeScript, Tailwind CSS, Apollo Client, Lucide Icons.
- **Backend**: Node.js, Express, Apollo Server (GraphQL), Prisma ORM.
- **Database**: PostgreSQL (hosted on Neon.tech).
- **Payments**: SSLCommerz.

## Environment Variables

To run this project locally, you need to create two .env files.

### Backend (ackend/.env)
`env
# PostgreSQL Database URL
DATABASE_URL="postgresql://user:password@host/database"

# JWT Secret for Auth
JWT_SECRET="your-super-secret-key"

# SSLCommerz Sandbox Credentials
STORE_ID="testbox"
STORE_PASSWORD="qwerty"

# Frontend URL (For SSLCommerz Webhook Redirects)
FRONTEND_URL="http://localhost:5173"
`

### Frontend (.env)
`env
# GraphQL API URL
VITE_GRAPHQL_URL="http://localhost:4000/graphql"

# REST API URL (For SSLCommerz Init)
VITE_API_URL="http://localhost:4000/api"
`

## Getting Started

### 1. Database Setup
Ensure you have a PostgreSQL database running and update the DATABASE_URL in the backend .env.
`ash
cd backend
npx prisma db push
`

### 2. Start the Backend
`ash
cd backend
npm install
npm run dev
`
The GraphQL API will be available at http://localhost:4000/graphql.

### 3. Start the Frontend
In a new terminal window:
`ash
npm install
npm run dev
`
The frontend will be available at http://localhost:5173.

## Deployment Readiness

This project is configured and ready for production deployment.
- **Frontend** can be deployed to **Vercel** or **Netlify**. Make sure to inject the VITE_GRAPHQL_URL environment variable.
- **Backend** can be deployed to **Render**, **Railway**, or **Heroku**. Make sure to inject the DATABASE_URL, JWT_SECRET, and FRONTEND_URL environment variables.
'''

with open('README.md', 'w', encoding='utf-8') as f:
    f.write(content)
