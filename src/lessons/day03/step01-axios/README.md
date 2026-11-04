# Day 3 - Step 1：解决 React 与 Spring Boot 前后端跨域问题（CORS）

## 1. 问题背景

在进行 React + Spring Boot 前后端联调时，浏览器出现以下错误：

```text
Access to XMLHttpRequest at
'http://localhost:8080/api/users'
from origin 'http://localhost:5173'
has been blocked by CORS policy:

No 'Access-Control-Allow-Origin' header is present
on the requested resource.
```

### 当前开发环境

| 项目 | 地址 |
|---|---|
| React + Vite | http://localhost:5173 |
| Spring Boot | http://localhost:8080 |
| API | /api/users |

## 2. 什么是 CORS？

CORS 全称 Cross-Origin Resource Sharing，即跨域资源共享。

浏览器判断两个地址是否属于同一个 Origin，主要看三个部分：

- 协议（Protocol）
- 主机名（Hostname）
- 端口（Port）

例如：

```text
http://localhost:5173
http://localhost:8080
```

虽然协议和主机名相同，但是端口不同，因此属于不同的 Origin。

浏览器出于安全考虑，会检查后端是否允许前端跨域访问。

本次错误的原因是：

Spring Boot 返回的 HTTP Response 中没有提供浏览器要求的 CORS 允许来源信息。

## 3. 推荐解决方案：Vite Proxy

在本地 React 开发环境中，推荐使用 Vite Proxy 转发 API 请求。

优点：

1. 不需要修改 Spring Boot 的 CORS 配置。
2. Axios 不需要写死后端地址。
3. 前端统一使用相对路径调用 API。
4. 方便后续开发和维护。

### 3.1 修改 vite.config.ts

找到 React 项目根目录下的：

```text
vite.config.ts
```

原始代码：

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

修改为：

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
```

配置解释：

| 配置 | 作用 |
|---|---|
| server.proxy | 配置开发服务器代理 |
| '/api' | 匹配以 /api 开头的请求 |
| target | 后端 Spring Boot 地址 |
| changeOrigin | 修改代理请求的 Host 相关行为 |

例如：

```text
前端请求：
http://localhost:5173/api/users

Vite 转发到：
http://localhost:8080/api/users
```

注意：这里没有配置 rewrite，因此请求路径不会被修改。

### 3.2 修改 Axios 配置

找到：

```text
src/api/http.ts
```

原始配置：

```typescript
import axios from 'axios';

const http = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default http;
```

修改为：

```typescript
import axios from 'axios';

const http = axios.create({
  baseURL: '/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default http;
```

关键变化：

原来：

```typescript
baseURL: 'http://localhost:8080'
```

现在：

```typescript
baseURL: '/'
```

以后调用：

```typescript
http.get('/api/users');
```

浏览器访问：

```text
http://localhost:5173/api/users
```

然后由 Vite Proxy 转发到 Spring Boot。

## 4. 请求转发流程

```text
+----------------------------+
|       React Frontend       |
|      localhost:5173        |
|                            |
| http.get('/api/users')     |
+-------------+--------------+
              |
              v
+----------------------------+
|        Vite Dev Server     |
|                            |
|       Proxy Configuration  |
|                            |
|       /api -> 8080         |
+-------------+--------------+
              |
              v
+----------------------------+
|       Spring Boot          |
|      localhost:8080        |
|                            |
|       GET /api/users       |
+-------------+--------------+
              |
              v
+----------------------------+
|       JSON Response        |
|                            |
|       User List            |
+----------------------------+
```

这里需要理解：

浏览器访问的是 localhost:5173，由 Vite 开发服务器代理请求到 localhost:8080。

因此浏览器与 Vite 之间是同源请求，不再触发这次跨域检查。

## 5. 重启 React 开发服务器

修改 vite.config.ts 后，需要重启 Vite。

### Step 1：停止服务

在 VS Code Terminal 中按：

```powershell
Ctrl + C
```

### Step 2：重新启动

```powershell
npm run dev
```

### Step 3：确认服务启动

正常情况下会显示：

```text
Local: http://localhost:5173/
```

同时确保 Spring Boot 后端已经启动。

## 6. 验证 API 请求

在 React 页面中执行：

```typescript
import http from '../../../api/http';

const handleLoadUsers = async () => {
  try {
    const response = await http.get('/api/users');

    console.log(response.data);
    console.log(response.status);

  } catch (error) {
    console.error(error);
  }
};
```

打开浏览器开发者工具：

```text
F12 -> Network -> Fetch/XHR
```

检查以下信息：

| 检查项目 | 预期结果 |
|---|---|
| Request URL | http://localhost:5173/api/users |
| Request Method | GET |
| Status Code | 200 |
| Response | 后端返回的 JSON 数组 |

## 7. 开发环境与生产环境的区别

Vite Proxy 主要用于本地开发，不是生产环境的 CORS 解决方案。

| 环境 | 常见解决方式 |
|---|---|
| 本地开发 | Vite Proxy |
| 生产环境，同域部署 | Nginx / API Gateway 代理 |
| 生产环境，不同域部署 | Spring Boot CORS 配置或网关 CORS 配置 |

如果正式环境中 React 和 Spring Boot 使用不同域名，需要在后端或网关配置允许访问的 Origin。

## 8. 其他注意事项

### 8.1 Vite Proxy 不生效

检查：

- vite.config.ts 是否修改正确。
- 是否重新启动 Vite。
- target 是否指向正确的 Spring Boot 地址。
- Spring Boot 是否正常运行。
- API 路径是否正确。

### 8.2 出现 HTTP 404

说明请求已经到达某个 HTTP 服务，但目标路径没有匹配到对应资源。

检查：

- Controller 的 @RequestMapping。
- @GetMapping 路径。
- Vite Proxy 是否配置了 rewrite。
- 前端请求路径是否正确。

### 8.3 出现 HTTP 500

说明后端处理请求时出现异常。

检查 Spring Boot Console 日志，定位 Controller、Service 或 Repository 中的问题。

### 8.4 出现 ECONNREFUSED

通常意味着 Vite 无法连接目标后端。

检查：

- Spring Boot 是否启动。
- 后端端口是否为 8080。
- target 配置是否正确。

## 9. 核心知识总结

| 知识点 | 说明 |
|---|---|
| CORS | 浏览器跨域资源共享安全机制 |
| Origin | 协议、主机名、端口的组合 |
| Vite Proxy | 本地开发服务器请求代理 |
| target | 代理目标后端地址 |
| Axios baseURL | Axios 请求的基础地址 |
| HTTP Request | 前端发送给后端的请求 |
| HTTP Response | 后端返回给前端的响应 |

### 最重要的理解

CORS 是浏览器的安全机制。

Vite Proxy 是开发服务器的请求转发机制。

两者不是同一个概念。

对于当前 React + Spring Boot 学习项目，使用 Vite Proxy 是简单且合适的本地开发方案。