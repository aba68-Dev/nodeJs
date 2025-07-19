# Sample Node.js Project

This is a simple Node.js project using Express.js. It starts a web server that responds with `Hello, World!` on the root route (`/`).

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

The server will start on port 3000 by default. Visit [http://localhost:3000](http://localhost:3000) in your browser to see the response.

## Customizing the Port

You can set a custom port by setting the `PORT` environment variable:

```
PORT=4000 npm start
```

## API Endpoints

### Create an Item
- **POST** `/items`
- Body: `{ "name": "Item Name" }`
- Response: The created item object

### Get All Items
- **GET** `/items`
- Response: Array of all items

### Get a Single Item
- **GET** `/items/:id`
- Response: The item object, or 404 if not found

### Update an Item
- **PUT** `/items/:id`
- Body: `{ "name": "New Name" }`
- Response: The updated item object, or 404 if not found

### Delete an Item
- **DELETE** `/items/:id`
- Response: The deleted item object, or 404 if not found

## Example Usage with curl

Create an item:
```
curl -X POST -H "Content-Type: application/json" -d '{"name":"Sample Item"}' http://localhost:3000/items
```

Get all items:
```
curl http://localhost:3000/items
```

Get a single item:
```
curl http://localhost:3000/items/1
```

Update an item:
```
curl -X PUT -H "Content-Type: application/json" -d '{"name":"Updated Name"}' http://localhost:3000/items/1
```

Delete an item:
```
curl -X DELETE http://localhost:3000/items/1
```