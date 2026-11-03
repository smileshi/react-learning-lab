type User = {
  id: number;
  name: string;
};

type UserItemProps = {
  user: User;
  onDelete: (id: number) => void;
};

// 子组件
function UserItem({ user, onDelete }: UserItemProps) {
  return (
    <div>
      <span>{user.name}</span>

      <button onClick={() => onDelete(user.id)}>
        Delete
      </button>
    </div>
  );
}

export default UserItem;