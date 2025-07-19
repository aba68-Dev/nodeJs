# Sample Node.js Project

A complete sample Node.js project featuring Express.js, RESTful APIs, middleware, validation, testing, and modern development practices.

## Features

- 🚀 **Express.js** - Fast, unopinionated web framework
- 🔒 **Security** - Helmet for security headers, CORS enabled
- 📝 **Logging** - Morgan for HTTP request logging
- ✅ **Validation** - Joi for request validation
- 🧪 **Testing** - Jest with Supertest for API testing
- 📏 **Linting** - ESLint for code quality
- 🔄 **Hot Reload** - Nodemon for development
- 📦 **Environment** - dotenv for configuration
- 📊 **API Features** - CRUD operations, pagination, filtering

## Project Structure

```
sample-nodejs-project/
├── src/
│   ├── app.js                 # Main application file
│   ├── middleware/
│   │   └── errorMiddleware.js # Error handling middleware
│   └── routes/
│       ├── users.js           # User routes
│       └── tasks.js           # Task routes
├── tests/                     # Test files
│   ├── setup.js              # Test configuration
│   ├── app.test.js           # App tests
│   └── users.test.js         # User API tests
├── package.json               # Dependencies and scripts
├── .env                       # Environment variables
├── .env.example              # Environment template
├── .gitignore                # Git ignore rules
├── .eslintrc.js              # ESLint configuration
├── jest.config.js            # Jest test configuration
└── README.md                 # This file
```

## API Endpoints

### Root Endpoints
- `GET /` - Welcome message and API information
- `GET /health` - Health check endpoint

### Users API (`/api/users`)
- `GET /api/users` - Get all users (with pagination)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Tasks API (`/api/tasks`)
- `GET /api/tasks` - Get all tasks (with filtering and pagination)
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/toggle` - Toggle task completion
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats/overview` - Get task statistics

## Getting Started

### Prerequisites

- Node.js (>= 18.0.0)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sample-nodejs-project
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with hot reload
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint and fix issues

## API Usage Examples

### Create a User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
  }'
```

### Get All Users
```bash
curl http://localhost:3000/api/users
```

### Create a Task
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn Node.js",
    "description": "Complete Node.js tutorial",
    "userId": 1
  }'
```

### Get Tasks with Filtering
```bash
# Get completed tasks for user 1
curl "http://localhost:3000/api/tasks?userId=1&completed=true"

# Get tasks with pagination
curl "http://localhost:3000/api/tasks?page=1&limit=5"
```

## Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm test -- --coverage
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `API_VERSION` | API version | `1.0.0` |
| `CORS_ORIGIN` | CORS origin | `http://localhost:3000` |
| `LOG_LEVEL` | Logging level | `info` |

## Error Handling

The API includes comprehensive error handling:

- **400 Bad Request** - Validation errors
- **404 Not Found** - Resource not found
- **409 Conflict** - Duplicate resources (e.g., email already exists)
- **500 Internal Server Error** - Server errors

All error responses include:
```json
{
  "message": "Error description",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "stack": "Error stack trace (development only)"
}
```

## Validation

Request validation is handled using Joi schemas:

### User Validation
- `name`: 2-50 characters, required
- `email`: Valid email format, required
- `age`: Integer between 1-120, required

### Task Validation
- `title`: 3-100 characters, required
- `description`: Max 500 characters, optional
- `completed`: Boolean, defaults to false
- `userId`: Positive integer, required

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Sample Developer