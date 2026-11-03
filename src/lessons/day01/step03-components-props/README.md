# Step 3 - Components & Props

## 1. 核心知识

### Component（组件）

React 使用组件构建用户界面。

- 一个组件可以独立管理自己的 UI。
- 多个组件可以组合成一个完整页面。
- 相同结构的 UI 可以通过组件复用。

### Props（属性）

Props 用于父组件向子组件传递数据。

- Props 由父组件传递。
- 子组件通过参数接收 Props。
- Props 是只读的，子组件不应该直接修改 Props。

### Callback（回调函数）

子组件可以通过调用父组件传递的回调函数，通知父组件执行操作。

例如：子组件点击 Delete，通知父组件删除指定用户。

## 2. 本节代码

| 文件 | 作用 |
|---|---|
| UserItem.tsx | 用户子组件，负责展示用户和删除按钮 |
| UserPage.tsx | 用户父组件，负责管理用户列表和删除逻辑 |

## 3. 核心代码

### UserItem.tsx

```tsx
type User = {
  id: number;
  name: string;
};

type UserItemProps = {
  user: User;
  onDelete: (id: number) => void;
};

function UserItem({ user, onDelete }: UserItemProps) {
  return (
    <div>
      <span>{user.name}</span>
      <button onClick={() => onDelete(user.id)}>
        Delete
      </button>
    </div>
  );
}

export default UserItem;
```

### UserPage.tsx

```tsx
import { useState } from 'react';
import UserItem from './UserItem';

type User = {
  id: number;
  name: string;
};

function UserPage() {
  const [users, setUsers] = useState<User[]>([
    { id: 101, name: 'Tom' },
    { id: 102, name: 'Jerry' }
  ]);

  const handleDelete = (id: number) => {
    setUsers(prevUsers =>
      prevUsers.filter(user => user.id !== id)
    );
  };

  return (
    <div>
      <h2>User Management</h2>

      {users.map(user => (
        <UserItem
          key={user.id}
          user={user}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

export default UserPage;
```

## 4. 核心执行流程

1. UserPage 创建用户列表。
2. UserPage 使用 map() 遍历用户。
3. 每个用户创建一个 UserItem 组件。
4. UserPage 通过 Props 将 user 和 onDelete 传递给 UserItem。
5. 用户点击 Delete 按钮。
6. UserItem 调用 onDelete(user.id)。
7. UserPage 执行 handleDelete。
8. 使用 filter() 创建新数组。
9. setUsers 更新 State。
10. React 重新渲染用户列表。

## 5. Angular 对照

| Angular | React |
|---|---|
| @Component | Function Component |
| @Input() | Props |
| @Output() | Callback Props |
| EventEmitter | 父组件传递的回调函数 |
| ngFor | map() |
| trackBy | key |

注意：这是概念上的对应关系，并不意味着两种框架的实现机制完全相同。

## 6. 重点知识总结

- Component：组件化开发。
- Props：父组件向子组件传递数据。
- Callback：子组件通知父组件执行操作。
- map()：遍历数组并生成组件。
- key：帮助 React 识别列表元素。
- filter()：过滤数组，生成新的数组。
- State：由父组件管理用户列表。

## 7. 学习成果

完成一个简单的用户管理页面，实现：

- 用户列表展示。
- 父子组件拆分。
- Props 数据传递。
- Callback 事件通信。
- 删除指定用户。
- State 更新及页面重新渲染。