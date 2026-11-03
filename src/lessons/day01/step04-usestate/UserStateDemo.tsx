import { useState } from 'react';

type User = {
  id: number;
  name: string;
};

function UserStateDemo() {
  // 初始化用户State
  const [users, setUsers] = useState<User[]>([
    { id: 101, name: 'Tom' },
    { id: 102, name: 'Jerry' },
    { id: 103, name: 'Jack' }
  ]);

  const [username, setUsername] = useState('');

  // 删除用户
  const handleDelete = (id: number) => {
    setUsers(prevUsers =>
      prevUsers.filter(user => user.id !== id)
    );
  };

  // 新增用户
  const handleAdd = () => {
    if (!username.trim()) {
      return;
    }

    const newUser: User = {
      id: Date.now(),
      name: username.trim()
    };

    setUsers(prevUsers => [...prevUsers, newUser]);

    setUsername('');
  };

  return (
    <div>
      <h2>useState Demo</h2>

      <p>Total Users: {users.length}</p>

      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Enter username"
      />

      <button onClick={handleAdd}>
        Add User
      </button>

      <hr />

      {users.map(user => (
        <div key={user.id}>
          <span>{user.name}</span>

          <button onClick={() => handleDelete(user.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default UserStateDemo;