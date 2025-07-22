# 🐶 Dog Breeds Management API

This is a simple API project built with Node.js and Express for managing dog breeds and user authentication. It supports CRUD operations for dog breeds and sub-breeds and basic login/logout functionality.

---

## 🚀 Getting Started

### Install dependencies

```bash
npm install
```

### Run the server

```bash
node index.js
```

Server will start at: `http://localhost:3000`

---

## 📁 Folder Structure

```
project-root/
├── model/
│   ├── dogs.json               # Stores breeds and sub-breeds
│   └── login-credentials.json  # Stores user login credentials
├── index.js                    # Main server file
└── README.md                   # API documentation
```

---

## 📌 API Endpoints

---

### 🔐 Authentication

#### ✅ Login

**POST /api/login**

Logs in a user.

- **Request body:**

```json
{
  "email": "test@gmail.com",
  "password": "abcdef"
}
```

- **Response:** 200 OK if successful

- **curl:**

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@gmail.com", "password": "abcdef"}'
```

---

#### 🔒 Logout

**POST /api/logout**

Logs out the user.

- **curl:**

```bash
curl -X POST http://localhost:3000/api/logout
```

---

#### 🔎 Verify Login

**POST /api/verifylogin**

Verifies if the user is logged in.

- **Response:**

```json
{ "isLoggedIn": true }
```

- **curl:**

```bash
curl -X POST http://localhost:3000/api/verifylogin
```

---

### 🐕 Dog Breeds API

---

#### 📥 Get All Breeds

**GET /api/breeds**

Returns all dog breeds with their sub-breeds.

- **curl:**

```bash
curl http://localhost:3000/api/breeds
```

---

#### ➕ Add New Breed

**POST /api/breeds**

Add a new breed with optional sub-breeds.

- **Request body:**

```json
{
  "breed": "husky",
  "subBreeds": ["siberian", "alaskan"]
}
```

- **curl:**

```bash
curl -X POST http://localhost:3000/api/breeds \
  -H "Content-Type: application/json" \
  -d '{"breed": "husky", "subBreeds": ["siberian", "alaskan"]}'
```

---

#### 📝 Update Sub-Breeds of a Breed

**PUT /api/breeds/:breed/subbreeds**

Replaces the sub-breeds for a specific breed.

- **Request body:**

```json
{
  "subBreeds": ["mini", "standard"]
}
```

- **Example URL:** `/api/breeds/husky/subbreeds`

- **curl:**

```bash
curl -X PUT http://localhost:3000/api/breeds/husky/subbreeds \
  -H "Content-Type: application/json" \
  -d '{"subBreeds": ["mini", "standard"]}'
```

---

#### ❌ Delete a Breed

**DELETE /api/breeds/:breed**

Deletes the specified breed.

- **Example URL:** `/api/breeds/husky`

- **curl:**

```bash
curl -X DELETE http://localhost:3000/api/breeds/husky
```

---

## 📌 Sample Data Format

### `dogs.json`

```json
{
  "husky": ["siberian", "alaskan"],
  "labrador": []
}
```

### `login-credentials.json`

```json
{
  "email": "test@gmail.com",
  "password": "abcdef",
  "isLoggedIn": false
}
```

---

## 🛠 Technologies Used

- Node.js
- Express

