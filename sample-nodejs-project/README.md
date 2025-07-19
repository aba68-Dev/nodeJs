# Sample Node.js Project (Full-Featured)

This project is a full-featured Node.js CRUD API with:
- Persistent storage (SQLite)
- Input validation (Joi)
- Authentication (JWT, bcryptjs)
- Pagination & filtering
- Timestamps (createdAt, updatedAt)
- Centralized error handling
- Logging (morgan)
- CORS support
- Swagger/OpenAPI documentation
- Unit tests (Jest, Supertest)

## Prerequisites
- Node.js (v14 or higher recommended)
- npm

## Installation

```
npm install
```

## Running the Server

```
npm start
```

The server will start on port 3000 by default. Swagger docs are available at [http://localhost:3000/api-docs](http://localhost:3000/api-docs).

## Authentication
- Register a user: `POST /register` with `{ "username": "user", "password": "pass" }`
- Login: `POST /login` with `{ "username": "user", "password": "pass" }` to receive a JWT token
- For all `/items` endpoints, include the token in the `Authorization` header: `Bearer <token>`

## API Endpoints

### Register
```
curl -X POST -H "Content-Type: application/json" -d '{"username":"user","password":"pass"}' http://localhost:3000/register
```

### Login
```
curl -X POST -H "Content-Type: application/json" -d '{"username":"user","password":"pass"}' http://localhost:3000/login
```

### Create an Item (Authenticated)
```
curl -X POST -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{"name":"Item Name"}' http://localhost:3000/items
```

### Get All Items (Authenticated, with pagination/filtering)
```
curl -H "Authorization: Bearer <token>" "http://localhost:3000/items?page=1&limit=10&name=search"
```

### Get a Single Item (Authenticated)
```
curl -H "Authorization: Bearer <token>" http://localhost:3000/items/1
```

### Update an Item (Authenticated)
```
curl -X PUT -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{"name":"New Name"}' http://localhost:3000/items/1
```

### Delete an Item (Authenticated)
```
curl -X DELETE -H "Authorization: Bearer <token>" http://localhost:3000/items/1
```

## Running Tests

```
npm test
```

## Swagger/OpenAPI Docs
Visit [http://localhost:3000/api-docs](http://localhost:3000/api-docs) for interactive API documentation.