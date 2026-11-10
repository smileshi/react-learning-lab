# Day 9 README --- React 异步处理与页面状态管理

> 项目：`react-learning-lab`\
> 学习主题：Loading、Error、Empty State、Retry、React State Snapshot
> 与请求竞态\
> 说明：本文是 Day 9
> 学习记录，基于本次学习与验收结果整理，不构成生产环境安全审查。

## 1. Day 9 学习目标

通过银行系统用户管理页面，理解并实践：

-   React State 的快照（State Snapshot）与重新渲染。
-   JavaScript 同步执行、`async/await` 与异步请求。
-   Loading 状态和按钮 `disabled`。
-   多个请求并发时的竞态问题。
-   使用 `useRef` 和 `requestId` 忽略过期响应。
-   网络错误、HTTP 错误与业务错误的区别。
-   请求失败时保留已有数据。
-   区分 Empty State 与 Search Empty State。
-   Retry 重新请求及防止重复点击。

## 2. React State Snapshot 与渲染

每次 React 渲染都对应一份 State 快照。示例：

``` tsx
const [loading, setLoading] = useState(false);

const handleClick = () => {
  setLoading(true);
  console.log(loading);
};
```

假设当前渲染中的 `loading` 是 `false`。调用 `setLoading(true)` 会请求
React 安排状态更新，但不会改写当前事件处理函数所读取的 `loading`
变量。因此，同一次函数调用中的 `console.log(loading)` 通常仍打印
`false`。React 后续处理更新并重新渲染组件时，新一轮渲染读取到的
`loading` 才是 `true`。

核心概念：

-   State 是当前渲染的一份快照。
-   State Setter 请求更新状态，不会同步修改当前函数里的变量。
-   重新渲染会重新执行组件函数，形成新一轮变量和函数。
-   普通 React 事件处理函数中的同步代码会先继续执行；React
    不会在该同步函数执行到一半时插入普通的重新渲染。
-   React 会对适用场景中的多次状态更新进行批处理；不要假设每次 Setter
    都对应一次独立渲染。

### 同步代码与 await

``` tsx
const loadUsers = async () => {
  setLoading(true);
  console.log('Request started');

  const data = await userService.getUsers();

  setUsers(data);
  setLoading(false);
};
```

`await` 会暂停当前 `async` 函数后续代码，等待 Promise
结算。它不会阻塞整个 JavaScript
主线程。网络等待期间，运行环境有机会处理其他任务，包括 React
的更新与渲染。

``` text
调用 loadUsers
    |
    v
setLoading(true)
    |
    v
当前同步代码继续执行
    |
    v
await 等待 GET Promise
    |
    v
运行环境处理其他工作 / React 有机会渲染 Loading
    |
    v
Promise 结算，async 函数继续
    |
    v
更新数据并结束 Loading
```

## 3. Loading 状态与 disabled 按钮

页面使用状态控制加载提示与操作可用性。示例：

``` tsx
const [loading, setLoading] = useState(true);
const [submitting, setSubmitting] = useState(false);
const [deletingId, setDeletingId] = useState<number | null>(null);
```

Reload 按钮示例：

``` tsx
<button
  type="button"
  onClick={() => void loadUsers()}
  disabled={loading || submitting || deletingId !== null}
>
  reload
</button>
```

只要 `loading`、`submitting` 或 `deletingId !== null`
中任一条件为真，按钮就会禁用。浏览器通常会应用默认禁用样式，例如灰色外观。

Day 9
验证时，临时延长请求等待时间后确认：请求期间按钮变灰、无法点击；请求完成后恢复正常。测试用的临时延迟应在验证后移除。

## 4. 并发请求与 requestId

### 竞态问题

搜索条件快速变化时，可能产生多个并发 GET 请求。例如：

-   请求 A 先发出，查询 `Tom`，但网络较慢。
-   请求 B 后发出，查询 `Jerry`，但先返回。
-   如果不保护响应，A 最后返回时可能覆盖 B 的结果。

页面应以最后发出的有效请求为准，而不是以最后返回的请求为准。

### useRef 与 requestId

示意代码（以项目实际实现为准）：

