# Day 4 - React 条件渲染、列表与组件组合

## 学习目标

掌握 React 中的条件渲染、列表渲染、组件复用、搜索过滤，以及父子组件之间的通信。

## Step 1：Conditional Rendering

学习内容：
- if / else 条件判断
- 三元运算符 `? :`
- 逻辑与运算符 `&&`
- Early Return（提前返回）

实战：创建 `UserRole.tsx`，根据用户角色显示不同内容。

## Step 2：List Rendering & Component Composition

学习内容：
- 使用 `map()` 遍历数组
- 使用 `key` 帮助 React 识别列表元素
- 通过 Props 传递用户数据
- 拆分和复用组件

实战：
- `UserItem.tsx`
- `UserList.tsx`
- `UserListDemo.tsx`

## Step 3：Search & Filter

学习内容：
- `filter()` 筛选数组
- `includes()` 判断字符串是否包含关键词
- `toLowerCase()` 忽略大小写
- Derived State（派生数据）

实战：根据 username、email 和 role 搜索用户。

重要原则：可以通过现有 State 计算的数据，优先使用普通变量，不要不必要地增加 State。

## Step 4：Component Communication & Delete

学习内容：
- 通过 Props 传递函数
- 子组件触发父组件的函数
- Lifting State Up（状态提升）
- 使用 filter 和函数式 State 更新删除列表元素

实战：在 User Management 页面实现前端用户删除。

## 核心代码

```tsx
function handleDelete(id: number) {
  setUsers(prevUsers =>
    prevUsers.filter(user => user.id !== id)
  );
}
```

## 组件通信流程

UserManagement
  -> UserList
    -> UserItem
      -> onDelete(user.id)
        -> handleDelete(id)
          -> 更新 users State
            -> React 重新渲染

## 验收结果

- [x] Step 1 条件渲染
- [x] Step 2 列表渲染与组件组合
- [x] Step 3 搜索与过滤
- [x] Step 4 父子组件通信与删除
- [x] TypeScript 检查通过
- [x] 浏览器实战检查通过

## 学习总结

已掌握 React 条件渲染、列表展示、组件复用、派生数据和父子组件通信的基础开发能力。

注意：Step 4 的删除仅更新前端 State，没有调用后端 DELETE API。
