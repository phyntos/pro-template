import { Breadcrumb, Spin } from 'antd';
import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import React, { useEffect, useState } from 'react';
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import ProContainerItem from './ProContainerItem';

type ProContainerMenuItemWithChildren<ItemKey extends string, Roles extends string> = {
    key: ItemKey;
    label: string;
    path?: undefined;
    element?: undefined;
    roles: Roles[];
    icon?: React.ReactNode;
    children: ProContainerMenuItem<ItemKey, Roles>[];
};

type ProContainerMenuItemWithPath<ItemKey extends string, Roles extends string> = {
    key: ItemKey;
    label: string;
    path: string;
    element: React.ReactNode;
    roles: Roles[];
    icon?: React.ReactNode;
    children?: undefined;
};

export type ProContainerMenuItem<ItemKey extends string, Roles extends string> =
    | ProContainerMenuItemWithPath<ItemKey, Roles>
    | ProContainerMenuItemWithChildren<ItemKey, Roles>;

const getMenuItem = <ItemKey extends string, Roles extends string>(
    items: ProContainerMenuItem<ItemKey, Roles>[],
    key: ItemKey,
): ProContainerMenuItemWithPath<ItemKey, Roles> => {
    for (const item of items) {
        if (item.children) {
            const menuItem = getMenuItem(item.children, key);
            if (menuItem.key) return menuItem;
            else continue;
        }

        if (item.key === key) return item;
    }
    return {} as ProContainerMenuItemWithPath<ItemKey, Roles>;
};

const getMenuItemWithParents = <ItemKey extends string, Roles extends string>(
    items: ProContainerMenuItem<ItemKey, Roles>[],
    key?: ItemKey,
): ProContainerMenuItem<ItemKey, Roles>[] => {
    for (const item of items) {
        if (item.children) {
            const menuItems = getMenuItemWithParents(item.children, key);
            if (menuItems.length > 0) return [item, ...menuItems];
            else continue;
        }

        if (item.key === key) return [item];
    }
    return [];
};

const getMenuItemByString = <ItemKey extends string, Roles extends string>(
    items: ProContainerMenuItem<ItemKey, Roles>[],
    key: string,
): ProContainerMenuItemWithPath<ItemKey, Roles> => {
    for (const item of items) {
        if (item.children) {
            const menuItem = getMenuItemByString(item.children, key);
            if (menuItem.key) return menuItem;
            else continue;
        }

        if (key.split('/').includes(item.key)) return item;
    }
    return {} as ProContainerMenuItemWithPath<ItemKey, Roles>;
};

const filterMenuItems = <ItemKey extends string, Roles extends string>(
    items: ProContainerMenuItem<ItemKey, Roles>[],
    role: Roles | null,
): ProContainerMenuItem<ItemKey, Roles>[] => {
    return items
        .filter((item) => (item.roles.length > 0 && role ? item.roles.includes(role) : true))
        .map((item) => {
            if (!item.children) return item;

            return {
                ...item,
                children: filterMenuItems(item.children, role),
            };
        });
};

export type ProRoutesProps<ItemKey extends string, Roles extends string> = {
    loading?: boolean;
    transparent?: boolean;
    title?: string;
    items: ProContainerMenuItem<ItemKey, Roles>[];
    defaultKey?: ItemKey;
    specialDefaultKeys?: Partial<Record<Roles, ItemKey>>;
    profileKey?: ItemKey;
    role: Roles | null;
};

const useProRoutes = <ItemKey extends string, Roles extends string>({
    loading,
    transparent,
    items,
    defaultKey,
    profileKey,
    specialDefaultKeys,
    title,
    role,
}: ProRoutesProps<ItemKey, Roles>) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeKey, setActiveKey] = useState<ItemKey | undefined>(defaultKey);

    const filteredItems = filterMenuItems(items, role);

    const getPath = (key?: string) => {
        if (!key) return null;
        const find = getMenuItem(filteredItems, key);
        if (!find) return null;
        return find;
    };

    useEffect(() => {
        const find = getMenuItemByString(filteredItems, location.pathname);
        if (find) setActiveKey(find.key);
        else setActiveKey(defaultKey);
    }, [location.pathname, filteredItems, role, defaultKey]);

    const specialDefaultKey = role ? specialDefaultKeys?.[role] : undefined;

    const defaultPath = getPath(specialDefaultKey || defaultKey)?.path;
    const profilePath = getPath(profileKey)?.path;
    const activeItemParents = getMenuItemWithParents(filteredItems, activeKey);

    const menuItemMap = ({ key, label, icon, path, children }: ProContainerMenuItem<ItemKey, Roles>): ItemType => {
        if (!children) {
            return {
                key,
                label,
                icon,
                onClick: () => {
                    navigate(path);
                },
            };
        }

        if (children.length === 1) {
            return menuItemMap(children[0]);
        }

        return {
            key,
            label,
            icon,
            children: children.map(menuItemMap),
        };
    };

    const routes = (
        <Spin spinning={loading} className='pro-container-content-spin'>
            <ProContainerItem className='pro-container-content' transparent={transparent}>
                <Routes>
                    {filteredItems.map((item) => {
                        if (item.children) {
                            return (
                                <React.Fragment key={item.key}>
                                    {item.children.map((childItem) => (
                                        <Route key={childItem.key} path={childItem.path} element={childItem.element} />
                                    ))}
                                </React.Fragment>
                            );
                        }
                        return <Route key={item.key} path={item.path} element={item.element} />;
                    })}
                    {defaultPath && <Route path='*' element={<Navigate to={defaultPath} />} />}
                </Routes>
            </ProContainerItem>
        </Spin>
    );

    const breadcrumbsItems: BreadcrumbItemType[] = activeItemParents.map((item, index) => ({
        title:
            (title || index !== activeItemParents.length - 1) && item.path ? (
                <Link to={item.path}>{item.label}</Link>
            ) : (
                item.label
            ),
        key: item.key,
    }));

    if (title) {
        breadcrumbsItems.push({ title });
    }

    const menuItems = filteredItems.map(menuItemMap);

    return [
        routes,
        {
            breadcrumbs: <Breadcrumb items={breadcrumbsItems} />,
            menuItems,
            profilePath,
            activeKey,
        },
    ] as const;
};

export default useProRoutes;
