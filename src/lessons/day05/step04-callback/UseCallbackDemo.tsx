
import { useCallback, useRef, useState } from 'react';

function UseCallbackDemo() {
  const [count, setCount] = useState(0);

  // 普通函数：每次组件重新渲染都会创建新引用
  const handleClick = () => {
    console.log('Normal function clicked');
  };

  // useCallback：依赖不变时保持函数引用稳定
  const handleClickWithCallback = useCallback(() => {
    console.log('useCallback function clicked');
  }, []);

  // 保存上一次的函数引用
  const previousNormalRef = useRef<(() => void) | null>(null);
  const previousCallbackRef = useRef<(() => void) | null>(null);

  // 比较当前函数和上一次函数的引用
  const normalSameReference =
    previousNormalRef.current === null
      ? 'First Render'
      : Object.is(previousNormalRef.current, handleClick);

  const callbackSameReference =
    previousCallbackRef.current === null
      ? 'First Render'
      : Object.is(
          previousCallbackRef.current,
          handleClickWithCallback
        );

  // 保存本次渲染的函数引用，供下次比较
  previousNormalRef.current = handleClick;
  previousCallbackRef.current = handleClickWithCallback;

  return (
    <div style={{ padding: 24 }}>
      <h2>useCallback Demo</h2>

      <div>
        <h3>Count: {count}</h3>

        <button
          onClick={() => setCount(prev => prev + 1)}
        >
          Increase Count
        </button>
      </div>

      <hr />

      <h3>Normal Function</h3>

      <p>
        Same reference as previous render:
        {' '}
        {String(normalSameReference)}
      </p>

      <button onClick={handleClick}>
        Execute Normal Function
      </button>

      <hr />

      <h3>useCallback Function</h3>

      <p>
        Same reference as previous render:
        {' '}
        {String(callbackSameReference)}
      </p>

      <button onClick={handleClickWithCallback}>
        Execute useCallback Function
      </button>

      <hr />

      <p>
        Click Increase Count to trigger component re-render.
      </p>
    </div>
  );
}

export default UseCallbackDemo;
