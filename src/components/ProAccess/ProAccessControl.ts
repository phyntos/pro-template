export type AccessItem<
    Key extends string,
    Item extends Record<Name, Value>,
    Name extends keyof Item = keyof Item,
    Value extends Item[Name] = Item[Name],
> = {
    key: Key;
    name: Name;
    action: 'read' | 'write';
    type: 'white' | 'black';
    values: Value[];
};

export default class ProAccessControl<
    Key extends string,
    Item extends Record<Name, Value>,
    Name extends Extract<keyof Item, string> = Extract<keyof Item, string>,
    Value extends Item[Name] = Item[Name],
> {
    moduleName: string;
    accessList: AccessItem<Key, Item, Name, Item[Name]>[] = [];

    constructor(moduleName: string) {
        this.moduleName = moduleName;
    }

    setAccess<ControlName extends Name>(
        key: Key,
        name: ControlName,
        action: 'read' | 'write',
        type: 'black' | 'white',
        values: Item[ControlName][],
    ) {
        this.accessList = this.accessList.filter(
            (access) => access.key !== key || access.name !== name || access.action !== action,
        );
        this.accessList.push({
            key,
            values,
            name,
            action,
            type,
        });
        localStorage.setItem(this.moduleName + action + key + name + type, JSON.stringify(values));
    }

    private isIncludes = (access: AccessItem<Key, Item, Name, Item[Name]> | undefined, value: Item[Name]) => {
        if (!access) return true;
        if (!value) return false;
        const isIncludes = access.values.includes(value);
        return access.type === 'white' ? isIncludes : !isIncludes;
    };

    hasAccess(key: Key, data: Partial<Item>): { read: boolean; write: boolean } {
        const dataList = Object.entries(data) as [Name, Value][];

        const hasAccess = dataList.reduce(
            (acc, [name, value]) => {
                const readAccess = this.accessList.find(
                    (access) => access.key === key && access.name === name && access.action === 'read',
                );
                const writeAccess = this.accessList.find(
                    (access) => access.key === key && access.name === name && access.action === 'write',
                );
                const isRead = this.isIncludes(readAccess, value);
                const isWrite = this.isIncludes(writeAccess, value);
                return { read: acc.read && isRead, write: acc.write && isWrite };
            },
            { read: true, write: true },
        );

        return hasAccess;
    }
}
