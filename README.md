# 🍱 苍穹外卖 Sky Take-Out

> 一个面向餐饮外卖场景的全栈实战项目，涵盖 **Spring Boot 后端服务**、**Vue3 + TS 管理端**、**微信小程序用户端** 三端，并通过 **Nginx** 进行静态资源托管与反向代理，实现完整的点餐、下单、支付、订单管理与运营数据统计闭环。

---

## 📖 项目简介

苍穹外卖是一套仿「饿了么 / 美团」的外卖点餐管理系统，采用前后端分离架构。系统分为两个使用端：

- **管理端（商家）**：由管理员/员工使用，负责菜品分类、菜品、套餐、员工、订单的日常管理，并提供工作台与运营数据报表。
- **用户端（C 端）**：以微信小程序形式面向消费者，提供商品浏览、购物车、下单、微信支付、订单跟踪、地址管理与历史订单等功能。

后端以一套服务同时支撑两端，通过 `admin/` 与 `user/` 两套 Controller + JWT 双令牌机制实现权限隔离。

---

## 🏗️ 系统架构

```
┌──────────────────────────────────────────────────────────────┐
│                         客户端层                              │
│  ┌─────────────────────┐        ┌──────────────────────────┐  │
│  │  管理端 (Vue3 + TS)  │        │ 用户端 (微信小程序/uniapp)│  │
│  │  Element Plus + Pinia│        │  mp-weixin 编译产物       │  │
│  └──────────┬──────────┘        └─────────────┬────────────┘  │
└─────────────┼──────────────────────────────────┼──────────────┘
              │ HTTP /api (admin)                │ HTTP (user)
              │ WebSocket /ws                    │
┌─────────────┼──────────────────────────────────┼──────────────┐
│             ▼        Nginx 反向代理            ▼              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │           Spring Boot 后端服务 (sky-take-out)          │  │
│  │  ┌──────────┐ ┌──────────┐ ┌────────┐ ┌────────────┐  │  │
│  │  │ admin/   │ │ user/    │ │ notify/│ │ WebSocket  │  │  │
│  │  │ 管理端API │ │ 用户端API │ │ 支付回调│ │ 来单提醒   │  │  │
│  │  └──────────┘ └──────────┘ └────────┘ └────────────┘  │  │
│  └────────────────────────────────────────────────────────┘  │
│         │            │             │                          │
└─────────┼────────────┼─────────────┼──────────────────────────┘
          ▼            ▼             ▼
   ┌──────────┐ ┌──────────┐ ┌──────────────┐ ┌──────────────┐
   │  MySQL   │ │  Redis   │ │ 阿里云 OSS    │ │ 微信支付/登录 │
   │ 业务数据  │ │ 缓存/校验 │ │ 图片存储      │ │ 支付/鉴权     │
   └──────────┘ └──────────┘ └──────────────┘ └──────────────┘
```

---

## 🧰 技术栈总览

| 层级 | 技术 | 版本 | 说明 |
|------|------|------|------|
| **后端框架** | Spring Boot | 3.4.5 | 主框架 |
| | Java | 24 | 运行时 |
| | Spring MVC | - | RESTful API |
| | Spring Cache | - | 缓存抽象 |
| | Spring WebSocket | - | 来单语音提醒 |
| **ORM** | MyBatis Spring Boot | 3.0.3 | 持久层 |
| | PageHelper | 2.1.0 | 分页插件 |
| **数据库/缓存** | MySQL | - | 业务数据 |
| | Druid | 1.2.24 | 连接池 |
| | Redis | - | 缓存/店铺状态 |
| **鉴权** | JJWT | 0.12.6 | 双令牌 JWT |
| **接口文档** | Knife4j | 4.5.0 | Swagger 增强 |
| | SpringDoc | 2.8.6 | OpenAPI3 |
| **第三方** | 阿里云 OSS SDK | 3.10.2 | 图片存储 |
| | 微信支付 SDK | 0.4.8 | 微信支付 |
| | Apache POI | 5.2.5 | 导出 Excel 报表 |
| **工具** | Lombok | 1.18.38 | 简化 POJO |
| | FastJSON | 1.2.83 | JSON 处理 |
| | AspectJ | 1.9.22 | AOP |
| **管理端框架** | Vue | 3.4.21 | 渐进式框架 |
| | TypeScript | 5.4.0 | 类型系统 |
| | Vite | 5.2.0 | 构建工具 |
| | Element Plus | 2.7.0 | UI 组件库 |
| | Pinia | 2.1.7 | 状态管理 |
| | Vue Router | 4.3.0 | 路由 |
| | Axios | 1.7.0 | HTTP 请求 |
| | ECharts | 5.5.0 | 数据可视化 |
| | Sass | 1.72.0 | 样式预处理 |
| **用户端** | 微信小程序 | - | mp-weixin 编译产物（uni-app 源工程编译） |
| **部署** | Nginx | 1.20.2 | 静态托管 + 反向代理 |

