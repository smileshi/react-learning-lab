# React 学习实验室

面向有 Java 和 Angular 经验的开发者，通过独立示例学习 React，并逐步完成 Spring Boot 接口联调。

## 学习计划

[查看三周学习计划与进度跟踪表](./LEARNING_PLAN.md)

## 本地运行

```sh
npm install
npm run dev
```

打开终端显示的网址，通过左侧导航切换 Day 1 的六个示例。

类型检查与构建：`npm run build`。

## React + TypeScript + Rsbuild

Rsbuild uses Rspack to build this application. Configuration: rsbuild.config.ts.

- npm run dev: development server at http://localhost:5173 with React Fast Refresh.
- npm run build: TypeScript checks, then production build to dist/.
- npm run preview: preview the production build.
- npm run lint: check all lessons with ESLint.

/api requests are proxied to http://localhost:8080. Start the existing Spring Boot backend separately.
The HTML template is index.html; the entry is src/main.tsx. Rsbuild injects the bundle automatically.
Existing lesson notes describing Vite are historical; use rsbuild.config.ts for current proxy configuration.