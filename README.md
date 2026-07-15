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

### Manual install

1. Download `main.js`, `manifest.json`, and `styles.css` from the [latest release](https://github.com/fengshuzi/lite-reminders/releases)
2. Create a folder `.obsidian/plugins/lite-reminders/` in your vault
3. Copy the three files into that folder
4. Enable the plugin in Obsidian Settings -> Community plugins

## Usage

### Open reminders view

- Click the bell icon in the left sidebar
- Or use command palette: `Ctrl/Cmd + P` -> "Open reminders"

### Add a reminder

1. Type your reminder in the input box at the top
2. Optionally click the calendar icon to set a due date
3. Click **NOTE** to submit
4. The reminder is automatically added to macOS Reminders

### Edit a reminder

- Double-click a reminder card to edit it inline
- Or right-click a reminder and select **Edit**

### Complete a reminder

- Right-click a reminder and select **Mark complete**

### Delete a reminder

- Right-click a reminder and select **Delete**

## Settings

- **Reminder list name** - Specify which macOS Reminders list to display (default: Inbox)

## Development

```bash
npm install      # install dependencies
npm run dev      # watch mode with sourcemaps
npm run build    # lint + production build
npm run deploy   # build + copy to local vaults
```

## License

[MIT](LICENSE)

---

## ☕ Support the developer

If this plugin helps you, consider buying me a coffee!

![WeChat Donate](https://raw.githubusercontent.com/fengshuzi/images/main/wechat-donate.jpg)
