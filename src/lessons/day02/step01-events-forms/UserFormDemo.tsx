import { useState } from 'react';

type UserFormData = {
  username: string;
  email: string;
  role: string;
};

function UserFormDemo() {

  // 表单State
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    email: '',
    role: 'DEVELOPER'
  });

  // 统一处理输入框变化
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <h2>User Registration</h2>

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
          <option value="DEVELOPER">Developer</option>
          <option value="TESTER">Tester</option>
        </select>
      </div>

      <hr />

      <h3>Current Form State</h3>

      <pre>
        {JSON.stringify(formData, null, 2)}
      </pre>
    </div>
  );
}

export default UserFormDemo;