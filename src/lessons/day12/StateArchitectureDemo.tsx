
import { useEffect, useState } from 'react';
import { userService } from '../../services/userService';
import type { User } from '../../types/user';

// UserForm：管理自己的表单状态
function UserForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  return (
    <section>
      <h3>Create User</h3>

      <input
        value={username}
        placeholder="Username"
        onChange={e => setUsername(e.target.value)}
      />

      <input
        value={email}
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
      />

      <p>Username: {username}</p>
    </section>
  );
}

// UserList：接收父组件传递的数据
function UserList({ users }: { users: User[] }) {
  return (
    <section>
      <h3>User List</h3>

      {users.map(user => (
        <p key={user.id}>
          {user.username} - {user.email}
        </p>
      ))}
    </section>
  );
}

// Page：管理页面共享状态
function StateArchitectureDemo() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadUsers = async () => {
      setLoading(true);

      try {
        const data = await userService.getUsers(
          undefined,
          controller.signal
        );

        if (!controller.signal.aborted) {
          setUsers(data);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setLoadError('Failed to load users.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void loadUsers();

    return () => controller.abort();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>State Architecture Demo</h2>

      {loading && <p>Loading...</p>}
      {loadError && <p role="alert">{loadError}</p>}

      <UserList users={users} />

      <hr />

      <UserForm />
    </div>
  );
}

export default StateArchitectureDemo;
