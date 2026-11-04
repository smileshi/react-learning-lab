
import { useEffect, useState } from 'react';
import http from '../../../api/http';

type User = {
  id: number;
  username: string;
  email: string;
  role: string;
};

function UserListAutoApiDemo() {

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 查询用户
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await http.get<User[]>('/api/users');

      setUsers(response.data);

    } catch (err) {
      console.error('Failed to load users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时自动查询
  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div>
      <h2>Banking System - User List</h2>

      {loading && <p>Loading users...</p>}

      {error && (
        <p style={{ color: 'red' }}>{error}</p>
      )}

      {!loading && !error && users.length === 0 && (
        <p>No users found.</p>
      )}

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

export default UserListAutoApiDemo;
