# Day 10 — React Effects, Cleanup & Async Requests

## 学习目标

Day 10 聚焦 React `useEffect` 的执行时机、依赖管理和清理机制，并将这些知识应用到银行系统用户管理页面的异步搜索中。

本日学习内容：
- `useEffect` 与 Dependency Array
- React State Snapshot 与 Stale Closure
- Effect Cleanup
- Mount、Update、Unmount
- Effect 中的异步请求
- `AbortController` / `AbortSignal`
- `requestId` 请求竞态保护
- 800ms Debounce
- React StrictMode

---

## 1. useEffect 与 Dependency Array

`useEffect` 通常在 React 提交渲染更新后执行。组件重新渲染不代表所有 Effect 都会重新执行；是否重新执行取决于依赖数组。

```tsx
// 每次提交更新后执行
useEffect(() => {
  console.log('Effect');
});

// 首次挂载后执行；开发环境 StrictMode 可能额外检查
useEffect(() => {
  console.log('Mounted');
}, []);

// 首次挂载后执行；count 变化后再次执行
useEffect(() => {
  console.log('Count:', count);
}, [count]);
```

### State Snapshot

React State 是当前渲染的一份快照：

```tsx
setLoading(true);
console.log(loading);
```

`setLoading(true)` 会安排后续渲染，但不会立即改变当前函数执行上下文中的 `loading`。因此紧接着读取的仍可能是当前渲染快照中的旧值。

### Stale Closure

闭包可能继续使用创建它的那次渲染中的变量值。如果 Effect 的依赖没有包含它读取的响应式值，就可能观察到旧值。

```tsx
useEffect(() => {
  console.log(keyword);
}, []); // keyword 改变时，这个 Effect 不会重新执行
```

需要在 `keyword` 改变后重新执行时：

```tsx
useEffect(() => {
  console.log(keyword);
}, [keyword]);
```

---

## 2. Cleanup Function

Effect 可以返回清理函数：

```tsx
useEffect(() => {
  // setup：建立副作用

  return () => {
    // cleanup：清理副作用
  };
}, [dependency]);
```

Cleanup 的执行时机：
- 依赖变化时：先执行上一次 Effect 的 Cleanup，再执行新 Effect。
- 组件卸载时：执行最后一次 Effect 的 Cleanup。
- 空依赖数组的 Effect，普通情况下首次挂载后执行，Cleanup 在卸载时执行。

### Debounce 定时器清理

```tsx
useEffect(() => {
  const timer = window.setTimeout(() => {
    void loadUsers();
  }, 800);

  return () => {
    window.clearTimeout(timer);
  };
}, [loadUsers]);
```

`clearTimeout` 清除尚未触发的定时器，不能撤销已经发出的 HTTP 请求。

---

## 3. Mount、Update、Unmount

| 阶段 | 含义 |
|---|---|
| Mount | 组件首次进入页面 |
| Update | 组件因 State 或 Props 变化而重新渲染 |
| Unmount | 组件从页面移除 |

要区分：
- Render：组件函数重新执行。
- Effect：根据依赖数组决定是否执行。
- Cleanup：依赖变化前或组件卸载时清理副作用。

组件重新渲染，不意味着空依赖数组的 Effect 也重新执行。

---

## 4. 在 useEffect 中处理异步请求

不要直接将 Effect 回调声明为 `async`：

```tsx
// 不推荐
useEffect(async () => {
  const data = await userService.getUsers();
  setUsers(data);
}, []);
```

原因：`async` 函数返回 Promise，而 Effect 回调应返回 Cleanup 函数或 `undefined`。

推荐在 Effect 内部定义异步函数：

```tsx
useEffect(() => {
  async function fetchData() {
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  }

  void fetchData();
}, []);
```

`void fetchData()` 用于调用异步函数，并明确表示这里不等待其 Promise 返回值。

---

## 5. AbortController 与 AbortSignal

`AbortController` 可以取消支持 `AbortSignal` 的异步操作，例如将 `signal` 传给 Axios 请求。

```tsx
const controller = new AbortController();

await userService.getUsers(params, controller.signal);

// 需要取消时
controller.abort();
```

### Service 层支持 signal

本项目的 `userService.ts` 中，`getUsers` 支持可选的 `AbortSignal`：

```tsx
const getUsers = async (
  params?: {
    keyword?: string;
    role?: string;
  },
  signal?: AbortSignal
): Promise<User[]> => {
  const response = await http.get<User[]>('/api/users', {
    params,
    signal
  });

  if (!Array.isArray(response.data)) {
    throw new Error(
      'GET /api/users must return a user array. Check the API URL and proxy.'
    );
  }

  return response.data;
};
```

### 与 requestId 的区别

| 机制 | 主要作用 |
|---|---|
| Debounce | 减少短时间内不必要的请求 |
| AbortController | 取消不再需要且支持取消的请求 |
| requestId | 忽略过期响应，防止旧数据覆盖新数据 |

三者职责不同，可以配合使用。

---

## 6. 用户管理页面的异步搜索实现

### loadUsers

