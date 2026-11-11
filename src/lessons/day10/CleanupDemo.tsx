import { useEffect, useState } from 'react';

function SearchPanel() {
  const [count, setCount] = useState(0);

  console.log('SearchPanel rendered');

  useEffect(() => {
    console.log('SearchPanel mounted');

    return () => {
      console.log('SearchPanel cleanup');
    };
  }, []);

  useEffect(() => {
    console.log('Count updated:', count);
  }, [count]);

  return (
    <div>
      <p>Count: {count}</p>

      <button onClick={() => setCount(c => c + 1)}>
        Add Count
      </button>
    </div>
  );
}

function CleanupDemo() {
  const [show, setShow] = useState(true);

  return (
    <>
      <button onClick={() => setShow(s => !s)}>
        Toggle SearchPanel
      </button>

      {show && <SearchPanel />}
    </>
  );
}

export default CleanupDemo;