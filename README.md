# Job Portal - AI-Powered Job Application Platform

A comprehensive job application portal with three user types (User, Company, Admin) and AI-powered resume job matching capabilities.

## 🏗️ Architecture

This project follows a **Frontend + Backend (API + ML Service)** architecture:

```
job-portal/
├── frontend/          # Next.js 15 Application
├── backend/
│   ├── src/           # Node.js API (Express)
│   ├── prisma/        # Database schema
│   └── ml/            # Python ML Service (FastAPI)
├── shared/            # Shared types and constants
└── docker-compose.yml
```

## 🚀 Features

### User Features
- Register and manage profile
- Upload resume (PDF/DOCX)
- AI-powered resume parsing
- Job search and filtering
- Apply to jobs
- Get job recommendations based on resume

### Company Features
- Company profile management
- Post and manage job listings
- View and manage applicants
- Update application status

### Admin Features
- User management
- Company verification
- Job moderation
- Platform analytics

### AI/ML Features
- Resume parsing (PDF, DOCX)
- Skill extraction using NLP
- Named Entity Recognition
- Vector embeddings for semantic matching
- Hybrid job matching (Semantic + Skill + Experience)

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand + React Query
- **Forms**: React Hook Form + Zod

### Backend API
- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Database**: PostgreSQL + Prisma ORM
- **Cache**: Redis
- **Auth**: JWT
- **File Storage**: S3/MinIO

### ML Service
- **Framework**: FastAPI
- **Language**: Python 3.11
- **NLP**: spaCy, Transformers
- **Embeddings**: sentence-transformers
- **Vector DB**: pgvector

## 📋 Prerequisites

- Node.js 20+
- Python 3.11+
- PostgreSQL 16+ (with pgvector extension)
- Redis
- Docker & Docker Compose (recommended)

## 🚀 Quick Start

### Using Docker Compose (Recommended)

```bash
# Clone the repository
cd job-portal

# Start all services
docker-compose up -d

# Run database migrations
docker-compose exec api npx prisma migrate dev

# Access the application
# Frontend: http://localhost:3000
# API: http://localhost:4000
# ML Service: http://localhost:8000
```

### Manual Setup

#### 1. Database Setup

```bash
# Create PostgreSQL database with pgvector
createdb jobportal

# Enable pgvector extension
psql -d jobportal -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

#### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Run migrations
npx prisma migrate dev

# Start development server
npm run dev
```

#### 3. ML Service Setup

```bash
cd backend/ml

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm

# Start development server
uvicorn src.main:app --reload --port 8000
```

#### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

## 📁 Project Structure

```
job-portal/
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js App Router pages
│   │   ├── components/       # React components
│   │   │   ├── ui/           # shadcn/ui components
│   │   │   ├── shared/       # Shared components
│   │   │   ├── auth/         # Auth components
│   │   │   ├── jobs/         # Job components
│   │   │   ├── profile/      # Profile components
│   │   │   ├── resume/       # Resume components
│   │   │   ├── matching/     # Matching components
│   │   │   └── admin/        # Admin components
│   │   ├── lib/              # Utilities and services
│   │   │   ├── api/          # API clients
│   │   │   ├── hooks/        # React hooks
│   │   │   ├── stores/       # Zustand stores
│   │   │   └── utils/        # Utility functions
│   │   └── types/            # TypeScript types
│   └── public/               # Static assets
│
├── backend/
│   ├── src/
│   │   ├── config/           # Configuration
│   │   ├── routes/           # API routes
│   │   ├── controllers/      # Request handlers
│   │   ├── services/         # Business logic
│   │   ├── middleware/       # Express middleware
│   │   └── types/            # TypeScript types
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   └── ml/                   # Python ML Service
│       ├── src/
│       │   ├── api/routes/   # FastAPI routes
│       │   ├── models/       # Pydantic models
│       │   ├── services/     # ML services
│       │   │   ├── resume/   # Resume parsing
│       │   │   ├── nlp/      # NLP processing
│       │   │   ├── embedding/# Embedding generation
│       │   │   └── matching/ # Job matching
│       │   └── config.py     # Configuration
│       └── requirements.txt
│
├── shared/
│   └── src/
│       ├── types/            # Shared TypeScript types
│       └── constants/        # Shared constants
│
└── docker-compose.yml
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Jobs
- `GET /api/jobs` - List jobs (with filters)
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create job (company)
- `PUT /api/jobs/:id` - Update job (company)
- `DELETE /api/jobs/:id` - Delete job (company)
- `POST /api/jobs/:id/apply` - Apply to job (user)

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/resumes` - Get user resumes
- `POST /api/users/resumes` - Upload resume
- `GET /api/users/applications` - Get user applications

### Matching
- `GET /api/matching/recommendations` - Get job recommendations
- `POST /api/matching/calculate` - Calculate match score
- `POST /api/matching/parse-resume` - Parse resume

### Admin
- `GET /api/admin/users` - List users
- `GET /api/admin/companies` - List companies
- `GET /api/admin/jobs` - List jobs
- `GET /api/admin/analytics` - Platform analytics

## 🤖 ML Service Endpoints

- `POST /api/v1/parse-resume` - Parse resume from URL
- `POST /api/v1/parse-resume-upload` - Parse uploaded resume
- `POST /api/v1/matching/recommendations` - Get job recommendations
- `POST /api/v1/matching/calculate` - Calculate match score
- `POST /api/v1/generate-embedding` - Generate text embedding

## 🗄️ Database Schema

### Core Tables
- `users` - User accounts
- `companies` - Company profiles
- `jobs` - Job listings
- `resumes` - Uploaded resumes
- `applications` - Job applications
- `job_matches` - Cached job matches

### Key Features
- pgvector extension for vector similarity search
- Full-text search support
- Proper indexing for performance

## 🔐 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/jobportal"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
ML_SERVICE_URL="http://localhost:8000"
S3_ENDPOINT="http://localhost:9000"
S3_ACCESS_KEY="minioadmin"
S3_SECRET_KEY="minioadmin"
S3_BUCKET="resumes"
FRONTEND_URL="http://localhost:3000"
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
NEXT_PUBLIC_ML_SERVICE_URL="http://localhost:8000"
```

## 📝 License

MIT License - See LICENSE file for details.
