import type { User } from '../../../types/user';
import UserItem from './UserItem';

type Props = {
  users: User[];
  onDelete: (id: number) => void;
};

function UserList({ users, onDelete }: Props) {
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
}

export default UserList;