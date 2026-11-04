# Day 2 - Step 3: Form Submission & JSON

## 1. Learning Objectives

Understand how React form data is prepared and submitted to a Java Spring Boot backend.

## 2. Core Knowledge

### Form Submission

- `onSubmit`: Handles form submission.
- `React.FormEvent`: TypeScript type for form events.
- `e.preventDefault()`: Prevents the browser's default form submission.

### JSON Data

- JavaScript Object
- JSON.stringify()
- Request Body
- Frontend and backend DTO field mapping

## 3. Demo Files

- UserSubmitDemo.tsx

## 4. Business Scenario

Banking System User Management.

The administrator creates a user by entering:

- Username
- Email
- Role

## 5. Backend API Contract

**Method:** POST

**Endpoint:** `/api/users`

**Request Body:**

```json
{
  "username": "Tom",
  "email": "tom@example.com",
  "role": "BANK_USER"
}
```

## 6. Java Backend Mapping

React JSON is mapped to a Java DTO using Spring Boot `@RequestBody`.

## 7. Learning Outcome

Implement form submission, organize request payloads, and understand how frontend JSON maps to Java backend DTOs.

## 8.Spring Boot 通过 Jackson 将 JSON 转换成 Java DTO
React JavaScript Object
        |
        v
Axios 序列化为 JSON
        |
        v
HTTP Request Body
        |
        v
Spring Boot @RequestBody
        |
        v
Jackson 转换
        |
        v
CreateUserRequest Java Object