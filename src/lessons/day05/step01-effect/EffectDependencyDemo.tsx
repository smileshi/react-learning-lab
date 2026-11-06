
import { useEffect, useState } from 'react';

function EffectDependencyDemo() {
  const [keyword, setKeyword] = useState('');
  const [count, setCount] = useState(0);

  // Effect 1：没有依赖数组
  useEffect(() => {
    console.log('Effect 1: Every render');
  });

  // Effect 2：空依赖数组
  useEffect(() => {
    console.log('Effect 2: Mount');
  }, []);

  // Effect 3：依赖 keyword
  useEffect(() => {
    console.log('Effect 3: Keyword changed:', keyword);
  }, [keyword]);

  return (
    <div>
      <h2>Effect Dependency Demo</h2>

      <div>
        <label>Search keyword: </label>
        <input
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
        />
      </div>

      <div>
        <button onClick={() => setCount(prev => prev + 1)}>
          Count: {count}
        </button>
      </div>
    </div>
  );
}

export default EffectDependencyDemo;
