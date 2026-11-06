
import { useEffect, useState } from 'react';

function UserPanel() {
  const [count, setCount] = useState(0);

  console.log('Component rendered');

  useEffect(() => {
    console.log('Component mounted');

    return () => {
      console.log('Component unmounted');
    };
  }, []);

  useEffect(() => {
    console.log('Count updated:', count);
  }, [count]);

  return (
    <div>
      <h3>User Panel</h3>
      <p>Count: {count}</p>

      <button onClick={() => setCount(prev => prev + 1)}>
        Increase
      </button>
    </div>
  );
}

function LifecycleDemo() {
  const [visible, setVisible] = useState(true);

  return (
    <div>
      <h2>Component Lifecycle Demo</h2>

      <button onClick={() => setVisible(prev => !prev)}>
        {visible ? 'Hide User Panel' : 'Show User Panel'}
      </button>

      {visible && <UserPanel />}
    </div>
  );
}

export default LifecycleDemo;
