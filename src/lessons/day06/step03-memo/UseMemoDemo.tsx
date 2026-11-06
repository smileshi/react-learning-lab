
import { useMemo, useState } from 'react';
import type { User } from '../../../types/user';

const mockUsers: User[] = [
  { id: 101, username: 'Tom', email: 'tom@example.com', role: 'ADMIN' },
  { id: 102, username: 'Jerry', email: 'jerry@example.com', role: 'BANK_USER' },
  { id: 103, username: 'Jack', email: 'jack@example.com', role: 'BANK_USER' },
  { id: 104, username: 'Alice', email: 'alice@example.com', role: 'ADMIN' }
];

function UseMemoDemo() {
  const [count, setCount] = useState(0);
  const [role, setRole] = useState('ADMIN');

  const filteredUsers = useMemo(() => {
    console.log('Filtering users...');

    return mockUsers.filter(user => user.role === role);
  }, [role]);

  return (
    <div>
      <h2>useMemo Demo</h2>

      <p>Count: {count}</p>

      <button onClick={() => setCount(prev => prev + 1)}>
        Increase Count
      </button>

      <div>
        <label>Filter Role: </label>

        <select
          value={role}
          onChange={e => setRole(e.target.value)}
        >
          <option value="ADMIN">ADMIN</option>
          <option value="BANK_USER">BANK_USER</option>
        </select>
      </div>

      <h3>Filtered Users</h3>

      <p>Total: {filteredUsers.length}</p>

      {filteredUsers.map(user => (
        <div key={user.id}>
          {user.username} - {user.role}
        </div>
      ))}
    </div>
  );
}

export default UseMemoDemo;
