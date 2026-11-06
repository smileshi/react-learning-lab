
import { useState } from 'react';

function Child() {
  console.log('Child rendered');

  return <h3>Child Component</h3>;
}

function RenderDemo() {
  const [count, setCount] = useState(0);

  console.log('Parent rendered');

  return (
    <div>
      <h2>React Render Demo</h2>

      <p>Count: {count}</p>

      <button
        onClick={() => setCount(prev => prev + 1)}
      >
        Increase Count
      </button>

      <Child />
    </div>
  );
}

export default RenderDemo;
