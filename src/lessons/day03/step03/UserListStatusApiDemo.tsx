import { useEffect, useState } from 'react';
import http from '../../../api/http';

type User = {
  id: number;
  username: string;
  email: string;
  role: string;
};

function UserListStatusApiDemo() {

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await http.get<User[]>('/api/users');

      setUsers(response.data);

    } catch (err) {
      console.error('Failed to load users:', err);
      setError('Failed to load users. Please try again.');

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div>
      <h2>Banking System - User List</h2>

      {loading && <p>Loading users...</p>}

      {error && (
        <div>
          <p style={{ color: 'red' }}>{error}</p>
          <button onClick={loadUsers}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && users.length === 0 && (
        <p>No users found.</p>
      )}

      {!loading && !error && users.length > 0 && (
        <div>
          {users.map(user => (
            <div key={user.id}>
              <p>Username: {user.username}</p>
              <p>Email: {user.email}</p>
              <p>Role: {user.role}</p>
              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserListStatusApiDemo;
