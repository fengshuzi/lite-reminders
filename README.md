# Lite Reminders

Manage macOS Reminders directly in Obsidian, without opening the Reminders app.

## Features

- **macOS Integration** - Directly operates macOS Reminders.app via JXA
- **No App Switching** - Background automation through osascript
- **Full CRUD** - Create, view, edit, complete, and delete reminders
- **Inbox List** - View and manage reminders in your Inbox
- **Due Dates** - Set due dates and times
- **Sidebar View** - View all reminders in an Obsidian sidebar
- **iCloud Sync** - Data stored in macOS, automatically synced to all devices

## Requirements

- **macOS only** - Uses macOS system APIs
- Obsidian 1.2.8 or later

## Installation

### From Community Marketplace (recommended)

Open Obsidian Settings -> Community plugins -> Browse, search **Lite Reminders** or **fengshuzi**.

### From source

```bash
git clone https://github.com/fengshuzi/lite-reminders.git
cd lite-reminders
npm install
npm run build
```

### Manual install

1. Download the latest release
2. Extract to `.obsidian/plugins/lite-reminders/`
3. Enable the plugin in Obsidian settings

## Usage

### Open reminders view

- Click the bell icon in the left sidebar
- Or use command palette: `Ctrl/Cmd + P` -> "打开提醒事项"

### Add a reminder

1. Click the NOTE button
2. Enter title, select list (default Inbox), set due time
3. The reminder is automatically added to macOS Reminders

### Edit a reminder

- Double-click a reminder card to enter edit mode
- Or right-click and select "编辑"

### Complete a reminder

- Right-click a reminder and select "标记完成"

### Delete a reminder

- Right-click a reminder and select "删除"

## Development

```bash
npm run dev      # watch mode
npm run build    # production build
npm run deploy   # build + copy to local vaults
```

## License

MIT License

---

## 中文说明

直接在 Obsidian 中管理 macOS 系统提醒事项，无需打开提醒事项应用。

### 功能特性

- **macOS 系统集成** - 直接操作 macOS Reminders.app
- **无需打开应用** - 通过 JXA 脚本后台操作
- **完整 CRUD** - 创建、查看、编辑、完成、删除提醒
- **Inbox 列表** - 查看和管理 Inbox 中的待办事项
- **截止时间** - 支持设置截止日期和时间
- **侧边栏视图** - 在 Obsidian 侧边栏查看所有提醒
- **系统同步** - 数据存储在 macOS 系统中，自动同步到所有设备

### 安装

#### 社区市场安装（推荐）

打开 Obsidian 设置 -> 第三方插件 -> 浏览，搜索 **Lite Reminders** 或 **fengshuzi**。

#### 从源码构建

```bash
git clone https://github.com/fengshuzi/lite-reminders.git
cd lite-reminders
npm install
npm run build
npm run deploy
```

#### 手动安装

1. 下载最新的 release
2. 解压到 `.obsidian/plugins/lite-reminders/`
3. 在 Obsidian 设置中启用插件

### 使用方法

#### 打开提醒事项视图

- 点击左侧边栏的铃铛图标
- 或使用命令面板: `Ctrl/Cmd + P` -> "打开提醒事项"

#### 添加提醒

1. 点击 NOTE 按钮
2. 填写标题、选择列表（默认 Inbox）、设置截止时间
3. 提醒会自动添加到 macOS 系统提醒事项

#### 编辑提醒

- 双击提醒卡片进入编辑模式
- 或右键菜单选择"编辑"

#### 完成提醒

- 右键菜单选择"标记完成"

#### 删除提醒

- 右键菜单选择"删除"

## License

MIT License

---

## ☕ 请作者喝杯咖啡

如果这个插件帮助了你，欢迎扫码打赏，感谢支持！

![微信打赏](https://raw.githubusercontent.com/fengshuzi/images/main/wechat-donate.jpg)
