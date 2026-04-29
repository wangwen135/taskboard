# 💡 想法记录 (Ideas)

一个轻量级的个人想法记录工具，支持标签筛选、优先级管理、多视图切换，数据存储在本地 JSON 文件中。

## ✨ 功能特性

- 📝 **想法管理** — 添加、编辑、删除想法，支持多标签
- 🏷️ **标签筛选** — 左侧标签云多选过滤，快速定位
- 🎯 **优先级** — 高/中/低三级优先级管理
- 📋 **三种视图** — 列表 / 泳道 / 日历，按需切换
- 🔍 **搜索过滤** — 按内容或标签关键词搜索
- 📅 **日历浏览** — 按月查看历史想法
- 🌙 **明暗主题** — 暗色/亮色切换
- 📤 **导入导出** — JSON 格式备份恢复
- 💾 **本地存储** — 数据保存在 JSON 文件，无需数据库

## 🚀 快速开始

### 环境要求

- Node.js >= 16
- npm

### 安装

```bash
cd ideas
npm install
```

### 启动

```bash
npm start
# 或
node server.js
```

服务默认运行在 `http://localhost:3333`

### 使用 Nginx 反向代理（可选）

```nginx
server {
    listen 8083;
    
    location / {
        proxy_pass http://127.0.0.1:3333;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📁 项目结构

```
ideas/
├── server.js          # Express 后端 API
├── package.json       # 依赖配置
├── public/
│   └── index.html     # 前端单页应用
├── ideas.json         # 数据存储（运行时生成）
├── CHANGELOG.md       # 版本更新日志
└── README.md          # 项目说明
```

## 📖 API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/ideas` | 获取所有想法 |
| POST | `/api/ideas` | 添加想法 |
| PUT | `/api/ideas/:id` | 更新想法 |
| DELETE | `/api/ideas/:id` | 删除想法 |
| GET | `/api/tags` | 获取所有标签及计数 |
| POST | `/api/import` | 导入数据 |
| GET | `/api/health` | 健康检查 |

### 数据模型

```json
{
  "id": "lxyz123abc",
  "content": "想法内容",
  "tags": ["标签1", "标签2"],
  "priority": "high|medium|low",
  "completed": false,
  "createdAt": 1712448000000,
  "updatedAt": 1712448000000
}
```

## 🛠️ 技术栈

- **后端：** Node.js + Express 5
- **前端：** 原生 HTML/CSS/JavaScript
- **存储：** 本地 JSON 文件

## 📄 License

MIT
