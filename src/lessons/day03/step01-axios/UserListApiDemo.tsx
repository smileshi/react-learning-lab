
import { useState } from 'react';
import http from '../../../api/http';

type User = {
  id: number;
  username: string;
  email: string;
  role: string;
};

function UserListApiDemo() {

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoadUsers = async () => {

    try {
      setLoading(true);
      setError('');

      const response = await http.get<User[]>('/api/users');

      console.log('Response:', response);
      console.log('Response Data:', response.data);
      console.log('Response Status:', response.status);

      setUsers(response.data);

    } catch (err) {
      console.error('Failed to load users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Banking System - User List</h2>

      <button
        onClick={handleLoadUsers}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Load Users'}
      </button>

      {error && (
        <p style={{ color: 'red' }}>{error}</p>
      )}

      <hr />

      {users.map(user => (
        <div key={user.id}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default UserListApiDemo;
