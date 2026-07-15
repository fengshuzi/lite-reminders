import { ItemView, WorkspaceLeaf, Menu, Modal, setIcon } from "obsidian";
import type RemindersPlugin from "../main";
import { Reminder } from "../types";
import { DateTimePickerModal } from "../components/DateTimePicker";

export const VIEW_TYPE_REMINDERS = "reminders-view";

export class RemindersView extends ItemView {
    plugin: RemindersPlugin;
    private editHandler: ((reminder: Reminder) => void) | null = null;
    private listContainer: HTMLElement | null = null;

    constructor(leaf: WorkspaceLeaf, plugin: RemindersPlugin) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType(): string {
        return VIEW_TYPE_REMINDERS;
    }

    getDisplayText(): string {
        return "提醒事项";
    }

    getIcon(): string {
        return "bell";
    }

    async onOpen(): Promise<void> {
        this.render();
    }

    async onClose(): Promise<void> {
    }

    render(): void {
        const container = this.contentEl;
        container.empty();
        container.addClass("reminders-view");

        this.renderInputArea(container);
        this.renderRemindersList(container);
    }

    private renderInputArea(container: HTMLElement): void {
        const inputArea = container.createDiv("reminders-input-area");

        const inputWrapper = inputArea.createDiv("reminders-input-wrapper");

        const statusHint = inputWrapper.createDiv("reminders-input-hint");
        statusHint.addClass("is-hidden");

        const textarea = inputWrapper.createEl("textarea", {
            cls: "reminders-input",
            attr: {
                placeholder: "你现在在想什么？",
                rows: "3"
            }
        });

        const inputActions = inputWrapper.createDiv("reminders-input-actions");

        const toolbar = inputActions.createDiv("reminders-input-toolbar");

        let selectedTime: Date | null = null;

        const timeDisplay = inputWrapper.createDiv("reminders-time-display");
        timeDisplay.addClass("is-hidden");

        const updateTimeDisplay = () => {
            if (selectedTime) {
                timeDisplay.removeClass("is-hidden");
                timeDisplay.empty();
                const inner = timeDisplay.createDiv({ cls: "reminders-time-display-inner" });
                inner.createSpan({ text: `📅 ${this.formatDateTime(selectedTime.toISOString())}` });
                const clearBtn = inner.createEl("button", { text: "清除", cls: "reminders-time-clear" });
                clearBtn.addEventListener("click", () => {
                    selectedTime = null;
                    timeDisplay.addClass("is-hidden");
                    timeBtn.removeClass("active");
                });
            } else {
                timeDisplay.addClass("is-hidden");
            }
        };

        const timeBtn = toolbar.createEl("button", { cls: "reminders-toolbar-btn" });
        setIcon(timeBtn, "calendar");
        timeBtn.title = "选择日期时间";
        timeBtn.onclick = () => {
            this.showDateTimePicker(selectedTime || new Date(), (date) => {
                selectedTime = date;
                updateTimeDisplay();
                timeBtn.addClass("active");
            });
        };

        const actionButtons = inputActions.createDiv("reminders-action-buttons");

        const cancelBtn = actionButtons.createEl("button", {
            cls: "reminders-cancel-btn",
            text: "取消编辑"
        });
        cancelBtn.addClass("is-hidden");

        const submitBtn = actionButtons.createEl("button", {
            cls: "reminders-submit-btn",
            text: "NOTE"
        });

        let editingReminderId: string | null = null;

        cancelBtn.onclick = () => {
            textarea.value = "";
            selectedTime = null;
            timeDisplay.addClass("is-hidden");
            statusHint.addClass("is-hidden");
            cancelBtn.addClass("is-hidden");
            submitBtn.textContent = "NOTE";
            textarea.placeholder = "你现在在想什么？";
            editingReminderId = null;
            timeBtn.removeClass("active");
        };

        submitBtn.onclick = async () => {
            const content = textarea.value.trim();
            if (!content) return;

            const dueDate = selectedTime ? selectedTime.toISOString() : undefined;

            if (editingReminderId) {
                await this.plugin.storage.updateReminder(editingReminderId, content, dueDate);
            } else {
                await this.plugin.storage.addReminder(content, dueDate);
            }

            textarea.value = "";
            selectedTime = null;
            timeDisplay.addClass("is-hidden");
            statusHint.addClass("is-hidden");
            cancelBtn.addClass("is-hidden");
            submitBtn.textContent = "NOTE";
            textarea.placeholder = "你现在在想什么？";
            editingReminderId = null;
            timeBtn.removeClass("active");

            await this.loadAndRender();
        };

        textarea.onkeydown = (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submitBtn.click();
            } else if (e.key === "Escape" && editingReminderId) {
                e.preventDefault();
                cancelBtn.click();
            }
        };

