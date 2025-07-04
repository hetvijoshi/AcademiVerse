# AcademiVerse

A comprehensive academic management platform built with Spring Boot and Next.js, designed to streamline educational processes for students and instructors.

## Features

### For Students
- **Course Management**: Enroll in courses, view course materials, and track progress
- **Assignment System**: Submit assignments, view grades, and track deadlines
- **Quiz Platform**: Take quizzes with real-time grading
- **To-Do Management**: Organize tasks and deadlines efficiently
- **Grade Tracking**: Monitor academic performance across all courses

### For Instructors
- **Course Administration**: Create and manage courses, modules, and content
- **Assignment Creation**: Design assignments with file upload support
- **Quiz Builder**: Create interactive quizzes with multiple question types
- **Grade Management**: Efficient grading system with bulk operations
- **Announcements**: Communicate with students through course announcements

## Architecture

```
AcademiVerse/
├── academiverse-api/          # Spring Boot Backend
│   ├── src/main/java/
│   │   └── com/academiverse/
│   │       ├── controller/    # REST API endpoints
│   │       ├── service/       # Business logic
│   │       ├── model/         # JPA entities
│   │       ├── repository/    # Data access layer
│   │       ├── dto/           # Data transfer objects
│   │       └── util/          # Utility classes
│   └── src/main/resources/
│       └── application.properties
├── academiverse-ui/           # Next.js Frontend
│   ├── src/app/
│   │   ├── (routes)/          # Page routes
│   │   ├── components/        # Reusable UI components
│   │   ├── services/          # API service layer
│   │   └── lib/               # Utilities and configurations
│   └── cypress/               # E2E tests
└── .circleci/                 # CI/CD configuration
```

## Tech Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Database**: MySQL/PostgreSQL (AWS RDS)
- **ORM**: Spring Data JPA
- **Security**: Spring Security (Azure Entra ID)
- **Cloud Storage**: AWS S3
- **Testing**: JUnit

### Frontend
- **Framework**: Next.js 14
- **Styling**: MUI + CSS
- **Authentication**: NextAuth.js (Azure Entra ID)
- **Testing**: Jest, Cypress
- **HTTP Client**: Axios

### DevOps
- **CI/CD**: CircleCI
- **Deployment**: AWS Elastic Beanstalk
- **Version Control**: Git

## Prerequisites

- **Java**: 17 or higher
- **Node.js**: 18 or higher
- **MySQL**: 8.0 or higher
- **Maven**: 3.6 or higher
- **Git**: Latest version

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/hetvijoshi/AcademiVerse.git
cd AcademiVerse
```

### 2. Backend Setup
```bash
cd academiverse-api

# Configure database in application.properties
# Update the following properties:
# spring.datasource.url=jdbc:mysql://localhost:3306/academiverse
# spring.datasource.username=your_username
# spring.datasource.password=your_password

# Install dependencies and run
./mvnw clean install
./mvnw spring-boot:run
```

The backend will be available at `http://localhost:8080`

### 3. Frontend Setup
```bash
cd academiverse-ui

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Update API_URL and other configuration in .env.local

# Run development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Configuration

### Backend Configuration
Create `application.properties` in `src/main/resources/`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/academiverse
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update

# AWS S3 Configuration
aws.s3.bucket.name=your-bucket-name
aws.s3.region=your-region
aws.access.key=your-access-key
aws.secret.key=your-secret-key

# Server Configuration
server.port=8080
```

### Frontend Configuration
Create `.env.local` in the frontend directory:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
API_BASE_URL=http://localhost:8080
```
Edit http.js to use API_BASE_URL as a base URL for client.

## Testing

### Backend Tests
```bash
cd academiverse-api
./mvnw test
```

### Frontend Tests
```bash
cd academiverse-ui
npm run test:e2e           # E2E tests with Cypress
```

## Deployment

### Backend Deployment (AWS Elastic Beanstalk)
```bash
cd academiverse-api
./mvnw clean package
eb init
eb create
eb deploy
```

## Database Schema

### Core Entities
- **User**: Students, instructors, and administrators
- **Course**: Academic courses
- **Module**: Course content modules
- **Assignment**: Course assignments
- **Quiz**: Interactive assessments
- **Grade**: Student performance records
- **Enrollment**: Course enrollment records

## Security

- Azure Entra ID based authentication (JWT)
- Role-based access control (RBAC)
- Input validation and sanitization
- SQL injection prevention

## Acknowledgments

- Spring Boot community for excellent documentation
- Next.js team for the amazing framework
- All contributors who helped build this project

---

**Made with ❤️ by the AcademiVerse Team**
