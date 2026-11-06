
import { useEffect, useState } from 'react';

function EffectCleanupDemo() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Timer started');

    const timer = setInterval(() => {
      console.log('Timer running');
      setCount(prev => prev + 1);
    }, 1000);

    return () => {
      console.log('Timer cleaned up');
      clearInterval(timer);
    };
  }, []);

  return (
    <div>
      <h2>Effect Cleanup Demo</h2>
      <p>Count: {count}</p>
    </div>
  );
}

export default EffectCleanupDemo;