---

## 📂 目录结构

```
CQTakeout/
├── sky-take-out/                  # 后端服务（Spring Boot 多模块 Maven）
│   ├── sky-common/                # 通用模块：工具类、常量、属性、异常、结果封装
│   ├── sky-pojo/                  # 实体层：Entity / DTO / VO
│   ├── sky-server/                # 主服务模块：启动类、Controller、Service、Mapper、配置
│   │   └── src/main/java/com/sky/
│   │       ├── controller/{admin,user,notify}   # 三组控制器
│   │       ├── service/ + service/impl/         # 业务层
│   │       ├── mapper/                          # 持久层接口
│   │       ├── aspect/AutoFillAspect            # AOP 自动填充时间
│   │       ├── interceptor/                     # JWT 拦截器（管理端/用户端）
│   │       ├── config/                          # OSS/Redis/WebMvc/WebSocket 配置
│   │       ├── handler/GlobalExceptionHandler   # 全局异常处理
│   │       ├── task/                            # 定时任务（订单超时、来单提醒）
│   │       └── websocket/WebSocketServer        # WebSocket 服务端
│   │   └── src/main/resources/
│   │       ├── application.yml / application-dev.yml
│   │       ├── mapper/*.xml                     # MyBatis 映射
│   │       └── template/运营数据报表模板.xlsx
│   └── pom.xml
│
├── project-sky-admin-vue-ts/      # 管理端前端（Vue3 + TS + Vite）
│   └── src/
│       ├── api/                   # 接口封装（category/dish/employee/order/setMeal/...）
│       ├── views/                 # 页面（dashboard/dish/setmeal/order/employee/...）
│       ├── layout/                # 整体布局
│       ├── router.ts / permission.ts  # 路由与鉴权守卫
│       ├── store/                 # Pinia 状态管理
│       ├── utils/request.ts       # Axios 封装（拦截器/重复请求处理）
│       └── main.ts / App.vue
│
├── miniprogram/                   # 用户端微信小程序
│   └── mp-weixin/                 # uni-app 编译为微信小程序的产物
│       ├── pages/                 # index/details/order/pay/address/my/...
│       ├── common/                # 公共逻辑与请求封装
│       ├── static/                # 静态资源
│       ├── app.js / app.json / app.wxss
│       └── project.config.json
│
├── nginx-1.20.2/                  # Nginx 部署（托管管理端 dist + 反向代理）
│   ├── conf/nginx.conf
│   └── html/sky/                  # 管理端构建产物
│
└── README.md                      # 项目说明（本文件）
```

---

## ☕ 后端服务详解（sky-take-out）

### 模块划分

| 模块 | 职责 |
|------|------|
| `sky-common` | 通用工具、常量 `MessageConstant`、属性配置类、自定义异常、统一返回结果 `Result` |
| `sky-pojo` | 实体对象：`Entity`（数据库映射）、`DTO`（入参）、`VO`（出参） |
| `sky-server` | 主服务：启动类 `SkyApplication`、Web 层、业务层、持久层、配置与基础设施 |

### 业务模块（Controller 分组）

后端 Controller 按使用端分为三组，体现「一套服务、两端隔离」的设计：

**管理端 `controller/admin/`**
| 控制器 | 功能 |
|--------|------|
| `EmployeeController` | 员工登录 / 增删改查 / 分页 / 启用禁用 |
| `CategoryController` | 分类管理（菜品/套餐分类） |
| `DishController` | 菜品管理（含口味 flavor） |
| `SetmealController` | 套餐管理 |
| `OrderController` | 订单管理（接单/拒单/取消/派送/完成） |
| `CommonController` | 通用接口（文件上传至 OSS） |
| `ReportController` | 营业额/用户/订单统计、销量排名、Excel 导出 |
| `WorkSpaceController` | 工作台概览数据 |
| `ShopController` | 店铺营业状态设置/查询 |

**用户端 `controller/user/`**
| 控制器 | 功能 |
|--------|------|
| `UserController` | 微信登录（openid 换 token） |
| `AddressBookController` | 收货地址增删改查、设置默认地址 |
| `ShoppingCartController` | 购物车增删查清空 |
| `DishController` / `CategoryController` / `SetmealController` | 商品浏览（只读） |
| `OrderController` | 用户下单、历史订单、订单详情、再来一单、模拟支付 |
| `ShopController` | 查询店铺营业状态 |

**支付回调 `controller/notify/`**
| 控制器 | 功能 |
|--------|------|
| `PayNotifyController` | 微信支付结果异步回调通知 |

### 核心技术亮点

