import { groupByArray } from '../../functions';

export type AccessItem<
    Key extends string,
    Item extends Record<Name, Value>,
    Name extends KeyOf<Item> = KeyOf<Item>,
    Value extends Item[Name] = Item[Name],
> = {
    key: Key;
    name: Name;
    action: AccessActionType;
    type: AccessListType;
    values: Value[];
    group?: string;
};

type KeyOf<T> = Extract<keyof T, string>;

type AccessActionType = 'read' | 'write';
type AccessListType = 'white' | 'black';

export const useProAccess = <
    KeyList extends string[],
    Item extends Record<Name, Value>,
    Name extends Extract<KeyOf<Item>, string> = Extract<KeyOf<Item>, string>,
    Value extends Item[Name] = Item[Name],
>(
    item: Partial<Item>,
    keys: KeyList,
    falseAccess: (item: Partial<Item>) => boolean,
    trueAccess: (item: Partial<Item>) => boolean,
    accessControl: ProAccessControl<KeyList[number], Item, Name, Value>,
) => {
    type AccessReturnType = Record<`read${KeyList[number]}` | `write${KeyList[number]}`, boolean>;

    return keys.reduce<AccessReturnType>((access, key) => {
        if (falseAccess(item))
            return {
                ...access,
                [`read${key}`]: false,
                [`write${key}`]: false,
            };

        if (trueAccess(item))
            return {
                ...access,
                [`read${key}`]: true,
                [`write${key}`]: true,
            };

        const { write, read } = accessControl.hasAccess(key, item);

        return {
            ...access,
            [`read${key}`]: read,
            [`write${key}`]: write,
        };
    }, {} as AccessReturnType);
};

export default class ProAccessControl<
    Key extends string,
    Item extends Record<Name, Value>,
    Name extends Extract<KeyOf<Item>, string> = Extract<KeyOf<Item>, string>,
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
        action: AccessActionType,
        type: AccessListType,
        values: Item[ControlName][],
        group?: string,
    ) {
        this.accessList = this.accessList.filter(
            (access) =>
                access.key !== key || access.name !== name || access.action !== action || access.group !== group,
        );
        this.accessList.push({
            key,
            values,
            name,
            action,
            type,
            group,
        });
        // localStorage.setItem(
        //     [this.moduleName, key, name, action, type, group].filter(Boolean).join('_'),
        //     JSON.stringify(values),
        // );
    }

    private isIncludes = (
        access: Pick<AccessItem<Key, Item, Name, Item[Name]>, 'values' | 'type'> | undefined,
        value: Item[Name],
    ) => {
        if (!access) return true;
        if (!value) return false;
        const isIncludes = access.values.includes(value);
        return access.type === 'white' ? isIncludes : !isIncludes;
    };

    hasAccess(key: Key, data: Partial<Item>): { read: boolean; write: boolean } {
        const dataList = Object.entries(data) as [Name, Value][];

        // localStorage.setItem(this.moduleName + '_data', JSON.stringify(data));
        const groups = groupByArray(
            this.accessList.filter((x) => x.key === key),
            'group',
        );

        const hasAccess = groups.reduce(
            (groupAcc, groupItem) => {
                const dataAccess = dataList.reduce(
                    (acc, [name, value]) => {
                        const readAccess = groupItem.find(
                            (access) => access.key === key && access.name === name && access.action === 'read',
                        );
                        const writeAccess = groupItem.find(
                            (access) => access.key === key && access.name === name && access.action === 'write',
                        );
                        const isRead = this.isIncludes(readAccess, value);
                        const isWrite = this.isIncludes(writeAccess, value);

                        return { read: acc.read && isRead, write: acc.write && isWrite };
                    },
                    { read: true, write: true },
                );
                return { read: groupAcc.read || dataAccess.read, write: groupAcc.write || dataAccess.write };
            },
            { read: false, write: false },
        );

        return { read: hasAccess.read, write: hasAccess.write };
    }
}
