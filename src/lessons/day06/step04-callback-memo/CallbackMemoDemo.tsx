
import { memo, useCallback, useState } from 'react';

type UserItemProps = {
  username: string;
  onDelete: (id: number) => void;
};

// 使用 React.memo
const UserItem = memo(function UserItem({
  username,
  onDelete
}: UserItemProps) {
  console.log('UserItem rendered:', username);

  return (
    <div>
      <h3>{username}</h3>
      <button onClick={() => onDelete(101)}>
        Delete
      </button>
    </div>
  );
});

function CallbackMemoDemo() {
  const [count, setCount] = useState(0);

  // 普通函数：每次渲染都会创建新引用
  const handleNormalDelete = (id: number) => {
    console.log('Normal delete:', id);
  };

  // useCallback：依赖不变时保持函数引用稳定
  const handleOptimizedDelete = useCallback((id: number) => {
    console.log('Optimized delete:', id);
  }, []);

  console.log('Parent rendered');

  return (
    <div>
      <h2>useCallback + React.memo Demo</h2>

      <button onClick={() => setCount(prev => prev + 1)}>
        Increase Count: {count}
      </button>

      <hr />

      <h3>Normal Function</h3>
      <UserItem
        username="Tom"
        onDelete={handleNormalDelete}
      />

      <hr />

      <h3>useCallback Function</h3>
      <UserItem
        username="Jerry"
        onDelete={handleOptimizedDelete}
      />
    </div>
  );
}

export default CallbackMemoDemo;
