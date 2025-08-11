# Exam Control Backend

This is the backend API for the Exam Control system.

## Local Development

1. Clone the repository
2. Install dependencies: `npm install` or `yarn`
3. Copy `.env.example` to `.env` and update the variables
4. Run Prisma migrations: `npx prisma migrate dev`
5. Start development server: `npm run dev` or `yarn dev`

## Deployment to Vercel

1. Push this repository to GitHub
2. Create a new project in Vercel and import the GitHub repository
3. Configure environment variables in Vercel:
   - `DB_POSTGRES_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: Secret key for JWT tokens
   - `JWT_REFRESH_SECRET`: Secret key for JWT refresh tokens
   - `JWT_EXPIRES_IN`: JWT token expiry (e.g., "1d")
   - `JWT_REFRESH_EXPIRES_IN`: JWT refresh token expiry (e.g., "30d")
4. Deploy the project

## Database Setup

1. Create a PostgreSQL database
2. For Vercel deployment, you can use services like:
   - [Neon](https://neon.tech) (recommended, has a free tier)
   - [Supabase](https://supabase.com)
   - [Railway](https://railway.app)
3. Set the database connection string as the `DB_POSTGRES_URL` environment variable

## API Documentation

API endpoints include:

- Auth: `/api/v1/auth/*`
- Users: `/api/v1/users/*`
- Departments: `/api/v1/departments/*`
- Courses: `/api/v1/courses/*`
- Exams: `/api/v1/exams/*`
- Questions: `/api/v1/questions/*`
- Results: `/api/v1/results/*`

For detailed API documentation, check the API routes in the codebase.

## Tech Stack

- Node.js with Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
