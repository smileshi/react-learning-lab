# Day 2 - Step 2: Form Validation

## 1. Learning Objectives

Understand how to implement client-side form validation in React.

Build a user registration form for a Banking System.

## 2. Business Scenario

An administrator creates a new user in the Banking System.

The form contains:

- Username
- Email
- Role

The frontend must validate user input before allowing the form to proceed.

## 3. Validation Rules

| Field | Validation Rule |
|---|---|
| Username | Required, cannot contain only spaces |
| Email | Required, must match basic email format |
| Role | Must be one of the allowed roles |

Allowed roles:

- ADMIN
- BANK_USER
- APPROVER
- VIEWER

## 4. Core Knowledge

### 4.1 Form State

Use useState to store form data.

```tsx
const [formData, setFormData] = useState({
  username: '',
  email: '',
  role: 'BANK_USER'
});
```

### 4.2 Error State

Use a separate State object to store validation errors.

```tsx
const [errors, setErrors] = useState({
  username: '',
  email: '',
  role: ''
});
```

Form data and validation errors have different responsibilities and should be managed separately.

### 4.3 String.trim()

Remove whitespace from the beginning and end of a string.

```tsx
if (!formData.username.trim()) {
  newErrors.username = 'Username is required';
}
```

This prevents users from bypassing required-field validation by entering only spaces.

### 4.4 Regular Expression

Use a regular expression to perform basic email format validation.

```tsx
/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
```

The test() method returns a Boolean value.

- true: matches the regular expression.
- false: does not match.

Note: This is basic format validation, not proof that an email address exists.

### 4.5 Array.includes()

Check whether a role belongs to the allowed role list.

```tsx
['ADMIN', 'BANK_USER', 'APPROVER', 'VIEWER']
  .includes(formData.role);
```

### 4.6 Conditional Rendering

Display validation errors only when an error message exists.

```tsx
{errors.username && (
  <p>{errors.username}</p>
)}
```

### 4.7 Immutable State Update

Update only the corresponding error field while preserving other errors.

```tsx
setErrors(prev => ({
  ...prev,
  username: ''
}));
```

## 5. Validation Function

The validateForm() function:

1. Initializes an empty error object.
2. Validates Username.
3. Validates Email.
4. Validates Role.
5. Updates errors State.
6. Returns true if all validations pass; otherwise returns false.

## 6. Demo Files

| File | Description |
|---|---|
| UserValidationDemo.tsx | User registration form with validation |
| README.md | Learning notes and explanations |

## 7. Angular Comparison

| Angular | React |
|---|---|
| Validators.required | Custom validation function |
| Validators.email | Regular expression |
| formControl.errors | errors State |
| formControl.invalid | Validation result |
| setErrors() | setErrors() State update |

These are conceptual comparisons. The implementation mechanisms are different.

## 8. Practical Features

- Controlled form inputs
- Username required validation
- Email required validation
- Email format validation
- Role validation
- Field-level error messages
- Clear error when the corresponding field changes
- Display current form data and validation errors

## 9. Important Notes

- Client-side validation improves user experience.
- Frontend validation does not replace backend validation.
- The backend must validate incoming data independently.
- A successful frontend validation does not mean the user has been saved to the database.

## 10. Learning Outcome

Implement a complete React form validation example.

Understand how form State, error State, validation functions and conditional rendering work together before submitting data to a Java Spring Boot backend.