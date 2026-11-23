
import { useState } from 'react';
import { userService } from '../../services/userService';
import type { User } from '../../types/user';

function NetworkInspectionDemo() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('GET users failed:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Unknown error'
      );
    } finally {
      setLoading(false);
    }
  };

  const testNotFound = async () => {
  try {
    await userService.getUserById(99999);
  } catch (error) {
    console.error('404 test:', error);
  }
};

  return (
    <div style={{ padding: 24 }}>
      <h2>Day 13 - Network Inspection</h2>

      <button
        onClick={() => void loadUsers()}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Load Users'}
      </button>

      <button onClick={() => void testNotFound()}>
        Test 404
      </button>

      {error && (
        <p role="alert" style={{ color: 'red' }}>
          {error}
        </p>
      )}

      <h3>Users ({users.length})</h3>

      {users.map(user => (
        <div key={user.id}>
          {user.username} - {user.email} - {user.role}
        </div>
      ))}
    </div>
  );
}

export default NetworkInspectionDemo;
