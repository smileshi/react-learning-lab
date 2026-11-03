import { useState } from 'react';
import UserItem from './UserItem';

type User = {
  id: number;
  name: string;
};

function UserPage() {
  const [users, setUsers] = useState<User[]>([
    { id: 101, name: 'Tom' },
    { id: 102, name: 'Jerry' },
    { id: 103, name: 'Jack' }
  ]);

  const handleDelete = (id: number) => {
    setUsers(prevUsers =>
      prevUsers.filter(user => user.id !== id)
    );
  };

  return (
    <div>
      <h2>User Management</h2>

      {users.map(user => (
        <UserItem
          key={user.id}
          user={user}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

export default UserPage;