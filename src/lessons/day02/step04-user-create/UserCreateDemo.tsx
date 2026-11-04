import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

type UserFormData = {
  username: string;
  email: string;
  role: string;
};

type FormErrors = {
  username: string;
  email: string;
}

function UserCreateDemo() {

  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    email: '',
    role: 'BANK_USER'
  });

  // 表单错误State
    const [errors, setErrors] = useState<FormErrors>({
      username: '',
      email: ''
   });

  const [submittedData, setSubmittedData] =
    useState<UserFormData | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 输入变化时，清除当前字段的错误
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  // 表单校验
  const validateForm = (): boolean => {

    const newErrors: FormErrors = {
      username: '',
      email: ''
    };

    // Username校验
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    // Email校验
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = 'Invalid email format';
    }

    

    setErrors(newErrors);

    // 所有字段都没有错误才返回true
    return !newErrors.username &&
           !newErrors.email 
  };

  const handleSubmit = (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const isValid = validateForm();

    if (!isValid) {
    return;
    }

    const payload = {
      username: formData.username,
      email: formData.email,
      role: formData.role
    };

    console.log('POST /api/users', payload);

    setSubmittedData(payload);
  };

  return (
    <div>
      <h2>Banking System - Create User</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && (
          <p style={{ color: 'red' }}>
            {errors.username}
          </p>
        )}
        </div>        

        <div>
          <label>Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
          <p style={{ color: 'red' }}>
            {errors.email}
          </p>
        )}
        </div>

        <div>
          <label>Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="BANK_USER">Bank User</option>
            <option value="ADMIN">Admin</option>
            <option value="APPROVER">Approver</option>
            <option value="VIEWER">Viewer</option>
          </select>
        </div>

        <button type="submit">
          Submit
        </button>
      </form>

      {submittedData && (
        <pre>
          {JSON.stringify(submittedData, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default UserCreateDemo;