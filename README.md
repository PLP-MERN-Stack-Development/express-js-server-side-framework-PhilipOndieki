# Product API Documentation

A RESTful API built with Express.js and MongoDB for managing products with full CRUD operations, search functionality, filtering, pagination, and category statistics.

## Table of Contents
- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [Base URL](#base-url)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Examples](#examples)

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <your-repo-name>
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/productsdb
API_KEY=your-secret-api-key-here
PORT=3000
NODE_ENV=development
```

4. Seed the database with sample data (optional):
```bash
node models/seed.js
```

5. Start the server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

---

## Authentication

All `/api/products` endpoints require an API key for authentication.

**Header Required:**
```
x-api-key: your-secret-api-key-12345
```

**Example:**
```bash
curl -H "x-api-key: your-secret-api-key-12345" http://localhost:3000/api/products
```

---

## Base URL

```
http://localhost:3000
```

---

## API Endpoints

### 1. Root Endpoint
Get API information and available endpoints.

- **URL:** `/`
- **Method:** `GET`
- **Auth Required:** No

**Success Response:**
```json
{
  "message": "Welcome to the Product API!",
  "version": "1.0.0",
  "endpoints": {
    "products": "/api/products",
    "search": "/api/products/search?q=searchterm",
    "stats": "/api/products/stats/category"
  },
  "documentation": "See README.md for full API documentation"
}
```

---

### 2. Health Check
Check if the server is running.

- **URL:** `/health`
- **Method:** `GET`
- **Auth Required:** No

**Success Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-10-08T09:00:00.000Z",
  "uptime": 123.456
}
```

---

### 3. Get All Products
Retrieve a list of all products with optional filtering and pagination.

- **URL:** `/api/products`
- **Method:** `GET`
- **Auth Required:** Yes

**Query Parameters:**

| Parameter | Type | Description | Default | Example |
|-----------|------|-------------|---------|---------|
| `page` | Number | Page number for pagination | 1 | `?page=2` |
| `limit` | Number | Number of items per page (max 100) | 10 | `?limit=20` |
| `category` | String | Filter by product category | - | `?category=electronics` |
| `inStock` | Boolean | Filter by stock availability | - | `?inStock=true` |
| `minPrice` | Number | Minimum price filter | - | `?minPrice=50` |
| `maxPrice` | Number | Maximum price filter | - | `?maxPrice=500` |

**Example Request:**
```bash
curl -H "x-api-key: your-secret-api-key-12345" \
  "http://localhost:3000/api/products?category=electronics&inStock=true&page=1&limit=10"
```

**Success Response (200):**
```json
{
  "success": true,
  "page": 1,
  "limit": 10,
  "total": 3,
  "items": [
    {
      "_id": "6705abc123def456789",
      "name": "MacBook Pro 16\"",
      "description": "High-performance laptop with M3 Pro chip",
      "price": 2499.99,
      "category": "electronics",
      "inStock": true,
      "createdAt": "2024-10-08T09:00:00.000Z",
      "updatedAt": "2024-10-08T09:00:00.000Z"
    }
  ]
}
```

---

### 4. Get Product by ID
Retrieve a specific product by its ID.

- **URL:** `/api/products/:id`
- **Method:** `GET`
- **Auth Required:** Yes

**URL Parameters:**
- `id` (required): MongoDB ObjectId of the product

**Example Request:**
```bash
curl -H "x-api-key: your-secret-api-key-12345" \
  http://localhost:3000/api/products/6705abc123def456789
```

**Success Response (200):**
```json
{
  "success": true,
  "product": {
    "_id": "6705abc123def456789",
    "name": "MacBook Pro 16\"",
    "description": "High-performance laptop with M3 Pro chip",
    "price": 2499.99,
    "category": "electronics",
    "inStock": true,
    "createdAt": "2024-10-08T09:00:00.000Z",
    "updatedAt": "2024-10-08T09:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

### 5. Create New Product
Create a new product in the database.

- **URL:** `/api/products`
- **Method:** `POST`
- **Auth Required:** Yes

**Headers:**
```
x-api-key: your-secret-api-key-12345
Content-Type: application/json
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | Yes | Product name (min 2 characters) |
| `description` | String | No | Product description |
| `price` | Number | Yes | Product price (must be >= 0) |
| `category` | String | Yes | Product category |
| `inStock` | Boolean | No | Stock availability (default: true) |

**Example Request:**
```bash
curl -X POST \
  -H "x-api-key: your-secret-api-key-12345" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gaming Laptop",
    "description": "High-performance gaming laptop with RTX 4080",
    "price": 1299.99,
    "category": "electronics",
    "inStock": true
  }' \
  http://localhost:3000/api/products
```

**Success Response (201):**
```json
{
  "success": true,
  "product": {
    "_id": "6705abc123def456790",
    "name": "Gaming Laptop",
    "description": "High-performance gaming laptop with RTX 4080",
    "price": 1299.99,
    "category": "electronics",
    "inStock": true,
    "createdAt": "2024-10-08T09:30:00.000Z",
    "updatedAt": "2024-10-08T09:30:00.000Z"
  }
}
```

**Error Response (422):**
```json
{
  "success": false,
  "message": "Field \"name\" must be a string with length >= 2"
}
```

---

### 6. Update Product
Update an existing product by ID.

- **URL:** `/api/products/:id`
- **Method:** `PUT`
- **Auth Required:** Yes

**Headers:**
```
x-api-key: your-api-key
Content-Type: application/json
```

**URL Parameters:**
- `id` (required): MongoDB ObjectId of the product

**Request Body:**
All fields are optional. Only include fields you want to update.

| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Product name (min 2 characters) |
| `description` | String | Product description |
| `price` | Number | Product price (must be >= 0) |
| `category` | String | Product category |
| `inStock` | Boolean | Stock availability |

**Example Request:**
```bash
curl -X PUT \
  -H "x-api-key: your-secret-api-key-12345" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 1199.99,
    "inStock": false
  }' \
  http://localhost:3000/api/products/6705abc123def456790
```

**Success Response (200):**
```json
{
  "success": true,
  "product": {
    "_id": "6705abc123def456790",
    "name": "Gaming Laptop",
    "description": "High-performance gaming laptop with RTX 4080",
    "price": 1199.99,
    "category": "electronics",
    "inStock": false,
    "createdAt": "2024-10-08T09:30:00.000Z",
    "updatedAt": "2024-10-08T09:45:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

### 7. Delete Product
Delete a product by ID.

- **URL:** `/api/products/:id`
- **Method:** `DELETE`
- **Auth Required:** Yes

**URL Parameters:**
- `id` (required): MongoDB ObjectId of the product

**Example Request:**
```bash
curl -X DELETE \
  -H "x-api-key: your-secret-api-key-12345" \
  http://localhost:3000/api/products/6705abc123def456790
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product deleted"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

### 8. Search Products
Search for products by name or description using full-text search.

- **URL:** `/api/products/search`
- **Method:** `GET`
- **Auth Required:** Yes

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | String | Yes | Search term (min 2 characters) |

**Example Request:**
```bash
curl -H "x-api-key: your-secret-api-key-12345" \
  "http://localhost:3000/api/products/search?q=laptop"
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "items": [
    {
      "_id": "6705abc123def456789",
      "name": "MacBook Pro 16\"",
      "description": "High-performance laptop with M3 Pro chip",
      "price": 2499.99,
      "category": "electronics",
      "inStock": true
    },
    {
      "_id": "6705abc123def456790",
      "name": "Gaming Laptop",
      "description": "High-performance gaming laptop with RTX 4080",
      "price": 1199.99,
      "category": "electronics",
      "inStock": false
    }
  ]
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Query parameter \"q\" must be at least 2 characters"
}
```

---

### 9. Get Category Statistics
Get aggregated statistics for all product categories.

- **URL:** `/api/products/stats/category`
- **Method:** `GET`
- **Auth Required:** Yes

**Example Request:**
```bash
curl -H "x-api-key: your-secret-api-key-12345" \
  http://localhost:3000/api/products/stats/category
```

**Success Response (200):**
```json
{
  "success": true,
  "stats": [
    {
      "_id": "electronics",
      "count": 3,
      "avgPrice": 1333.32
    },
    {
      "_id": "kitchen",
      "count": 2,
      "avgPrice": 109.99
    }
  ]
}
```

---

## Error Handling

The API uses standard HTTP status codes and returns errors in a consistent format.

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created (successful POST) |
| 400 | Bad Request (invalid input) |
| 401 | Unauthorized (missing or invalid API key) |
| 404 | Not Found (resource doesn't exist) |
| 422 | Unprocessable Entity (validation error) |
| 500 | Internal Server Error |

### Error Response Format

```json
{
  "success": false,
  "message": "Error message describing what went wrong",
  "details": "Additional error details (optional)"
}
```

### Common Errors

**Missing API Key (401):**
```json
{
  "success": false,
  "message": "Invalid or missing API key"
}
```

**Validation Error (422):**
```json
{
  "success": false,
  "message": "Field \"price\" must be a non-negative number"
}
```

**Resource Not Found (404):**
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

## Examples

### Real API Request and Response Examples

Below are actual examples of API requests and their corresponding responses from a running instance of the Product API.

---

#### Example 1: Get All Products (Paginated)

**Request:**
```http
GET http://localhost:3000/api/products/
```

**Headers:**
```
x-api-key: your-secret-api-key-12345
```

**Response:** `200 OK`
```json
{
    "success": true,
    "page": 1,
    "limit": 10,
    "total": 5,
    "items": [
        {
            "_id": "68e5464d12ff79b4e84c043a",
            "name": "Blender Pro 3000",
            "description": "Professional-grade blender with 10 speed settings and 2L capacity",
            "price": 89.99,
            "category": "kitchen",
            "inStock": false,
            "__v": 0,
            "createdAt": "2025-10-07T16:56:45.689Z",
            "updatedAt": "2025-10-07T16:56:45.689Z"
        },
        {
            "_id": "68e5464d12ff79b4e84c0438",
            "name": "Mechanical Keyboard",
            "description": "RGB mechanical keyboard with Cherry MX switches",
            "price": 149.99,
            "category": "electronics",
            "inStock": true,
            "__v": 0,
            "createdAt": "2025-10-07T16:56:45.688Z",
            "updatedAt": "2025-10-07T16:56:45.688Z"
        },
        {
            "_id": "68e5464d12ff79b4e84c0439",
            "name": "Smart Coffee Maker",
            "description": "WiFi-enabled programmable coffee maker with mobile app control",
            "price": 129.99,
            "category": "kitchen",
            "inStock": true,
            "__v": 0,
            "createdAt": "2025-10-07T16:56:45.688Z",
            "updatedAt": "2025-10-07T16:56:45.688Z"
        },
        {
            "_id": "68e5464d12ff79b4e84c0437",
            "name": "Wireless Gaming Mouse",
            "description": "Ergonomic wireless gaming mouse with RGB lighting and 16000 DPI",
            "price": 79.99,
            "category": "electronics",
            "inStock": true,
            "__v": 0,
            "createdAt": "2025-10-07T16:56:45.687Z",
            "updatedAt": "2025-10-07T16:56:45.687Z"
        },
        {
            "_id": "68e5464d12ff79b4e84c0436",
            "name": "MacBook Pro 16\"",
            "description": "High-performance laptop with M3 Pro chip, 16GB RAM, and 512GB SSD",
            "price": 2499.99,
            "category": "electronics",
            "inStock": true,
            "__v": 0,
            "createdAt": "2025-10-07T16:56:45.681Z",
            "updatedAt": "2025-10-07T16:56:45.681Z"
        }
    ]
}
```

**Notes:**
- Returns 5 products out of a total of 5 in the database
- Products are sorted by creation date (newest first)
- Default pagination shows page 1 with 10 items per page
- Each product includes MongoDB metadata (`_id`, `__v`, `createdAt`, `updatedAt`)

---

#### Example 2: Search Products by Keyword

**Request:**
```http
GET http://localhost:3000/api/products/search?q=laptop
```

**Headers:**
```
x-api-key: 123-12345
```

**Query Parameters:**
- `q=laptop` - Search term to find in product name or description

**Response:** `200 OK`
```json
{
    "success": true,
    "count": 1,
    "items": [
        {
            "_id": "68e5464d12ff79b4e84c0436",
            "name": "MacBook Pro 16\"",
            "description": "High-performance laptop with M3 Pro chip, 16GB RAM, and 512GB SSD",
            "price": 2499.99,
            "category": "electronics",
            "inStock": true,
            "__v": 0,
            "createdAt": "2025-10-07T16:56:45.681Z",
            "updatedAt": "2025-10-07T16:56:45.681Z"
        }
    ]
}
```

**Notes:**
- Full-text search matches the term "laptop" in the product description
- Returns 1 matching product
- Search is case-insensitive and searches both `name` and `description` fields
- Maximum of 50 results are returned per search query

---

#### Example 3: Get Category Statistics

**Request:**
```http
GET http://localhost:3000/api/products/stats/category
```

**Headers:**
```
x-api-key: 123-12345
```

**Response:** `200 OK`
```json
{
    "success": true,
    "stats": [
        {
            "_id": "electronics",
            "count": 3,
            "avgPrice": 909.99
        },
        {
            "_id": "kitchen",
            "count": 2,
            "avgPrice": 109.99
        }
    ]
}
```

**Notes:**
- Statistics are aggregated by product category
- `_id` represents the category name
- `count` shows the total number of products in that category
- `avgPrice` displays the average price of products in that category
- Results are sorted by count in descending order (most products first)
- Categories: electronics has 3 products averaging $909.99, kitchen has 2 products averaging $109.99

---

### Additional Usage Examples

#### Example 4: Filter Products by Category

**Request:**
```http
GET http://localhost:3000/api/products?category=electronics
```

**Expected Response:**
Returns only products in the "electronics" category (3 items: MacBook Pro, Wireless Gaming Mouse, Mechanical Keyboard)

---

#### Example 5: Filter by Price Range

**Request:**
```http
GET http://localhost:3000/api/products?minPrice=100&maxPrice=200
```

**Expected Response:**
Returns products priced between $100 and $200 (Mechanical Keyboard at $149.99, Smart Coffee Maker at $129.99)

---

#### Example 6: Filter by Stock Availability

**Request:**
```http
GET http://localhost:3000/api/products?inStock=true
```

**Expected Response:**
Returns only products that are currently in stock (4 out of 5 products)

---

#### Example 7: Combined Filters with Pagination

**Request:**
```http
GET http://localhost:3000/api/products?category=electronics&inStock=true&page=1&limit=5
```

**Expected Response:**
Returns in-stock electronics products on page 1 with a limit of 5 items per page

---

### CRUD Operation Examples

#### Create a New Product

**Request:**
```http
POST http://localhost:3000/api/products
Content-Type: application/json
x-api-key: your-secret-api-key-12345

{
    "name": "Wireless Headphones",
    "description": "Noise-cancelling over-ear headphones with 30-hour battery",
    "price": 199.99,
    "category": "electronics",
    "inStock": true
}
```

**Expected Response:** `201 Created`
```json
{
    "success": true,
    "product": {
        "_id": "68e5464d12ff79b4e84c043b",
        "name": "Wireless Headphones",
        "description": "Noise-cancelling over-ear headphones with 30-hour battery",
        "price": 199.99,
        "category": "electronics",
        "inStock": true,
        "createdAt": "2025-10-08T10:00:00.000Z",
        "updatedAt": "2025-10-08T10:00:00.000Z",
        "__v": 0
    }
}
```

---

#### Update a Product

**Request:**
```http
PUT http://localhost:3000/api/products/68e5464d12ff79b4e84c0436
Content-Type: application/json
x-api-key: your-secret-api-key-12345

{
    "price": 2299.99,
    "inStock": false
}
```

**Expected Response:** `200 OK`
```json
{
    "success": true,
    "product": {
        "_id": "68e5464d12ff79b4e84c0436",
        "name": "MacBook Pro 16\"",
        "description": "High-performance laptop with M3 Pro chip, 16GB RAM, and 512GB SSD",
        "price": 2299.99,
        "category": "electronics",
        "inStock": false,
        "createdAt": "2025-10-07T16:56:45.681Z",
        "updatedAt": "2025-10-08T10:05:00.000Z",
        "__v": 0
    }
}
```

---

#### Delete a Product

**Request:**
```http
DELETE http://localhost:3000/api/products/68e5464d12ff79b4e84c043a
x-api-key: your-secret-api-key-12345
```

**Expected Response:** `200 OK`
```json
{
    "success": true,
    "message": "Product deleted"
}
```

---

### Error Response Examples

#### Missing API Key

**Request:**
```http
GET http://localhost:3000/api/products
```

**Response:** `401 Unauthorized`
```json
{
    "success": false,
    "message": "Invalid or missing API key"
}
```

---

#### Invalid Product ID

**Request:**
```http
GET http://localhost:3000/api/products/invalid-id-123
x-api-key: your-secret-api-key-12345
```

**Response:** `404 Not Found`
```json
{
    "success": false,
    "message": "Product not found"
}
```

---

#### Validation Error

**Request:**
```http
POST http://localhost:3000/api/products
Content-Type: application/json
x-api-key: your-secret-api-key-12345

{
    "name": "A",
    "price": -10,
    "category": "electronics"
}
```

**Response:** `422 Unprocessable Entity`
```json
{
    "success": false,
    "message": "Field \"name\" must be a string with length >= 2"
}
```

---

#### Search Query Too Short

**Request:**
```http
GET http://localhost:3000/api/products/search?q=a
x-api-key: your-secret-api-key-12345
```

**Response:** `400 Bad Request`
```json
{
    "success": false,
    "message": "Query parameter \"q\" must be at least 2 characters"
}
```

---

## Postman Collection

### Setting up Postman

1. **Import the collection** (if provided) or create requests manually
2. **Set up Collection Variables:**
   - Go to your collection settings
   - Add variable: `baseUrl` = `http://localhost:3000`
   - Add variable: `apiKey` = `your-api-key-here`

3. **Use variables in requests:**
   - URL: `{{baseUrl}}/api/products`
   - Header: `x-api-key: {{apiKey}}`

### Sample Requests in Postman

**GET All Products:**
- Method: GET
- URL: `{{baseUrl}}/api/products?page=1&limit=10`
- Headers: `x-api-key: {{apiKey}}`

**POST Create Product:**
- Method: POST
- URL: `{{baseUrl}}/api/products`
- Headers: 
  - `x-api-key: {{apiKey}}`
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "name": "Test Product",
  "price": 99.99,
  "category": "test"
}
```

---

## Project Structure

```
.
├── configs/
│   └── database.js          # MongoDB connection configuration
├── middleware/
│   ├── auth.js             # API key authentication middleware
│   ├── errorHandler.js     # Global error handling middleware
│   ├── logger.js           # Request logging middleware
│   └── validator.js        # Request validation middleware
├── models/
│   ├── products.js         # Product Mongoose schema and model
│   └── seed.js             # Database seeding script
├── routes/
│   └── productRoutes.js    # Product API routes
├── utils/
│   └── customErrors.js     # Custom error classes
├── .env                    # Environment variables (not in repo)
├── .env.example            # Example environment variables
├── .gitignore              # Git ignore file
├── package.json            # Project dependencies
├── README.md               # This file (API documentation)
├── README2.md              # Original README.md file
├── Week2-Assignment.md     # Assignment instructions
└── server.js               # Main Express server file
```

---

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **dotenv** - Environment variable management
- **CORS** - Cross-Origin Resource Sharing

---

## License

ISC

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Support

For issues and questions, please open an issue in the GitHub repository.

---

## Acknowledgments

This project was created as part of the Express.js RESTful API assignment for learning purposes.