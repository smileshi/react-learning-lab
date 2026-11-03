type User = {
  id: number;
  name: string;
  active: boolean;
};

function JsxDemo() {
  const title = 'User Management';

  const users: User[] = [
    { id: 101, name: 'Tom', active: true },
    { id: 102, name: 'Jerry', active: false },
    { id: 103, name: 'Jack', active: true }
  ];

  return (
    <div>
      <h2>{title}</h2>

      {/* 条件渲染 */}
      <p>
        {users.length > 0
          ? 'Users found'
          : 'No users found'}
      </p>

      {/* 列表渲染 */}
      {users.map(user => (
        <div key={user.id}>
          <span>{user.name}</span>

          {/* 条件显示按钮 */}
          {user.active && (
            <button>Disable</button>
          )}
        </div>
      ))}
    </div>
  );
}

export default JsxDemo;