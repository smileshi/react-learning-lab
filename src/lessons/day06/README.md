# Day 6 - React Performance Optimization

## 一、学习目标

理解 React 组件重新渲染机制，掌握 React.memo、useMemo 和 useCallback，并将其应用于银行系统用户管理页面。

## 二、学习内容

### Step 1：React Render Mechanism

学习内容：

- Re-render 与 DOM Update 的区别。
- State 变化触发组件重新渲染。
- 父组件重新渲染对子组件的影响。
- Context 变化对子组件的影响。
- React StrictMode 在开发环境中的额外检查。

核心知识：

组件重新渲染不代表浏览器 DOM 一定发生变化。

### Step 2：React.memo

学习内容：

- React.memo 的作用。
- Props 浅比较。
- 对象和函数的引用比较。
- 组件自身 State 变化仍然可以触发重新渲染。

核心代码：

```tsx
const UserInfo = memo(function UserInfo({
  username
}: {
  username: string;
}) {
  return <h3>{username}</h3>;
});
```

### Step 3：useMemo

学习内容：

- 缓存计算结果。
- 依赖数组。
- 避免不必要的重复计算。
- useMemo 与 useCallback 的区别。

核心代码：

```tsx
const filteredUsers = useMemo(() => {
  return users.filter(user => user.role === role);
}, [users, role]);
```

### Step 4：useCallback + React.memo

学习内容：

- 普通函数每次渲染创建新引用。
- useCallback 稳定函数引用。
- useCallback 与 React.memo 配合。
- 函数式 State 更新。
- 避免 Stale Closure。

核心代码：

```tsx
const handleDelete = useCallback((id: number) => {
  setUsers(prevUsers =>
    prevUsers.filter(user => user.id !== id)
  );
}, []);
```

### Step 5：Performance Optimization 实战

项目：Banking System - User Management Performance Demo

实现功能：

- GET /api/users
- POST /api/users
- 表单校验
- 用户列表
- 用户删除（本地 State 更新）
- 用户搜索
- Loading / Error / Success 状态

性能优化：

| 组件或功能 | 使用工具 | 目的 |
|---|---|---|
| UserItem | React.memo | 减少不必要的渲染 |
| UserList | React.memo | 减少不必要的渲染 |
| handleDelete | useCallback | 稳定函数引用 |
| filteredUsers | useMemo | 缓存搜索结果 |

## 三、项目目录

```text
day06/
├── step01-render/
│   └── RenderDemo.tsx
├── step02-memo/
│   └── MemoDemo.tsx
├── step03-memo/
│   └── UseMemoDemo.tsx
├── step04-callback-memo/
│   └── CallbackMemoDemo.tsx
└── step05-performance/
    ├── UserManagementPerformanceDemo.tsx
    ├── UserList.tsx
    └── UserItem.tsx
```

## 四、核心知识总结

| 技术 | 核心作用 |
|---|---|
| React.memo | 缓存组件渲染结果 |
| useMemo | 缓存计算结果 |
| useCallback | 缓存函数引用 |
| Object.is | 比较依赖值及引用 |
| StrictMode | 开发阶段检查潜在问题 |

## 五、最终验收结果

- [x] Step 1 React 渲染机制
- [x] Step 2 React.memo
- [x] Step 3 useMemo
- [x] Step 4 useCallback + React.memo
- [x] Step 5 综合性能优化
- [x] GET 用户列表成功
- [x] POST 创建用户成功
- [x] 表单校验正常
- [x] 删除用户正常
- [x] 用户搜索正常
- [x] React.memo / useMemo 优化验证
- [x] npx tsc --noEmit 通过

## 六、学习总结

Day 6 完成后，已经掌握 React 基本渲染机制和常用性能优化工具，并能够在真实业务场景中应用 React.memo、useMemo 和 useCallback。

后续学习重点：React Router、组件设计、状态管理和综合项目开发。
