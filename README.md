# Authentication API

A Node.js API backend with user authentication system for signup and signin functionality.

## Features

- User registration with complete profile information
- User authentication with JWT
- Protected routes for authenticated users
- Input validation and sanitization
- Error handling

## API Endpoints

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Login and get a token
- `GET /api/auth/profile` - Get user profile (protected route)
- `GET /` - API status check

## Setup and Installation

### Local Development

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. The API will be available at `http://localhost:8000`

### Deployment on Render

1. Sign up for a [Render](https://render.com) account
2. Create a new Web Service
3. Connect your repository or deploy from public Git repository
4. Configure the following settings:
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables:
   - `PORT`: `10000`
   - `JWT_SECRET`: [your-jwt-secret]
6. Deploy your service

## Environment Variables

- `PORT` - Port number for the server (default: 8000)
- `JWT_SECRET` - Secret key for JWT token generation
- `NODE_ENV` - Environment (development, production)

## Request Examples

### Register a New User

```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Password123",
    "fullName": "Test User",
    "mobile": "1234567890",
    "businessName": "Test Business",
    "businessLocation": "Test Location"
  }'
```

### Login

```bash
curl -X POST http://localhost:8000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'
```

### Get User Profile (Protected)

```bash
curl -X GET http://localhost:8000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## License

MIT