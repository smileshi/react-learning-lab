# Day 5 - React Hooks 深入学习

## 学习目标

深入理解 React Hooks 的执行机制，掌握副作用管理、组件生命周期、函数引用和防抖搜索。

## Step 1：useEffect Dependencies

学习内容：
- 无依赖数组：每次提交更新后执行 Effect。
- 空依赖数组：组件挂载后执行 Effect。
- 指定依赖：初次挂载及依赖变化后执行 Effect。
- Object.is：React 比较依赖值的方式。
- Stale Closure：闭包中的旧值问题。

## Step 2：Effect Cleanup

学习内容：
- Cleanup Function。
- 清理 setInterval、setTimeout。
- 移除事件监听器。
- 取消订阅及清理资源。

核心代码：

```tsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log('Timer running');
  }, 1000);

  return () => {
    clearInterval(timer);
  };
}, []);
```

## Step 3：Component Lifecycle

学习内容：
- Mount：组件挂载。
- Update：组件更新。
- Unmount：组件卸载。
- State 和 Props 对组件重新渲染的影响。
- 条件渲染导致的组件卸载与重新挂载。

## Step 4：useCallback

学习内容：
- 函数引用。
- 普通函数与 useCallback 的区别。
- 依赖数组。
- Stale Closure。
- useCallback 与 React.memo 的配合。

核心代码：

```tsx
const handleSearch = useCallback(() => {
  console.log(keyword);
}, [keyword]);
```

## Step 5：Hooks 综合实战

实战项目：Banking System - User Search

实现内容：
- 用户搜索。
- 500ms 防抖。
- setTimeout 与 clearTimeout。
- useCallback 稳定函数引用。
- useEffect 管理搜索执行时机。
- Loading 和搜索结果展示。

## 核心知识总结

| Hook | 主要作用 |
|---|---|
| useState | 管理组件状态 |
| useEffect | 管理副作用 |
| useRef | 保存跨渲染的可变引用 |
| useCallback | 缓存函数引用 |
| useMemo | 缓存计算结果 |

## 验收结果

- [x] Step 1 useEffect 依赖数组
- [x] Step 2 Effect Cleanup
- [x] Step 3 组件生命周期
- [x] Step 4 useCallback
- [x] Step 5 Hooks 综合实战
- [x] 浏览器测试通过
- [x] TypeScript 检查通过

## 学习总结

已掌握 React Effect 的执行与清理机制、组件生命周期、函数引用管理和防抖搜索，可以进一步应用于真实 React + TypeScript 业务项目。
