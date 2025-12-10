# User Registration Endpoint Documentation

## Endpoint: POST /users/register

### Description
This endpoint registers a new user in the system. It validates the provided credentials, checks for existing users, hashes the password, creates a new user record, and returns an authentication token along with the user details.

### HTTP Method
`POST`

### Base URL
```
/users/register
```

---

## Request Data Requirements

The endpoint expects a JSON request body with the following required fields:

### Request Body Format
```json
{
  "fullname": {
    "firstname": "string (required, minimum 3 characters)",
    "lastname": "string (optional)"
  },
  "email": "string (required, must be a valid email)",
  "password": "string (required, minimum 6 characters)"
}
```

### Field Validation Rules

| Field | Type | Required | Validation Rules | Error Message |
|-------|------|----------|------------------|---------------|
| `fullname.firstname` | String | Yes | Minimum 3 characters | "First name must be at least 3 characters long" |
| `fullname.lastname` | String | No | - | - |
| `email` | String | Yes | Valid email format | "Invalid Email" |
| `password` | String | Yes | Minimum 6 characters | "Password must be at least 6 characters long" |

### Example Request
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123"
}
```

---

## Response Status Codes

### 201 Created
**Description:** User successfully registered

**Response Body:**
```json
{
  "token": "jwt_token_string",
  "user": {
    "_id": "mongodb_user_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null
  }
}
```

---

### 400 Bad Request
**Description:** Validation failed or user already exists

**Possible Scenarios:**

1. **Validation Errors** - Invalid input data
```json
{
  "errors": [
    {
      "value": "invalid-email",
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

2. **User Already Exists** - Email is already registered
```json
{
  "message": "User already exist"
}
```

---

### 500 Internal Server Error
**Description:** Server error occurred during registration

**Response Body:**
```json
{
  "message": "Server error"
}
```

---

## Usage Example

### Using cURL
```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Using JavaScript/Fetch
```javascript
fetch('/users/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fullname: {
      firstname: 'John',
      lastname: 'Doe'
    },
    email: 'john@example.com',
    password: 'password123'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

---

## Implementation Details

- **Password Security:** Passwords are hashed using bcrypt with a salt rounds of 10 before storage
- **Authentication Token:** JWT tokens are generated with a 7-day expiration period
- **Email Uniqueness:** The system ensures that each email address is unique in the database
- **Input Validation:** All inputs are validated using express-validator before processing

---

## Notes

- The `JWT_SECRET` environment variable must be set for token generation
- Ensure MongoDB connection is established before registering users
- The `lastname` field in `fullname` is optional; `firstname` is required
- Tokens should be stored client-side and sent with subsequent requests in the Authorization header
