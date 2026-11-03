# Step 6 - useRef

## 核心知识

1. useRef 创建引用。
2. ref.current 访问引用对象。
3. 可以通过Ref操作DOM。
4. 修改ref.current不会触发重新渲染。
5. useState适合管理需要显示在页面上的数据。

## 实战功能

- 搜索框自动聚焦
- 手动聚焦
- 清空搜索内容
- 实时展示搜索关键词

## 重点代码

- UserSearch.tsx

## 关键方法

- useRef()
- inputRef.current.focus()
- useEffect()