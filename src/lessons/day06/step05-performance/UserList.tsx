import { memo } from 'react';
import type { User } from '../../../types/user';
import UserItem from './UserItem';

type Props = {
  users: User[];
  onDelete: (id: number) => void;
};

const UserList = memo(function UserList({
  users,
  onDelete
}: Props) {
  console.log('UserList rendered');

  if (users.length === 0) {
    return <p>No users found.</p>;
  }

  return (
    <div>
      {users.map(user => (
        <UserItem
          key={user.id}
          user={user}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
});

export default UserList;