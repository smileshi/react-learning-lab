import type { User } from '../../../types/user';
import UserRole from '../step01-conditional/UserRole';

type UserItemProps = {
  user: User;
  onDelete?: (id: number) => void;
};

function UserItem({ user, onDelete}: UserItemProps) {
  return (
    <div>
      <h3>{user.username}</h3>
      <p>{user.email}</p>
      <UserRole role={user.role} />
      {onDelete && <button onClick={() => onDelete(user.id)}>
        Delete
      </button>}
      <hr />
    </div>
  );
}

export default UserItem;