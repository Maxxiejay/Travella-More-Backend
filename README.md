
# Authentication and Package Management API

A full-featured API backend with user authentication and package management functionality.

## Features

- User Authentication (signup, signin, profile management)
- Email Verification
- Password Reset
- Package Management
- CORS Support
- Input Validation
- Error Handling
- JWT Authentication

## Tech Stack

- Backend Framework: Express.js & Flask
- Database: PostgreSQL with Sequelize ORM
- Authentication: JWT (JSON Web Tokens)
- Email Service: Nodemailer
- Validation: Express Validator

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/signup` - Register a new user
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "fullName": "string",
    "mobile": "string",
    "businessName": "string",
    "businessLocation": "string"
  }
  ```

- `POST /api/auth/signin` - Login user
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

- `GET /api/auth/profile` - Get user profile (Protected)
- `GET /api/auth/verify-email/:token` - Verify email address
- `POST /api/auth/resend-verification` - Resend verification email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password

### Package Management Endpoints

- `POST /api/packages` - Create new package (Protected)
  ```json
  {
    "pickupAddress": "string",
    "pickupContactNumber": "string",
    "pickupCountry": "string",
    "pickupState": "string",
    "pickupCity": "string",
    "deliveryAddress": "string",
    "deliveryContactNumber": "string",
    "deliveryCountry": "string",
    "deliveryState": "string",
    "deliveryCity": "string",
    "packageDescription": "string",
    "weightKg": "number",
    "hasPackageDiscount": "boolean",
    "status": "string (optional, defaults to 'pending')"
  }
  ```

- `GET /api/packages/:id` - Get package details by ID (Protected)
  Returns single package if found, null if not found

- `GET /api/packages` - List all packages for authenticated user (Protected)
  Returns array of packages sorted by creation date (descending)

- `GET /api/packages/admin/all` - Get all packages (Admin only)
  Returns array of all packages sorted by creation date (descending)

- `PUT /api/packages/:id` - Update package details (Protected)
  Accepts any valid package fields to update

- `DELETE /api/packages/:id` - Delete package (Protected)
  Returns true if deleted successfully, false otherwise

## Authentication

Protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Environment Variables

- `PORT` - Server port (default: 8000)
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)
- `EMAIL_HOST` - SMTP host for email service
- `EMAIL_PORT` - SMTP port
- `EMAIL_USER` - SMTP username
- `EMAIL_PASSWORD` - SMTP password
- `EMAIL_FROM` - Default sender email
- `SESSION_SECRET` - Session secret key

## Running the Application

The application consists of two servers:

1. Flask Frontend Server (Port 5000):
```bash
gunicorn --bind 0.0.0.0:5000 main:app
```

2. Node.js Backend Server (Port 8000):
```bash
npm install
node server.js
```

## Error Handling

The API uses standard HTTP status codes:

- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Security Features

- Password Hashing (bcrypt)
- JWT Token Authentication
- Input Validation and Sanitization
- CORS Protection
- Environment Variable Configuration
- Session Management

## Frontend Integration

The API includes HTML templates for:
- Home page (`/`)
- API documentation (`/api`)
- Authentication endpoints (`/api/auth`)
- Package management form (`/package-form`)
