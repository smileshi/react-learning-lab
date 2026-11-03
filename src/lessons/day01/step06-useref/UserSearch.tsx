import { useEffect, useRef, useState } from 'react';

function UserSearch() {
  // 创建DOM引用
  const inputRef = useRef<HTMLInputElement>(null);

  // 管理搜索关键词
  const [keyword, setKeyword] = useState('');

  // 页面首次渲染后自动聚焦
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 手动聚焦
  const handleFocus = () => {
    inputRef.current?.focus();
  };

  // 清空输入
  const handleClear = () => {
    setKeyword('');
    inputRef.current?.focus();
  };

  return (
    <div>
      <h2>useRef Demo</h2>

      <input
        ref={inputRef}
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        placeholder="Search user"
      />

      <button onClick={handleFocus}>
        Focus
      </button>

      <button onClick={handleClear}>
        Clear
      </button>

      <p>Current keyword: {keyword}</p>
    </div>
  );
}

export default UserSearch;