本项目的 `UserManagementWeek1Demo` 使用 `requestId`、`AbortSignal` 和当前搜索条件加载用户：

```tsx
const requestId = useRef(0);

const loadUsers = useCallback(async (signal?: AbortSignal) => {
  const currentRequest = ++requestId.current;

  try {
    setLoading(true);
    setLoadError('');

    const data = await userService.getUsers(
      {
        keyword: keyword.trim() || undefined,
        role: roleFilter || undefined
      },
      signal
    );

    if (currentRequest === requestId.current && !signal?.aborted) {
      setUsers(data);
    }
  } catch (error) {
    if (signal?.aborted) {
      return;
    }

    console.error('Load users failed:', error);

    if (currentRequest === requestId.current) {
      setLoadError('Failed to load users.');
    }
  } finally {
    if (currentRequest === requestId.current) {
      setLoading(false);
    }
  }
}, [keyword, roleFilter]);
```

关键点：
1. 每次调用递增 `requestId`。
2. 搜索参数来自当前渲染中的 `keyword` 和 `roleFilter`。
3. 将可选 `signal` 传给 Service。
4. 只有最新请求可以更新用户数据或错误状态。
5. 已取消请求不显示为普通加载错误。
6. 只有当前最新请求负责结束 Loading。

### Debounce Effect 与 AbortController

```tsx
useEffect(() => {
  const controller = new AbortController();

  const timer = window.setTimeout(() => {
    void loadUsers(controller.signal);
  }, 800);

  return () => {
    window.clearTimeout(timer);
    controller.abort();
  };
}, [loadUsers]);
```

流程：

```text
keyword / roleFilter 变化
          |
          v
loadUsers 函数引用更新
          |
          v
旧 Effect Cleanup
     |          |
     v          v
clearTimeout  controller.abort()
          |
          v
新 Effect 创建 controller 和 timer
          |
          v
等待 800ms
          |
          v
调用 loadUsers(signal)
          |
          v
GET /api/users
```

说明：
- 如果 800ms 内搜索条件再次变化，旧定时器会被清除。
- 如果旧请求已经发出，Cleanup 会尝试通过 `abort()` 取消它。
- 如果旧请求已经完成，取消操作无法撤销已完成的请求。
- `requestId` 仍负责保护数据更新，不能因为加入 AbortController 就删除它。

---

## 7. React StrictMode

StrictMode 是 React 提供的开发辅助检查机制，用于帮助发现潜在问题，例如 Effect 缺少清理逻辑。

开发环境首次挂载时，Effect 可能经历额外的：

```text
Setup
  |
  v
Cleanup
  |
  v
Setup
```

因此，使用 AbortController 的 Effect 应在每次 Setup 时创建新的 controller，并在自己的 Cleanup 中清理它。

开发环境中可能观察到第一次请求被取消、随后第二次请求正常完成的情况。不要把这种开发检查行为误认为生产环境必然重复请求。

---

## 8. Day 10 综合验收记录

| 阶段 | 内容 | 结果 |
|---|---|---|
| Step 1 | useEffect 执行时机与基础概念 | 已完成 |
| Step 2 | Dependency Array、Stale Closure | 已完成 |
| Step 3 | Cleanup Function、定时器清理、组件卸载 | 已完成 |
| Step 4 | Mount、Update、Unmount | 已完成 |
| Step 5 | Async Effect、AbortController、requestId | 已完成 |
| Step 6 | React StrictMode | 已完成 |
| Step 7.1 | 综合代码自查 | 10/10 |
| Step 7.2 | 理论综合测试 | 10/10 |
| Step 7.3 | Network 综合测试 | 跳过：此前已完成 |
| Step 7.4 | 异常与取消请求回归测试 | 跳过：此前已完成 |
| Step 7.5 | 最终代码审查 | 已完成；Role Filter 选项问题随后已修复 |
| Step 7.6 | README 整理 | 本文档 |

### 本日核心知识

1. React State 是当前渲染的一份快照；调用 State setter 不会立即改变当前函数中的变量。
2. Effect 是否重新执行取决于依赖数组。
3. 依赖变化时，旧 Cleanup 先执行，再执行新 Effect。
4. 组件 Render、Effect 执行和 Cleanup 是不同的过程。
5. Effect 回调不应直接声明为 `async`。
6. Cleanup 可以清除定时器，也可以取消支持 `AbortSignal` 的请求。
7. Debounce、AbortController、requestId 解决不同问题。
8. StrictMode 会在开发环境帮助检查 Effect 的清理行为。

---

## 9. 后续开发注意事项

- 新增 Effect 时，检查所有响应式依赖是否完整。
- 创建定时器、请求或订阅时，考虑对应的 Cleanup。
- 不要把 AbortController 当成 requestId 的替代品。
- 取消请求时应避免将取消异常展示为普通业务错误。
- 检查异步请求的 Loading 和 Error 状态是否能在成功、失败、取消等路径正确结束。
- 对服务端过滤的页面，筛选选项应保持稳定，避免选项集合意外受当前搜索结果影响。

**Day 10 完成。**
