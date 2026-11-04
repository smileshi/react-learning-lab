
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';

import { userService } from '../../../services/userService';
import type {
  User,
  CreateUserRequest
} from '../../../types/user';

const initialForm: CreateUserRequest = {
  username: '',
  email: '',
  role: 'BANK_USER'
};

function UserManagementDemo() {
  // User list states
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  // Create user form states
  const [form, setForm] = useState<CreateUserRequest>(initialForm);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof CreateUserRequest, string>>
  >({});

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // GET /api/users
  const loadUsers = async () => {
    try {
      setLoading(true);
      setLoadError('');

      const data = await userService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Load users failed:', err);
      setLoadError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  // Load users when the component mounts
  useEffect(() => {
    void loadUsers();
  }, []);

  // Validate form
  const validateForm = (): boolean => {
    const errors: Partial<
      Record<keyof CreateUserRequest, string>
    > = {};

    if (!form.username.trim()) {
      errors.username = 'Username is required';
    }

    if (!form.email.trim()) {
      errors.email = 'Email is required';
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      errors.email = 'Invalid email address';
    }

    if (!form.role) {
      errors.role = 'Role is required';
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  // POST /api/users
  const handleCreateUser = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setSubmitError('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      await userService.createUser({
        username: form.username.trim(),
        email: form.email.trim(),
        role: form.role
      });

      setSuccessMessage('User created successfully!');
      setForm({ ...initialForm });
      setFormErrors({});

      // Refresh user list
      await loadUsers();
    } catch (err) {
      console.error('Create user failed:', err);
      setSubmitError('Failed to create user.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 800 }}>
      <h2>Banking System - User Management</h2>

      {/* Create User Form */}
      <section style={{ marginBottom: 32 }}>
        <h3>Add User</h3>

        <form onSubmit={handleCreateUser} noValidate>
          <div style={{ marginBottom: 12 }}>
            <label htmlFor="username">Username</label>
            <br />
            <input
              id="username"
              value={form.username}
              onChange={(e) =>
                setForm(prev => ({
                  ...prev,
                  username: e.target.value
                }))
              }
              disabled={submitting}
            />

            {formErrors.username && (
              <p style={{ color: 'red' }}>
                {formErrors.username}
              </p>
            )}
          </div>

          <div style={{ marginBottom: 12 }}>
            <label htmlFor="email">Email</label>
            <br />
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm(prev => ({
                  ...prev,
                  email: e.target.value
                }))
              }
              disabled={submitting}
            />

            {formErrors.email && (
              <p style={{ color: 'red' }}>
                {formErrors.email}
              </p>
            )}
          </div>

          <div style={{ marginBottom: 12 }}>
            <label htmlFor="role">Role</label>
            <br />
            <select
              id="role"
              value={form.role}
              onChange={(e) =>
                setForm(prev => ({
                  ...prev,
                  role: e.target.value
                }))
              }
              disabled={submitting}
            >
              <option value="BANK_USER">Bank User</option>
              <option value="ADMIN">Admin</option>
            </select>

            {formErrors.role && (
              <p style={{ color: 'red' }}>
                {formErrors.role}
              </p>
            )}
          </div>

          {submitError && (
            <p role="alert" style={{ color: 'red' }}>
              {submitError}
            </p>
          )}

          {successMessage && (
            <p role="status" style={{ color: 'green' }}>
              {successMessage}
            </p>
          )}

          <button type="submit" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </section>

      <hr />

      {/* User List */}
      <section>
        <h3>User List</h3>

        <button
          type="button"
          onClick={() => void loadUsers()}
          disabled={loading}
        >
          Refresh
        </button>

        {loading && <p>Loading users...</p>}

        {loadError && !loading && (
          <div>
            <p role="alert" style={{ color: 'red' }}>
              {loadError}
            </p>
            <button
              type="button"
              onClick={() => void loadUsers()}
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !loadError && users.length === 0 && (
          <p>No users found.</p>
        )}

        {!loading && !loadError && users.length > 0 && (
          <table
            border={1}
            cellPadding={8}
            style={{ marginTop: 16, width: '100%' }}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default UserManagementDemo;