``` tsx
const requestId = useRef(0);

const loadUsers = useCallback(async () => {
  const currentRequest = ++requestId.current;

  try {
    setLoading(true);
    setLoadError('');

    const data = await userService.getUsers({
      keyword: keyword.trim() || undefined,
      role: roleFilter || undefined
    });

    if (currentRequest === requestId.current) {
      setUsers(data);
    }
  } catch (err) {
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

1.  每次请求递增 `requestId.current`。
2.  每个请求保存自己的 `currentRequest`。
3.  请求完成时，比较它是否仍等于最新 `requestId.current`。
4.  只有最新请求可以更新 `users`、设置当前错误状态和关闭 Loading。
5.  `useRef` 的 `.current` 更新本身不会触发 React 重新渲染。

**重要区别：** `requestId` 不是 HTTP
取消机制。它不会真正取消已经发出的请求，也不会让数据库查询更快；它只是让过期响应失去更新页面状态的资格。真正取消请求需要使用支持取消的机制，例如
`AbortController`，并正确接入请求客户端。

### 为什么只禁用 Reload 按钮还不够

`disabled`
只能限制对应按钮的用户操作。搜索输入变化、其他组件逻辑或其他触发入口仍可能发起请求。因此，按钮禁用和请求竞态保护解决的是不同问题。

## 5. Error 与异常处理

### 常见错误类型

-   网络错误：例如后端未启动，浏览器无法连接服务。
-   HTTP 错误：例如 404 或 500。Axios 默认会将非 2xx 响应作为 rejected
    Promise 处理。
-   业务错误：HTTP 请求可能成功（例如 HTTP
    200），但响应内容表达业务失败。需要根据后端业务响应格式判断，必要时由应用代码主动抛出错误。

### try / catch / finally

``` tsx
try {
  setLoading(true);
  setLoadError('');

  const data = await userService.getUsers();
  setUsers(data);
} catch (err) {
  console.error('Load users failed:', err);
  setLoadError('Failed to load users.');
} finally {
  setLoading(false);
}
```

-   请求开始时清除旧错误。
-   `try` 处理成功路径。
-   `catch` 捕获请求或处理过程中的异常。
-   `finally` 无论成功还是失败都会执行，适合结束 Loading 等清理工作。

### 请求失败时保留旧数据

Day 9 采用的体验是：刷新失败时不清空已经成功加载的用户列表。如果 `catch`
中只设置 `loadError`，而没有执行 `setUsers([])`，原有 `users`
就会保留。展示层应允许旧列表与错误提示同时出现，而不是用 `!loadError`
把旧列表隐藏。

示意：

``` tsx
{loadError && !loading && (
  <div>
    <p role="alert">{loadError}</p>
    <button
      type="button"
      onClick={() => void loadUsers()}
      disabled={loading}
    >
      Retry
    </button>
  </div>
)}

{!loading && users.length > 0 && (
  <UserList users={users} />
)}
```

## 6. Empty State 与 Search Empty State

请求成功但返回空数组 `[]`，属于有效的空数据结果，不是请求错误。

  ------------------------------------------------------------------------------------
  情况                         条件示意                页面提示
  ---------------------------- ----------------------- -------------------------------
  没有任何用户且没有搜索条件   `users.length === 0`    `No users found.`
                               且没有搜索条件          

  有搜索条件但没有匹配用户     `users.length === 0`    `No users match your search.`
                               且有搜索条件            

  请求失败                     `loadError` 非空        Error + Retry
  ------------------------------------------------------------------------------------

因为搜索已经交给后端执行，返回的 `users`
是后端过滤后的结果。因此，搜索无结果时 `users` 也会是空数组；不能仅凭
`users.length === 0` 推断数据库中完全没有用户。

示意判断：

``` tsx
const hasSearchCriteria =
  keyword.trim() !== '' || roleFilter !== '';

{!loading && !loadError && users.length === 0 && (
  <p>
    {hasSearchCriteria
      ? 'No users match your search.'
      : 'No users found.'}
  </p>
)}
```

## 7. Retry 重试机制

Retry 的职责是再次调用数据加载函数，而不是清空用户数据或刷新整个浏览器。

``` tsx
<button
  type="button"
  onClick={() => void loadUsers()}
  disabled={loading}
>
  Retry
</button>
```

正常流程：

``` text
请求失败
   |
   v
显示 Error + Retry
   |
   v
用户点击 Retry
   |
   v
清除旧 Error，设置 Loading
   |
   v
再次调用 GET API
   |
   +---- 成功：更新 users，结束 Loading，Error 保持清空
   |
   +---- 失败：保留已有 users，重新显示 Error，结束 Loading
```

通过 `disabled={loading}`，可以避免用户在同一请求仍进行时重复点击
Retry。请求编号检查仍负责处理来自其他入口的并发请求。

## 8. 页面请求与状态流程图

``` mermaid
flowchart TD
    A[触发 loadUsers] --> B[递增 requestId]
    B --> C[设置 Loading 并清除旧 Error]
    C --> D[调用 GET API]
    D --> E{请求成功?}
    E -->|是| F{请求仍是最新请求?}
    F -->|是| G[更新 users]
    F -->|否| H[忽略过期响应]
    E -->|否| I{请求仍是最新请求?}
    I -->|是| J[设置 loadError，保留旧 users]
    I -->|否| H
    G --> K[最新请求关闭 Loading]
    J --> K
    H --> L[不修改当前页面状态]
