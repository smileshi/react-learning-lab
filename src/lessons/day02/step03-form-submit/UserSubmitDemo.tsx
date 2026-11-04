import { useState } from 'react';

type UserFormData = {
  username: string;
  email: string;
  role: string;
};

function UserSubmitDemo() {

  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    email: '',
    role: 'BANK_USER'
  });

  const [submittedData, setSubmittedData] =
    useState<UserFormData | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

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
        </div>

        <div>
          <label>Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
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

export default UserSubmitDemo;