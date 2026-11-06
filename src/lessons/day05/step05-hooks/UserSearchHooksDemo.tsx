
import {
  useCallback,
  useEffect,
  useState
} from 'react';

import type { User } from '../../../types/user';

const mockUsers: User[] = [
  {
    id: 101,
    username: 'Tom',
    email: 'tom@example.com',
    role: 'ADMIN'
  },
  {
    id: 102,
    username: 'Jerry',
    email: 'jerry@example.com',
    role: 'BANK_USER'
  },
  {
    id: 103,
    username: 'Jack',
    email: 'jack@example.com',
    role: 'BANK_USER'
  }
];

function UserSearchHooksDemo() {
  const [keyword, setKeyword] = useState('');
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [loading, setLoading] = useState(false);

  // Stable search function
  const searchUsers = useCallback((searchText: string) => {
    const result = mockUsers.filter(user =>
      user.username.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase()) ||
      user.role.toLowerCase().includes(searchText.toLowerCase())
    );

    setUsers(result);
  }, []);

  // Debounce search
  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      searchUsers(keyword);
      setLoading(false);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [keyword, searchUsers]);

  return (
    <div>
      <h2>Banking System - User Search</h2>

      <input
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        placeholder="Search username, email or role"
      />

      {loading && <p>Searching...</p>}

      {!loading && users.length === 0 && (
        <p>No users found.</p>
      )}

      {!loading && users.map(user => (
        <div key={user.id}>
          <h3>{user.username}</h3>
          <p>{user.email}</p>
          <p>{user.role}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default UserSearchHooksDemo;
