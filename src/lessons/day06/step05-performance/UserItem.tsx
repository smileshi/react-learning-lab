
import { memo } from 'react';
import type { User } from '../../../types/user';
import UserRole from '../../day04/step01-conditional/UserRole';


type UserItemProps = {
  user: User;
  onDelete: (id: number) => void;
};

const UserItem = memo(function UserItem({
  user,
  onDelete
}: UserItemProps) {
  console.log('UserItem rendered:', user.username);

  return (
    <div>
      <h3>{user.username}</h3>
      <p>{user.email}</p>
      <UserRole role={user.role} />

      <button onClick={() => onDelete(user.id)}>
        Delete
      </button>

      <hr />
    </div>
  );
});

export default UserItem;
