# Day 2 - Step 1: React Events & Controlled Components

## 1. Learning Objectives

Understand how React handles user events and manages form input data.

## 2. Core Knowledge

### 2.1 React Event Handling

React uses camelCase event names.

| Event | Purpose |
|---|---|
| onClick | Handle button clicks |
| onChange | Handle input changes |
| onSubmit | Handle form submission |
| onBlur | Handle input losing focus |
| onFocus | Handle input gaining focus |
| onKeyDown | Handle keyboard events |

### 2.2 Event Handler

Pass a function reference to the event handler.

```tsx
<button onClick={handleClick}>
  Save
</button>
```

To pass parameters, use an arrow function.

```tsx
<button onClick={() => handleDelete(101)}>
  Delete
</button>
```

### 2.3 Controlled Components

A controlled component uses React State to manage the input value.

```tsx
const [username, setUsername] = useState('');

<input
  value={username}
  onChange={e => setUsername(e.target.value)}
/>
```

Key concepts:

- `value`: Controls the displayed input value.
- `onChange`: Handles user input changes.
- `e.target.value`: Gets the current input value.
- `setState`: Updates React State and triggers a re-render.

### 2.4 Form State Management

Use one State object to manage multiple form fields.

```tsx
const [formData, setFormData] = useState({
  username: '',
  email: '',
  role: 'DEVELOPER'
});
```

Update a specific field without modifying the original object.

```tsx
setFormData(prev => ({
  ...prev,
  [name]: value
}));
```

### 2.5 JSON Conversion

Convert JavaScript objects into JSON strings.

```tsx
JSON.stringify(formData, null, 2)
```

This helps inspect the data structure before sending it to the backend.

## 3. Angular Comparison

| Angular | React |
|---|---|
| `(click)` | `onClick` |
| `(input)` | `onChange` |
| `(submit)` | `onSubmit` |
| `[(ngModel)]` | `value` + `onChange` |
| Reactive Forms | State-based form management |

Note: These are conceptual comparisons; the underlying implementations are different.

## 4. Demo Files

| File | Description |
|---|---|
| UserFormDemo.tsx | User registration form |
| README.md | Learning notes and key concepts |

## 5. Practical Features

- Username input
- Email input
- Role selection
- Controlled form fields
- Unified event handling
- Real-time State updates
- JSON preview

## 6. Expected JSON

```json
{
  "username": "Tom",
  "email": "tom@example.com",
  "role": "DEVELOPER"
}
```

## 7. Key Takeaways

1. React events use camelCase naming.
2. Event handlers receive function references.
3. Controlled components use State to manage input values.
4. `onChange` updates State.
5. Spread syntax helps update objects immutably.
6. Form data can be structured as a JavaScript object and converted to JSON.

## 8. Learning Outcome

Build a controlled user registration form and understand how frontend form data is managed before submitting it to a Java Spring Boot backend.