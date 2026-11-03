import { useEffect, useState } from 'react';

type User = {
  id: number;
  name: string;
};

function UserEffectDemo() {
  const [userId, setUserId] = useState(101);

  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setUser(null);

    console.log('Loading user:', userId);

    // 模拟后端接口请求
    const timer = setTimeout(() => {
      if (!cancelled) {
        setUser({
          id: userId,
          name: userId === 101 ? 'Tom' : 'Jerry'
        });

        setLoading(false);
      }
    }, 1000);

    // Cleanup
    return () => {
      cancelled = true;
      clearTimeout(timer);

      console.log('Cleanup user:', userId);
    };

  }, [userId]);

  return (
    <div>
      <h2>useEffect Demo</h2>

      <p>Current User ID: {userId}</p>

      <button onClick={() => setUserId(101)}>
        User 101
      </button>

      <button onClick={() => setUserId(102)}>
        User 102
      </button>

      {loading && <p>Loading...</p>}

      {user && (
        <div>
          <p>ID: {user.id}</p>
          <p>Name: {user.name}</p>
        </div>
      )}
    </div>
  );
}

export default UserEffectDemo;