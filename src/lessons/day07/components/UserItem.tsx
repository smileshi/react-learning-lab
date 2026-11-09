
import { memo } from 'react';
import type { User } from '../../../types/user';
import UserRole from '../../day04/step01-conditional/UserRole';


type UserItemProps = {
  user: User;
  onDelete: (id: number) => Promise<void>;
  deleting: boolean;
  deleteDisabled: boolean;  
};

const UserItem = memo(function UserItem({
  user, onDelete, deleting, deleteDisabled
}: UserItemProps) {
  console.log('UserItem rendered:', user.username);

  return (
    <div>      
      <h3>{user.username}</h3>
      <p>{user.email}</p>
      <UserRole role={user.role} />

      <button type="button" disabled={deleteDisabled} onClick={() => void onDelete(user.id)}>
        {deleting ? 'Deleting...' : 'Delete'}
      </button>

      <hr />
    </div>
  );
});

export default UserItem;
