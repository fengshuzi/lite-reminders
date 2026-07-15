import { exec } from "child_process";
import { promisify } from "util";
import { Reminder } from "./types";
import { Notice, Platform } from "obsidian";

const execAsync = promisify(exec);

type RemindersResult = Record<string, Array<{ title: string; id: string; due?: string }>>;

export class ReminderStorage {
    private isMac: boolean;
    private listName: string;

    constructor(listName: string = "Inbox") {
        this.isMac = Platform.isMacOS;
        this.listName = listName;
    }

    setListName(listName: string): void {
        this.listName = listName || "Inbox";
    }

    private checkMacOS(): boolean {
        if (!this.isMac) {
            new Notice("此功能仅支持 macOS 系统");
            return false;
        }
        return true;
    }

    private async runJXA(script: string): Promise<string | null> {
        if (!this.checkMacOS()) return null;

        try {
            const { stdout } = await execAsync(`osascript -l JavaScript -e '${script}'`, {
                timeout: 30000,
            });
            return stdout.trim();
        } catch {
            new Notice("执行提醒事项操作失败");
            return null;
        }
    }

    private escapeJXA(str: string): string {
        return str
            .replace(/\\/g, "\\\\")
            .replace(/'/g, "\\'")
            .replace(/\n/g, "\\n");
    }

    private parseRemindersResult(result: string): Reminder[] {
        const parsed: unknown = JSON.parse(result);
        if (!parsed || typeof parsed !== "object") return [];

        const data = parsed as Record<string, unknown>;
        const reminders: Reminder[] = [];

        for (const [listName, items] of Object.entries(data)) {
            if (!Array.isArray(items)) continue;
            for (const item of items) {
                if (!item || typeof item !== "object") continue;
                const obj = item as Record<string, unknown>;
                if (typeof obj.id !== "string" || typeof obj.title !== "string") continue;
                reminders.push({
                    id: obj.id,
                    title: obj.title,
                    list: listName,
                    due: typeof obj.due === "string" ? obj.due : undefined,
                    completed: false,
                    created: "",
                    updated: "",
                });
            }
        }

        return reminders;
    }

    async getAllReminders(): Promise<Reminder[]> {
        const listName = this.escapeJXA(this.listName);
        const script = `var Reminders=Application('Reminders');var result={};var lists=Reminders.lists();var listCount=lists.length;for(var i=0;i<listCount;i++){var list=lists[i];var listName=list.name();if(listName!=='${listName}')continue;var reminders=list.reminders.whose({completed:false})();var reminderCount=reminders.length;result[listName]=[];for(var j=0;j<reminderCount;j++){var r=reminders[j];var item={title:r.name(),id:r.id()};var dueDate=r.dueDate();if(dueDate&&dueDate.toString()!=='missing value'){item.due=dueDate.toISOString();}result[listName].push(item);}break;}JSON.stringify(result);`.replace(/\n/g, "");

        const result = await this.runJXA(script);
        if (!result) return [];

        try {
            return this.parseRemindersResult(result);
        } catch {
            return [];
        }
    }

    async getLists(): Promise<string[]> {
        const script = `var Reminders=Application('Reminders');JSON.stringify(Reminders.lists().map(function(l){return l.name();}));`;
        const result = await this.runJXA(script);
        if (!result) return ["Inbox"];

        try {
            const parsed: unknown = JSON.parse(result);
            if (!Array.isArray(parsed)) return ["Inbox"];
            return parsed.filter((item): item is string => typeof item === "string");
        } catch {
            return ["Inbox"];
        }
    }

    async addReminder(title: string, due?: string): Promise<boolean> {
        return this.createReminder(title, this.listName, due);
    }

    async createReminder(title: string, listName: string, due?: string): Promise<boolean> {
        const titleEsc = this.escapeJXA(title);
        const listNameEsc = this.escapeJXA(listName);
        const duePart = due ? `,dueDate:new Date('${due}')` : "";
        const script = `var Reminders=Application('Reminders');var list=Reminders.lists.whose({name:'${listNameEsc}'})[0];var r=Reminders.Reminder({name:'${titleEsc}'${duePart}});list.reminders.push(r);'ok';`.replace(/\n/g, "");

        const result = await this.runJXA(script);
        if (result) {
            new Notice("提醒已添加");
            return true;
        }
        return false;
    }

    async deleteReminder(id: string): Promise<boolean> {
        const idEsc = this.escapeJXA(id);
        const script = `var Reminders=Application('Reminders');var r=Reminders.reminders.byId('${idEsc}');r.delete();'ok';`;
        const result = await this.runJXA(script);
        if (result) {
            new Notice("提醒已删除");
            return true;
        }
        return false;
    }

    async updateReminder(id: string, title: string, due?: string): Promise<boolean> {
        const idEsc = this.escapeJXA(id);
        const titleEsc = this.escapeJXA(title);
        const duePart = due ? `r.dueDate=new Date('${due}');` : "r.dueDate=null;";
        const script = `var Reminders=Application('Reminders');var r=Reminders.reminders.byId('${idEsc}');r.name='${titleEsc}';${duePart}'ok';`;
        const result = await this.runJXA(script);
        if (result) {
            new Notice("提醒已更新");
            return true;
        }
        return false;
    }

    async toggleComplete(id: string): Promise<boolean> {
        const idEsc = this.escapeJXA(id);
        const script = `var Reminders=Application('Reminders');var r=Reminders.reminders.byId('${idEsc}');r.completed=true;'ok';`;
        const result = await this.runJXA(script);
        if (result) {
            new Notice("提醒已完成");
            return true;
        }
        return false;
    }

    getActiveReminders(): Reminder[] {
        return [];
    }

    sortReminders(reminders: Reminder[], sortBy: "due" | "created" | "title"): Reminder[] {
        return [...reminders].sort((a, b) => {
            switch (sortBy) {
                case "due":
                    if (!a.due && !b.due) return 0;
                    if (!a.due) return 1;
                    if (!b.due) return -1;
                    return new Date(a.due).getTime() - new Date(b.due).getTime();
                case "title":
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });
    }
}