```

状态展示分支：

``` mermaid
flowchart TD
    A[页面状态] --> B{正在加载?}
    B -->|是| C[显示 Loading]
    B -->|否| D{存在 loadError?}
    D -->|是| E[显示 Error 和 Retry]
    D -->|否| F{users 有数据?}
    F -->|是| G[显示 UserList]
    F -->|否| H{存在搜索条件?}
    H -->|是| I[No users match your search]
    H -->|否| J[No users found]
```

说明：实际页面可以在刷新失败时同时保留旧列表并显示
Error；上面的状态分支图用于概括主要判断，具体渲染应以页面 JSX 为准。

## 9. Day 9 实验与验收记录

### Step 1：异步状态基础

-   理解 Loading、Success、Empty、Error。
-   理解 Retry 是重新请求的用户操作。

### Step 2：Loading 与并发请求

-   验证 Loading 出现、请求完成后消失。
-   验证 Reload 在请求期间禁用，完成后恢复。
-   理解 State Snapshot：同一事件函数中 Setter 不会同步改写当前快照。
-   理解 `await` 暂停当前 async 函数，而不阻塞整个 JavaScript 主线程。
-   检查 `requestId` 每次请求递增、响应 ID
    比较、旧响应不覆盖新数据、只有最新请求关闭 Loading。

### Step 3：Error

-   停止后端后请求失败，页面显示 Error。
-   Loading 正常结束，Retry 可用。
-   重启后端后 Retry 成功，旧 Error 消失。
-   刷新失败时保留原有用户列表。
-   Retry 成功后显示最新数据。

### Step 4：Empty State

-   GET 返回 `[]` 时显示 `No users found.`。
-   创建用户后列表正常显示。
-   区分空列表与请求错误。
-   数据库有用户但搜索无匹配时显示 `No users match your search.`。
-   清空筛选条件后恢复全部用户。

### Step 5：Retry

-   连续请求失败时 Error 正常显示，原有用户数据保留。
-   后端恢复后 Retry 成功，Error 消失，用户列表恢复。
-   Retry 期间按钮禁用。
-   Network 检查确认每次有效 Retry 只产生一次 GET。

### 最终验收

-   Day 9 综合理论题首次答对 7/8。
-   复习 `requestId` 错题后，两道复测题全部正确；最终理论结果 8/8。
-   最终代码检查六项全部通过（根据学习者提交的验收结果）：
    1.  Loading 和 disabled 状态正常。
    2.  `requestId` 正确处理并发请求。
    3.  Error 显示正常且保留旧数据。
    4.  Empty State 与 Search Empty State 区分正确。
    5.  Retry 成功后清除旧错误。
    6.  TypeScript 检查通过。

## 10. 常见误区回顾

1.  **误区：** `setLoading(true)` 后当前函数里的 `loading` 立即变成
    `true`。\
    **正确：** 当前函数仍读取当前渲染快照；新值在后续渲染中体现。

2.  **误区：** React 会在普通事件处理函数执行到一半时插入重新渲染。\
    **正确：** 当前同步函数先继续执行；状态更新由 React 后续处理。

3.  **误区：** `await` 会阻塞整个 JavaScript 主线程。\
    **正确：** 它暂停当前 async 函数，运行环境可以处理其他工作。

4.  **误区：** 禁用 Reload 就能防止页面所有并发请求。\
    **正确：** 其他触发入口仍会发请求；需要单独考虑竞态保护。

5.  **误区：** `requestId` 会取消旧 HTTP 请求。\
    **正确：** 它只忽略过期响应，不会真正取消网络请求。

6.  **误区：** HTTP 200 返回 `[]` 是错误。\
    **正确：** 这是成功请求的空数据结果。

7.  **误区：** 刷新失败就应该清空 `users`。\
    **正确：** 可以保留最后一次成功加载的数据，同时显示错误。

8.  **误区：** `users.length === 0` 就能说明数据库完全没有用户。\
    **正确：**
    后端搜索返回空数组也会出现这种情况，需要结合搜索条件判断。

------------------------------------------------------------------------

**Day 9 完成。** 本 README
记录的是学习项目中的概念、示例与验收结果；示例代码用于解释模式，使用前应与当前项目实现核对。
