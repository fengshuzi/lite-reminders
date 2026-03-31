# Obsidian Reminders Plugin - macOS 集成

直接在 Obsidian 中管理 macOS 系统提醒事项，无需打开提醒事项应用。

## 功能特性

- ✅ **macOS 系统集成** - 直接操作 macOS Reminders.app
- ✅ **无需打开应用** - 通过 JXA 脚本后台操作
- ✅ **完整 CRUD** - 创建、查看、编辑、完成、删除提醒
- ✅ **Inbox 列表** - 查看和管理 Inbox 中的待办事项
- ✅ **截止时间** - 支持设置截止日期和时间
- ✅ **侧边栏视图** - 在 Obsidian 侧边栏查看所有提醒
- ✅ **系统同步** - 数据存储在 macOS 系统中，自动同步到所有设备

## 系统要求

- ⚠️ **仅支持 macOS** - 使用 macOS 系统 API
- Obsidian 1.2.8 或更高版本

## 安装

### 方法 1: 从源码构建

```bash
# 克隆仓库
git clone https://github.com/yourusername/obsidian-reminders.git
cd obsidian-reminders

# 安装依赖
npm install

# 构建
npm run build

# 部署到多个 vaults
npm run deploy
```

### 方法 2: 手动安装

1. 下载最新的 release
2. 解压到 `.obsidian/plugins/obsidian-reminders/`
3. 在 Obsidian 设置中启用插件

## 使用方法

### 打开提醒事项视图

- 点击左侧边栏的铃铛图标 🔔
- 或使用命令面板: `Ctrl/Cmd + P` → "打开提醒事项"

### 添加提醒

1. 点击 ➕ 按钮
2. 填写标题、选择列表（默认 Inbox）、设置截止时间
3. 点击"添加"
4. 提醒会自动添加到 macOS 系统提醒事项

### 编辑提醒

- 点击提醒项进入编辑模式
- 或右键菜单选择"编辑"

### 完成提醒

- 点击提醒项前的圆圈 ⭕
- 或右键菜单选择"标记完成"
- 提醒会在 macOS 系统中标记为已完成

### 删除提醒

- 点击提醒项右侧的 🗑️ 图标
- 或右键菜单选择"删除"
- 提醒会从 macOS 系统中删除

## 技术实现

### JXA (JavaScript for Automation)

插件使用 JXA 脚本通过 `osascript` 命令操作 macOS Reminders.app：

```typescript
// 获取提醒列表
osascript -l JavaScript -e "var Reminders=Application('Reminders');..."

// 添加提醒
osascript -l JavaScript -e "var r=Reminders.Reminder({name:'...'});..."

// 完成提醒
osascript -l JavaScript -e "var r=Reminders.reminders.byId('...');r.completed=true;"
```

### 数据存储

- 数据存储在 macOS 系统提醒事项中
- 自动同步到 iCloud
- 可在 iPhone、iPad、Mac 等设备查看

## 开发

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 部署到多个 vaults

编辑 `deploy.mjs` 配置你的 vault 路径，然后运行：

```bash
npm run build-deploy
```

## 参考

本插件参考了 Logseq 的 macOS 提醒事项集成实现：
- [Logseq Reminders](https://github.com/logseq/logseq)
- [macOS 日历和提醒事项集成文档](docs/macOS日历和提醒事项集成.md)

## 许可证

MIT License


---

## ☕ 请作者喝杯咖啡

如果这个插件帮助了你，欢迎扫码打赏，感谢支持！

<div align="center">
  <img src="./assets/wechat-donate.jpg" alt="微信打赏" width="200" />
  <p><sub>微信扫码打赏</sub></p>
</div>
