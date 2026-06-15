# Coffee Online ☕

一个基于 Vue3 + Spring Boot 的咖啡在线商城项目，采用极简高级设计风格，融合 3D 交互体验。

## ✨ 项目特色

### 视觉设计
- **极简高级风格**：参考 oryzo.ai 设计语言，哑光质感、大留白、低饱和度咖啡色系
- **3D 交互场景**：鼠标倾泻咖啡豆粒子物理效果，实时碰撞堆叠
- **咖啡产地地图**：世界地图展示全球核心产区，交互式点位连线动画

### 核心功能
| 模块 | 功能 |
|------|------|
| **首页** | 咖啡豆展示、季节日历筛选、拼配圆环调节（带音效） |
| **咖啡产地地图** | 全球产区可视化、产地点位详情弹窗、差异化模块布局 |
| **咖啡器具** | 冲煮器具分类展示、商品卡片 hover 动效、加入购物车 |
| **线下门店** | 地图定位、门店信息展示、详情弹窗 |
| **账号系统** | 登录/注册/忘记密码、图形验证码、JWT 认证 |
| **购物车** | 商品增删改查、异步批量查询、数据持久化 |

## 🛠️ 技术栈

### 前端
- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite 6
- **路由**: Vue Router 4
- **状态管理**: Pinia
- **UI 组件**: Element Plus
- **3D 渲染**: Three.js
- **HTTP 客户端**: Axios

### 后端
- **框架**: Spring Boot 3.2
- **语言**: Java 21
- **数据库**: MySQL 8.0+
- **ORM**: MyBatis-Plus
- **线程池**: 自定义异步线程池
- **认证**: JWT + BCrypt

## 📁 项目结构

```
coffee-online/
├── frontend/                    # 前端项目
│   ├── src/
│   │   ├── api/                # API 接口封装
│   │   ├── components/         # 公共组件
│   │   │   ├── NavBar.vue      # 导航栏
│   │   │   ├── SideMenu.vue    # 侧边菜单
│   │   │   └── CartSidebar.vue # 购物车侧边栏
│   │   ├── router/             # 路由配置
│   │   ├── stores/             # Pinia 状态管理
│   │   ├── utils/              # 工具函数
│   │   ├── views/              # 页面视图
│   │   │   ├── Poster.vue      # 3D 海报页
│   │   │   ├── Home.vue        # 首页
│   │   │   ├── OriginMap.vue   # 咖啡产地地图
│   │   │   ├── Equipment.vue   # 咖啡器具
│   │   │   ├── Stores.vue      # 线下门店
│   │   │   ├── Login.vue       # 登录页
│   │   │   ├── Register.vue    # 注册页
│   │   │   └── ForgotPassword.vue # 忘记密码
│   │   └── assets/             # 静态资源
│   └── package.json
│
└── backend/                    # 后端项目
    ├── src/main/
    │   ├── java/com/example/coffeeonline/
    │   │   ├── controller/     # REST API 控制器
    │   │   ├── service/        # 业务逻辑层
    │   │   ├── mapper/         # MyBatis Mapper
    │   │   ├── entity/         # 数据库实体
    │   │   ├── config/         # 配置类
    │   │   └── utils/          # 工具类
    │   └── resources/
    │       ├── mapper/         # MyBatis XML
    │       └── application.yml # 应用配置
    └── pom.xml
```

## 🚀 快速开始

### 环境要求
- **Node.js**: >= 18.0.0
- **Java**: >= 21
- **MySQL**: >= 8.0

### 数据库配置

1. 创建数据库：
```sql
CREATE DATABASE coffee_online CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 导入初始数据：
```bash
mysql -u root -p coffee_online < coffee_online.sql
mysql -u root -p coffee_online < coffee_origin.sql
```

### 启动后端服务

```bash
cd backend
mvn spring-boot:run
```

服务将在 http://localhost:8080 启动

### 启动前端服务

```bash
cd frontend
npm install
npm run dev
```

服务将在 http://localhost:5173 启动

## 🔌 API 接口

### 认证模块
| 接口 | 方法 | 说明 |
|------|------|------|
| `/auth/captcha` | GET | 获取图形验证码 |
| `/auth/login` | POST | 用户登录 |
| `/auth/register` | POST | 用户注册 |
| `/auth/forgot-password` | POST | 忘记密码 |

### 商品模块
| 接口 | 方法 | 说明 |
|------|------|------|
| `/products/beans` | GET | 查询咖啡豆列表 |
| `/products/equipment` | GET | 查询器具列表 |
| `/products/seasonal` | GET | 按季节筛选咖啡豆 |

### 产地模块
| 接口 | 方法 | 说明 |
|------|------|------|
| `/origin/points` | GET | 获取产地点位（地图渲染） |
| `/origin/{id}` | GET | 获取产地详情 |

### 购物车模块
| 接口 | 方法 | 说明 |
|------|------|------|
| `/cart/items` | GET | 获取购物车列表 |
| `/cart/add` | POST | 添加商品到购物车 |
| `/cart/update/{cartId}` | PUT | 更新商品数量 |
| `/cart/remove/{cartId}` | DELETE | 删除商品 |

### 门店模块
| 接口 | 方法 | 说明 |
|------|------|------|
| `/stores` | GET | 获取门店列表 |
| `/stores/{id}` | GET | 获取门店详情 |

## 🎨 设计规范

### 配色方案
- **主色**: `#2D1F14` (深咖啡色)
- **辅助色**: `#8B7355` (暖棕色)
- **高亮色**: `#C4A35A` (金色)
- **背景色**: `#FAF8F5` (米白色)

### 字体
- 中文字体: 思源黑体 / Noto Sans SC
- 英文字体: Inter / SF Pro Display

### 动效
- 过渡动画: 0.3s cubic-bezier(0.4, 0, 0.2, 1)
- 悬停缩放: scale(1.02) ~ scale(1.05)
- 阴影层级: 柔和阴影增强层次感

## 📝 开发说明

### 前端规范
- 使用 `<script setup>` 语法
- 组件命名采用 PascalCase
- 样式使用 scoped 隔离
- 路由使用命名路由

### 后端规范
- 分层架构: Controller → Service → Mapper
- 使用 Lombok 简化代码
- 参数校验使用 Jakarta Validation
- 统一返回格式: `{ code, message, data }`

## 📄 License

MIT License

---

**Version**: v-1.1  
**Build**: ✅ Frontend & Backend Ready  
**Design Inspired by**: [oryzo.ai](https://oryzo.ai/)
