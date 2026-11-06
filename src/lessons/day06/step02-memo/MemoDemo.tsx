
import { memo, useState } from 'react';

const UserInfo = memo(function UserInfo({
  username
}: {
  username: string;
}) {
  console.log('UserInfo rendered');

  return (
    <div>
      <h3>User: {username}</h3>
    </div>
  );
});

function MemoDemo() {
  const [count, setCount] = useState(0);

  console.log('MemoDemo rendered');

  return (
    <div>
      <h2>React.memo Demo</h2>

      <p>Count: {count}</p>

      <button
        onClick={() => setCount(prev => prev + 1)}
      >
        Increase Count
      </button>

      <UserInfo username="Tom" />
    </div>
  );
}

export default MemoDemo;
