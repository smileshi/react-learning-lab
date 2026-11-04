import { useState } from 'react';

// 表单数据类型
type UserFormData = {
  username: string;
  email: string;
  role: string;
};

// 错误信息类型
type FormErrors = {
  username: string;
  email: string;
  role: string;
};

function UserValidationDemo() {

  // 表单数据State
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    email: '',
    role: 'BANK_USER'
  });

  // 表单错误State
  const [errors, setErrors] = useState<FormErrors>({
    username: '',
    email: '',
    role: ''
  });

  // 统一处理表单输入变化
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
      email: '',
      role: ''
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

    // Role校验
    if (
      !['ADMIN', 'BANK_USER', 'APPROVER', 'VIEWER'].includes(formData.role)
    ) {
      newErrors.role = 'Invalid role';
    }

    setErrors(newErrors);

    // 所有字段都没有错误才返回true
    return !newErrors.username &&
           !newErrors.email &&
           !newErrors.role;
  };

  // 表单提交
  const handleSubmit = () => {

    const isValid = validateForm();

    if (!isValid) {
      console.log('Validation failed');
      return;
    }

    console.log('Validation passed');
    console.log('Form Data:', formData);

    alert('Validation passed!');
  };

  return (
    <div>
      <h2>Banking System - User Validation</h2>

      {/* Username */}
      <div>
        <label>Username</label>

        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter username"
        />

        {errors.username && (
          <p style={{ color: 'red' }}>
            {errors.username}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label>Email</label>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email"
        />

        {errors.email && (
          <p style={{ color: 'red' }}>
            {errors.email}
          </p>
        )}
      </div>

      {/* Role */}
      <div>
        <label>Role</label>

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="ADMIN">Admin</option>
          <option value="BANK_USER">Bank User</option>
          <option value="APPROVER">Approver</option>
          <option value="VIEWER">Viewer</option>
        </select>

        {errors.role && (
          <p style={{ color: 'red' }}>
            {errors.role}
          </p>
        )}
      </div>

      <button type="button" onClick={handleSubmit}>
        Validate
      </button>

      <hr />

      <h3>Current Form Data</h3>

      <pre>
        {JSON.stringify(formData, null, 2)}
      </pre>

      <h3>Current Errors</h3>

      <pre>
        {JSON.stringify(errors, null, 2)}
      </pre>
    </div>
  );
}

export default UserValidationDemo;