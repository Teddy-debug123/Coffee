# 咖啡在线 Coffee-Online

一个精致的精品咖啡在线选购平台，采用 Vue 3 + Vite 构建，提供沉浸式的3D产品展示和流畅的用户体验。

**版本**: v2.0.0
**在线预览**: http://localhost:5173/

---

## 技术栈

### 前端框架
| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | ^3.5.13 | 核心框架，Composition API |
| Vite | ^6.3.5 | 构建工具，开发服务器 |
| Vue Router | ^4.6.4 | 页面路由管理 |

### 状态管理
| 技术 | 版本 | 用途 |
|------|------|------|
| Pinia | ^3.0.4 | 轻量级状态管理 |

### 3D图形
| 技术 | 版本 | 用途 |
|------|------|------|
| Three.js | ^0.184.0 | 3D渲染引擎 |
| @types/three | ^0.184.1 | Three.js TypeScript支持 |

### 动画库
| 技术 | 版本 | 用途 |
|------|------|------|
| GSAP | ^3.15.0 | 高性能动画引擎 |

### UI组件
| 技术 | 版本 | 用途 |
|------|------|------|
| Element Plus | ^2.14.2 | UI组件库 |

### HTTP请求
| 技术 | 版本 | 用途 |
|------|------|------|
| Axios | ^1.18.0 | HTTP请求库 |
| @vueuse/core | ^14.3.0 | Vue组合式工具库 |

---

## 项目结构

```
coffee-online/
├── public/                      # 静态资源
│   ├── coffee-images/          # 咖啡产品图片
│   ├── coffee_bean.glb        # 3D咖啡豆模型
│   └── earth.jpg               # 地球纹理图
├── src/
│   ├── api/                    # API接口封装
│   │   ├── cart.js            # 购物车API
│   │   ├── user.js            # 用户API
│   │   ├── index.js           # API统一导出
│   │   └── mock.js            # 模拟数据
│   ├── assets/                 # 资源文件
│   ├── components/             # 公共组件
│   │   ├── NavBar.vue         # 导航栏
│   │   ├── SideMenu.vue       # 侧边菜单
│   │   ├── CartSidebar.vue    # 购物车侧边栏
│   │   ├── CoffeeBean3D.vue   # 3D咖啡豆展示
│   │   ├── CoffeeBeanParticle.vue # 粒子效果
│   │   ├── CoffeeScene3D.vue  # 3D场景
│   │   ├── CoffeeVideoScene.vue # 视频场景
│   │   ├── StatsCard.vue      # 统计卡片
│   │   ├── FeatureCard.vue    # 特色卡片
│   │   ├── Footer.vue         # 页脚
│   │   └── ...
│   ├── stores/                 # Pinia状态管理
│   │   ├── cart.js            # 购物车状态
│   │   └── user.js            # 用户状态
│   ├── utils/                  # 工具函数
│   │   ├── request.js         # Axios封装
│   │   └── audio.js           # 音频管理
│   ├── views/                  # 页面视图
│   │   ├── Home.vue           # 首页
│   │   ├── Login.vue          # 登录页
│   │   ├── Register.vue       # 注册页
│   │   ├── Cart.vue           # 购物车页
│   │   ├── Profile.vue        # 个人中心
│   │   ├── coffee-bean/        # 咖啡豆详情页
│   │   │   ├── YirgacheffeDetail.vue
│   │   │   ├── SantosDetail.vue
│   │   │   └── ...
│   │   └── ...
│   ├── router/                 # 路由配置
│   │   └── index.js
│   ├── App.vue                # 根组件
│   ├── main.js                # 入口文件
│   └── style.css              # 全局样式
└── backend/                   # 后端服务（Java Spring Boot）
```

---

## 核心功能模块

### 1. 产品展示系统

#### 首页 (Home.vue)
- Hero区域：3D咖啡豆模型展示
- 统计数据：实时计算产地数、咖啡豆数量、好评率
- 产品列表：咖啡豆卡片网格展示
- 特色功能介绍区
- 产地地图展示

#### 咖啡豆详情页
- 10个独立详情页对应不同产品
- 图片轮播组件
- 规格选择（100g / 250g）
- 风味关键词展示
- 产品故事与冲泡建议
- 加入购物车功能

### 2. 3D可视化系统

#### CoffeeBean3D.vue
**技术实现**:
- Three.js渲染3D咖啡豆GLTF模型
- OrbitControls轨道控制（鼠标拖拽旋转、滚轮缩放）
- 动态光照效果（环境光 + 平行光）
- 鼠标悬停交互（3D卡片跟随鼠标倾斜）
- 自动旋转动画

