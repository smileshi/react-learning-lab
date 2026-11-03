# Step 5 - useEffect

## 核心知识

1. useEffect 用于处理副作用。
2. 空依赖数组：首次提交渲染后执行。
3. 指定依赖：依赖变化后重新执行。
4. 没有依赖数组：每次提交渲染后执行。
5. Cleanup 用于清理副作用。

## 实战功能

- 模拟页面加载获取用户数据
- 切换用户ID
- 根据依赖重新执行Effect
- 清理之前的定时器
- Loading状态管理

## 重点代码

- UserEffectDemo.tsx

## 关键方法

- useEffect()
- setTimeout()
- clearTimeout()