        this.editHandler = (reminder: Reminder) => {
            editingReminderId = reminder.id;
            textarea.value = reminder.title;
            if (reminder.due) {
                selectedTime = new Date(reminder.due);
                updateTimeDisplay();
                timeBtn.addClass("active");
            }
            statusHint.textContent = "Modifying...";
            statusHint.removeClass("is-hidden");
            cancelBtn.removeClass("is-hidden");
            submitBtn.textContent = "保存";
            textarea.placeholder = "编辑提醒内容...";
            textarea.focus();
            textarea.setSelectionRange(textarea.value.length, textarea.value.length);

            this.containerEl.scrollTop = 0;
        };
    }

    private showDateTimePicker(initialDate: Date, onSelect: (date: Date) => void): void {
        const modal = new DateTimePickerModal(this.app, {
            initialDate,
            onSelect: (date) => {
                onSelect(date);
            },
            onClose: () => {
            },
        });

        modal.open();
    }

    private async loadAndRender(): Promise<void> {
        const reminders = await this.plugin.storage.getAllReminders();
        this.renderRemindersContent(reminders);
    }

    private renderRemindersList(container: HTMLElement): void {
        this.listContainer = container.createDiv("reminders-list-container");
        this.listContainer.createDiv({ text: "加载中...", cls: "reminders-loading" });

        void this.plugin.storage.getAllReminders().then((reminders) => {
            if (!this.listContainer) return;
            this.listContainer.empty();
            this.renderRemindersContent(reminders, this.listContainer);
        });
    }

    private renderRemindersContent(reminders: Reminder[], container?: HTMLElement): void {
        const listContainer = container || this.listContainer;
        if (!listContainer) return;

        listContainer.empty();

        if (reminders.length === 0) {
            const emptyState = listContainer.createDiv({ cls: "reminders-empty-state" });
            emptyState.createDiv({ text: "💭", cls: "reminders-empty-icon" });
            emptyState.createDiv({ text: "还没有提醒事项", cls: "reminders-empty-title" });
            emptyState.createDiv({
                text: "在上方输入框开始记录",
                cls: "reminders-empty-desc"
            });
            return;
        }

        const sorted = this.plugin.storage.sortReminders(reminders, "due");

        sorted.forEach((reminder) => {
            this.renderReminderItem(listContainer, reminder);
        });
    }

    private renderReminderItem(container: HTMLElement, reminder: Reminder): void {
        const item = container.createDiv("reminder-item");
        item.dataset.reminderId = reminder.id;

        const card = item.createDiv("reminder-card");

        const cardHeader = card.createDiv("reminder-card-header");

        const timeEl = cardHeader.createDiv("reminder-card-time");
        timeEl.textContent = this.formatDateTime(reminder.due || reminder.created);

        const cardActions = cardHeader.createDiv("reminder-card-actions");

        const moreBtn = cardActions.createEl("button", { cls: "reminder-more-btn" });
        setIcon(moreBtn, "more-horizontal");
        moreBtn.title = "更多操作";
        moreBtn.onclick = (e) => {
            e.stopPropagation();
            this.showContextMenu(e, reminder);
        };

        const cardBody = card.createDiv("reminder-card-body");

        cardBody.createDiv({ text: reminder.title, cls: "reminder-card-title" });

        cardBody.ondblclick = () => {
            this.editHandler?.(reminder);
        };

        card.oncontextmenu = (e) => {
            e.preventDefault();
            this.showContextMenu(e, reminder);
        };
    }

    private formatDateTime(dateStr?: string): string {
        if (!dateStr) return "";

        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = this.pad(date.getMonth() + 1);
        const day = this.pad(date.getDate());
        const hour = this.pad(date.getHours());
        const minute = this.pad(date.getMinutes());

        if (hour === "00" && minute === "00") {
            return `${year}-${month}-${day}`;
        }

        return `${year}-${month}-${day} ${hour}:${minute}`;
    }

    private showContextMenu(e: MouseEvent, reminder: Reminder): void {
        const menu = new Menu();

        menu.addItem((item) => {
            item.setTitle("编辑")
                .setIcon("pencil")
                .onClick(() => {
                    this.editHandler?.(reminder);
                });
        });

        menu.addItem((item) => {
            item.setTitle("标记完成")
                .setIcon("check")
                .onClick(() => {
                    void this.confirmAndComplete(reminder);
                });
        });

        menu.addItem((item) => {
            item.setTitle("删除")
                .setIcon("trash")
                .onClick(() => {
                    void this.confirmAndDelete(reminder);
                });
        });

        menu.showAtMouseEvent(e);
    }

    private async confirmAndComplete(reminder: Reminder): Promise<void> {
        await this.plugin.storage.toggleComplete(reminder.id);
        await this.loadAndRender();
    }

    private async confirmAndDelete(reminder: Reminder): Promise<void> {
        const confirmed = await new Promise<boolean>((resolve) => {
            const modal = new Modal(this.app);
            modal.titleEl.setText("确认删除");
            modal.contentEl.createEl("p", { text: "确定删除这条提醒事项吗？" });
            const btnGroup = modal.contentEl.createDiv();
            btnGroup.createEl("button", { text: "取消" }).onclick = () => {
                modal.close();
                resolve(false);
            };
            const confirmBtn = btnGroup.createEl("button", {
                text: "删除",
                cls: "mod-warning",
            });
            confirmBtn.onclick = () => {
                modal.close();
                resolve(true);
            };
            modal.open();
        });

        if (confirmed) {
            await this.plugin.storage.deleteReminder(reminder.id);
            await this.loadAndRender();
        }
    }

    private pad(n: number): string {
        return n < 10 ? `0${n}` : `${n}`;
    }
}
