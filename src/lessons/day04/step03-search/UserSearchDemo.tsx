
import { useState } from 'react';
import type { User } from '../../../types/user';
import UserList from '../step02-list/UserList';

function UserSearchDemo() {

  const users: User[] = [
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

  const [keyword, setKeyword] = useState('');

  const filteredUsers = users.filter(user => {
    const searchText = keyword.toLowerCase();

    return (
      user.username.toLowerCase().includes(searchText) ||
      user.email.toLowerCase().includes(searchText) ||
      user.role.toLowerCase().includes(searchText)
    );
  });

  return (
    <div>
      <h2>Banking System - User Search</h2>

      <input
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        placeholder="Search username, email or role"
      />

      <p>
        Found {filteredUsers.length} users
      </p>

      <UserList users={filteredUsers} />
    </div>
  );
}

export default UserSearchDemo;