```javascript
// 核心逻辑
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ alpha: true })
const controls = new OrbitControls(camera, renderer.domElement)
// 加载GLTF模型
const loader = new GLTFLoader()
loader.load('/coffee_bean.glb', (gltf) => { ... })
```

#### CoffeeBeanParticle.vue
**技术实现**:
- 粒子系统创建咖啡豆形状粒子云
- GSAP动画控制粒子运动
- 响应式画布尺寸
- requestAnimationFrame循环渲染

### 3. 动画系统

#### 全局动画策略

| 动画类型 | 实现方式 | 应用场景 |
|----------|----------|----------|
| CSS过渡 | transition | 按钮悬停、页面切换 |
| CSS动画 | @keyframes | 加载动画、脉冲效果 |
| GSAP | gsap.to()/timeline() | 复杂序列动画 |
| Vue Transition | `<Transition>` | 路由切换、弹窗 |
| Three.js | requestAnimationFrame | 3D渲染循环 |

#### 主要动画效果

1. **卡片悬停效果** (CoffeeBeanCard.vue)
   - 3D透视倾斜跟随鼠标
   - 图片缩放微交互
   - 添加购物车按钮状态反馈

2. **页面过渡** (App.vue)
   - 淡入淡出切换效果
   - 路由级别代码分割优化

3. **弹窗动画** (CartSidebar.vue)
   - 侧边栏滑入滑出
   - 内容淡入效果

### 4. 状态管理系统

#### Cart Store (cart.js)
```javascript
// 状态结构
{
  items: [],           // 购物车商品列表
  isOpen: false        // 侧边栏开关状态
}

// 核心方法
addItem(item)         // 添加商品到购物车
removeItem(id)        // 移除商品
updateQuantity(id, q) // 更新数量
clearCart()          // 清空购物车
totalPrice            // 计算总价（computed）
totalItems            // 商品总数（computed）
```

#### User Store (user.js)
```javascript
// 状态结构
{
  user: null,         // 用户信息
  token: null         // JWT令牌
}

// 核心方法
login(credentials)   // 登录
register(data)        // 注册
logout()             // 登出
checkAuth()           // 验证登录状态
```

### 5. 路由系统

#### 路由配置 (router/index.js)
- 路由守卫：需要登录的页面自动跳转登录页
- 懒加载：详情页使用动态导入优化首屏加载
- 路由元信息：页面标题、权限要求

```javascript
// 示例路由
{
  path: '/coffee-bean/:id/:beanId',
  component: () => import('../views/coffee-bean/...'),
  meta: { title: '咖啡在线', requiresAuth: false }
}
```

### 6. HTTP请求封装

#### request.js
- Axios实例配置
- 请求拦截器（添加Token）
- 响应拦截器（统一错误处理）
- 错误提示（Element Plus Message）

---

## 样式系统

### CSS变量 (style.css)
```css
:root {
  --color-primary: #4A3C31;      /* 主色-咖啡棕 */
  --color-primary-dark: #3A2E23;
  --color-bg: #FAF8F5;           /* 背景色-米白 */
  --color-surface: #FFFFFF;
  --color-line: #E8E2DC;
  --color-muted: #8C7B6B;
  --color-text: #2D2418;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
}
```

### 响应式断点
- 移动端：< 768px
- 平板：768px - 1024px
- 桌面：> 1024px

---

## 交互特效详解

### 1. 鼠标跟随3D倾斜
**文件**: CoffeeBeanCard.vue
```javascript
// 鼠标移动事件处理
const handleMouseMove = (e) => {
  const rect = cardRef.value.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5
  rotation.x = -y * 8  // Y轴旋转
  rotation.y = x * 8    // X轴旋转
}
```

### 2. 音频反馈
**文件**: utils/audio.js
- 点击音效反馈
- 添加购物车成功音效
- 统一的音频管理类

### 3. 数字滚动动画
**文件**: StatsCard.vue
- 数字递增动画效果
- 计数完成回调

---

## 后端API（可选）

项目支持连接后端服务：

| 接口 | 方法 | 描述 |
|------|------|------|
| /api/user/login | POST | 用户登录 |
| /api/user/register | POST | 用户注册 |
| /api/cart/add | POST | 添加购物车 |
| /api/cart/list | GET | 获取购物车列表 |

---

## 开发命令

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

---

## 浏览器兼容性

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

---

## 设计理念

1. **沉浸式体验**：3D技术与产品展示结合，提供直观的产品认知
2. **流畅交互**：每个操作都有即时的视觉和听觉反馈
3. **性能优先**：路由懒加载、组件按需渲染
4. **优雅降级**：无3D支持的浏览器显示静态图片

---

*最后更新: 2024年*