- **JWT 双令牌鉴权**：管理端与用户端使用独立的 secret-key 与 token-name（`token` / `authentication`），由 `JwtTokenAdminInterceptor`、`JwtTokenUserInterceptor` 分别拦截校验。
- **AOP 自动填充**：自定义 `@AutoFill` 注解 + `AutoFillAspect` 切面，统一拦截 insert/update 操作自动填充 `createTime` / `updateTime` / `createUser` / `updateUser`。
- **全局异常处理**：`GlobalExceptionHandler` 统一捕获业务异常与系统异常，返回标准化 `Result` 结构。
- **Spring Cache + Redis**：店铺营业状态、菜品缓存等使用注解式缓存，降低数据库压力。
- **WebSocket 来单提醒**：`WebSocketServer` + 定时任务 `WebSocketTask`，新订单到达时向管理端推送消息并播放语音提醒。
- **定时任务**：`OrderTask` 处理订单超时自动取消等。
- **阿里云 OSS 文件上传**：`OssConfiguration` 注入客户端，`CommonController` 提供统一上传接口。
- **微信支付集成**：基于 `wechatpay-apache-httpclient`（V3 API），`PayNotifyController` 处理异步回调验签与订单状态更新。
- **Apache POI 导出**：`ReportController` 将运营数据按模板导出为 Excel 报表。
- **MyBatis + PageHelper**：XML 映射 + 分页插件，开启驼峰命名自动映射。
- **接口文档**：Knife4j (OpenAPI 3) 自动生成在线 API 文档。

### 关键配置

| 配置项 | 值 |
|--------|----|
| 服务端口 | `8080` |
| 激活环境 | `dev` |
| MySQL | `localhost:3306 / sky_take_out` |
| Redis | `localhost:6379 / database:10` |
| 管理端 JWT | secret `itcast...`，TTL 7200000ms，header `token` |
| 用户端 JWT | secret `xingmeng...`，TTL 7200000ms，header `authentication` |
| 阿里云 OSS | endpoint `oss-cn-beijing.aliyuncs.com`，bucket `sky-take-out-xingmeng` |
| 微信小程序 | appid `wxdd390a0920fff3f9` |

> ⚠️ 出于安全考虑，`application-dev.yml` 中的阿里云 AccessKey、微信 AppSecret 等敏感凭据已替换为占位符（`YOUR_ALIYUN_ACCESS_KEY_ID` / `YOUR_ALIYUN_ACCESS_KEY_SECRET` / `YOUR_WECHAT_APPSECRET`）。请在本地填入自己的凭据后运行，建议通过环境变量或配置中心管理，切勿将真实凭据提交到仓库。

---

## 🖥️ 管理端前端详解（project-sky-admin-vue-ts）

### 页面模块

| 路由 | 页面 | 功能 |
|------|------|------|
| `/login` | 登录 | 员工登录 |
| `/dashboard` | 工作台 | 概览、菜品/套餐统计、当日订单、营业数据 |
| `/statistics` | 数据统计 | 营业额/用户/订单统计、销量 Top10 |
| `/order` | 订单管理 | 订单列表与状态流转处理 |
| `/dish` `/dish/add` | 菜品管理 | 菜品 CRUD、添加菜品（含口味） |
| `/setmeal` `/setmeal/add` | 套餐管理 | 套餐 CRUD、添加套餐 |
| `/category` | 分类管理 | 菜品/套餐分类 |
| `/employee` `/employee/add` | 员工管理 | 员工 CRUD、添加员工 |
| `/inform` | 消息通知 | 来单 / 催单通知 |

### 技术实现

- **状态管理**：Pinia + `pinia-plugin-persistedstate` 持久化（登录态、用户信息）。
- **路由鉴权**：`permission.ts` 全局前置守卫，未登录跳转 `/login`。
- **请求封装**：`utils/request.ts` 基于 Axios，统一注入 token、处理响应码、**重复请求拦截**、错误提示。
- **构建配置**：Vite 别名 `@` 指向 `src`，开发代理 `/api -> http://localhost:8080/admin`，开发端口 `8888`。
- **UI**：Element Plus + 自定义图标，Sass 样式，NProgress 顶部进度条。
- **可视化**：ECharts 渲染统计图表。

### 环境配置

| 环境 | 后端地址 | WebSocket |
|------|----------|-----------|
| 开发 `.env.development` | `http://localhost:8080/admin` | `ws://localhost:8080/ws/` |
| 生产 `.env.production` | 由部署环境提供 | 同上 |

---

## 📱 用户端小程序详解（miniprogram/mp-weixin）

> 当前目录为基于 **uni-app** 源工程编译生成的 **微信小程序（mp-weixin）** 产物，可直接用微信开发者工具打开运行。

### 页面清单

