
import { useState } from 'react';

function Header() {
  console.log('Header rendered');

  return <h3>Banking System</h3>;
}

function UserList() {
  console.log('UserList rendered');

  return (
    <div>
      <p>Tom - ADMIN</p>
      <p>Jerry - BANK_USER</p>
    </div>
  );
}

function UserForm() {
  console.log('UserForm rendered');

  const [username, setUsername] = useState('');

  return (
    <div>
      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Username"
      />

      <p>Input: {username}</p>
    </div>
  );
}

function RenderMechanismDemo() {
  console.log('Parent rendered');

  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: 24 }}>
      <h2>Day 14 - Render Mechanism</h2>

      <button onClick={() => setCount(c => c + 1)}>
        Add Count: {count}
      </button>

      <Header />

      <UserList />

      <UserForm />
    </div>
  );
}

export default RenderMechanismDemo;