| 页面 | 功能 |
|------|------|
| `pages/index` | 首页：商家信息、菜品/套餐浏览、加入购物车 |
| `pages/details` | 商品详情：菜品介绍、口味选择 |
| `pages/order` | 订单确认：购物车清单、地址、备注、金额 |
| `pages/address` | 收货地址列表 |
| `pages/addOrEditAddress` | 新增 / 编辑地址 |
| `pages/remark` | 订单备注 |
| `pages/pay` | 支付页 |
| `pages/success` | 支付成功 |
| `pages/historyOrder` | 历史订单、再来一单 |
| `pages/my` | 个人中心 |
| `pages/nonet` | 无网络缺省页 |

### 业务流程

```
浏览首页/详情 ──► 加入购物车 ──► 确认订单(选地址/备注)
        │                                  │
        │                                  ▼
   继续浏览 ◄────────────────────────  发起支付
                                           │
                              ┌────────────┴────────────┐
                              ▼                         ▼
                        支付成功页                  历史订单查询
```

### 技术实现

- **登录**：微信 `wx.login` 获取 code → 后端换 openid → 签发用户端 JWT。
- **请求**：统一封装请求模块，自动携带 `authentication` 令牌。
- **主题**：导航栏粉色 `#FF8BA7`，标题「苍穹外卖」。
- **状态**：Vuex store 管理购物车与用户信息（编译产物中体现）。

---

## 🌐 Nginx 部署（nginx-1.20.2）

- 托管管理端构建产物：`html/sky/`（含 `index.html`、JS/CSS、`service-worker.js`）。
- 反向代理 `/api` 至后端 `8080`，解决前后端跨域。
- 提供 404 / 默认页。

---

## 🗄️ 数据库

数据库名：`sky_take_out`（MySQL）。主要表：

| 表 | 说明 |
|----|------|
| `employee` | 员工/管理员 |
| `category` | 分类（菜品/套餐） |
| `dish` / `dish_flavor` | 菜品及口味 |
| `setmeal` / `setmeal_dish` | 套餐及套餐-菜品关系 |
| `user` | 用户（微信 openid） |
| `address_book` | 收货地址 |
| `shopping_cart` | 购物车 |
| `orders` / `order_detail` | 订单及订单明细 |

> 完整建表脚本与设计文档见课程资料 `资料喵/资料/day01/数据库/sky.sql`（已通过 `.gitignore` 排除大体积资料，请从原始资料获取）。

---

## 🚀 快速开始

### 环境要求

- JDK 24、Maven 3.6+
- MySQL 8.x、Redis
- Node.js 18+、pnpm
- 微信开发者工具

### 1. 后端

```bash
cd sky-take-out
# 修改 sky-server/src/main/resources/application-dev.yml 中的数据库/Redis/OSS/微信配置
mvn clean package -DskipTests
java -jar sky-server/target/sky-server-1.0-SNAPSHOT.jar
# 服务启动在 http://localhost:8080
```

### 2. 管理端前端

```bash
cd project-sky-admin-vue-ts
pnpm install
pnpm dev        # 开发 http://localhost:8888
pnpm build      # 产物输出至 dist/
```

### 3. 用户端小程序

1. 用「微信开发者工具」导入 `miniprogram/mp-weixin` 目录；
2. 在 `project.config.json` 中配置自己的 AppID；
3. 配置后端服务地址后即可预览运行。

### 4. Nginx（可选，生产部署）

将管理端 `dist/` 拷贝至 `nginx-1.20.2/html/sky/`，按需修改 `conf/nginx.conf` 的反向代理目标后启动 `nginx.exe`。

---

## 🔗 接口文档

后端启动后访问 Knife4j 在线文档：

```
http://localhost:8080/doc.html
```

---

## 📌 项目特点

- **三端一体**：后端单服务支撑管理端 + 用户端，Controller 分组 + JWT 双令牌隔离。
- **工程化完善**：多模块 Maven、AOP 自动填充、全局异常、统一返回结果、接口文档。
- **真实业务闭环**：覆盖登录 → 浏览 → 购物车 → 下单 → 微信支付 → 订单管理 → 数据统计 → 导出报表全流程。
- **实时交互**：WebSocket 来单语音提醒，提升商家接单体验。
- **现代化前端**：Vue3 + TS + Vite + Pinia + Element Plus + ECharts，类型安全、构建高效。

---

## 📝 说明

- 本仓库为学习/实战项目，`资料喵/` 课程资料（含安装包与压缩包）已通过 `.gitignore` 排除，不上传至仓库。
- 敏感凭据（阿里云 AccessKey、微信 AppSecret）已从历史与配置中替换为占位符，请在本地填入自己的凭据后再运行；部署环境请使用环境变量等安全方式管理。
