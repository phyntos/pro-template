import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { FormInstance } from '@ant-design/pro-components';
import { Breadcrumb, ConfigProvider, Layout, Menu, Space, Tooltip } from 'antd';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import React, { useContext, useEffect, useState } from 'react';
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ProFormCardActions } from '../ProFormCard/ProFormCard';
import { ProLogoSize } from '../ProLogo/ProLogo';
import './ProContainer.scss';

const { Header, Sider, Content } = Layout;

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

type ProContainerMenuItem<ItemKey extends string, Roles extends string> =
    | ProContainerMenuItemWithPath<ItemKey, Roles>
    | ProContainerMenuItemWithChildren<ItemKey, Roles>;

export const ProContainerContext = React.createContext<{ title: string; setTitle: (title: string) => void }>({
    title: '',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setTitle: () => {},
});

export const useProContainerTitle = (title: string) => {
    const { setTitle } = useContext(ProContainerContext);

    useEffect(() => {
        setTitle(title);
        return () => {
            setTitle('');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [title]);
};

type ProFormCardContextType = { id: string; form: FormInstance<any>; actions: ProFormCardActions<any> };

export const ProFormCardContext = React.createContext<{
    forms: ProFormCardContextType[];
    setForms: React.Dispatch<React.SetStateAction<ProFormCardContextType[]>>;
}>({
    forms: [],
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setForms: () => {},
});

export const useSetProFormCardInstance = <T extends Record<string, any>>(
    id: string,
    form: FormInstance<T>,
    actions: ProFormCardActions<T>,
) => {
    const { setForms } = useContext(ProFormCardContext);

    useEffect(() => {
        setForms((x) => [...x, { form, actions, id }]);
        return () => {
            setForms((x) => x.filter((y) => y.id !== id));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form, actions]);
};

export const useProFormCardInstance = <T extends Record<string, any>>(id: string) => {
    const { forms } = useContext(ProFormCardContext);

    const findForm = forms.find((x) => x.id === id);

    return [findForm?.form, findForm?.actions] as [FormInstance<T>, ProFormCardActions<T>];
};

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
    key: ItemKey,
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
        if (key.includes(item.key)) return item;
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

const ProContainer = <ItemKey extends string, Roles extends string>({
    menuItems,
    onLogout,
    defaultKey,
    specialDefaultKeys,
    profileKey,
    logo,
    userData,
    transparentContent,
}: {
    menuItems: ProContainerMenuItem<ItemKey, Roles>[];
    onLogout?: () => void;
    defaultKey: ItemKey;
    specialDefaultKeys?: Partial<Record<Roles, ItemKey>>;
    profileKey?: ItemKey;
    logo?: (size: ProLogoSize) => React.ReactNode;
    userData: {
        role: Roles | null;
        fullName?: string | null;
        roleNames: Record<Roles, string>;
    };
    transparentContent?: boolean;
}) => {
    const [activeKey, setActiveKey] = useState<ItemKey>(defaultKey);
    const [title, setTitle] = useState('');
    const [forms, setForms] = useState<ProFormCardContextType[]>([]);
    const location = useLocation();
    const navigate = useNavigate();

    const items = filterMenuItems(menuItems, userData.role);

    const getPath = (key?: string) => {
        if (!key) return null;
        const find = getMenuItem(items, key);
        if (!find) return null;
        return find;
    };

    useEffect(() => {
        const find = getMenuItemByString(items, location.pathname);
        if (find) setActiveKey(find.key);
        else setActiveKey(defaultKey);
    }, [location.pathname, items, userData.role, defaultKey]);

    const [collapsed, setCollapsed] = useState(true);

    const specialDefaultKey = userData.role ? specialDefaultKeys?.[userData.role] : undefined;

    const defaultPath = getPath(specialDefaultKey || defaultKey)?.path;
    const profilePath = getPath(profileKey)?.path;
    const activeItemParents = getMenuItemWithParents(items, activeKey);

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

    return (
        <ConfigProvider prefixCls='pro-container' iconPrefixCls='pro-container-icon'>
            <ProFormCardContext.Provider value={{ forms, setForms }}>
                <ProContainerContext.Provider value={{ title, setTitle }}>
                    <Layout className='pro-container-main-layout'>
                        <Sider trigger={null} collapsible collapsed={collapsed}>
                            <div className='pro-container-logo'>{logo?.(collapsed ? 'mini' : 'normal')}</div>
                            <Menu
                                theme='dark'
                                mode='inline'
                                items={items.map(menuItemMap)}
                                selectedKeys={[activeKey]}
                            />
                        </Sider>
                        <Layout>
                            <Header>
                                <Space size={16}>
                                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                        className: 'icon-button pro-container-trigger',
                                        onClick: () => setCollapsed((collapsed) => !collapsed),
                                    })}
                                    <Breadcrumb>
                                        {activeItemParents.length
                                            ? activeItemParents.map((item, index) => (
                                                  <Breadcrumb.Item key={item.key}>
                                                      {(title || index !== activeItemParents.length - 1) &&
                                                      item.path ? (
                                                          <Link to={item.path}>{item.label}</Link>
                                                      ) : (
                                                          item.label
                                                      )}
                                                  </Breadcrumb.Item>
                                              ))
                                            : null}
                                        {title ? <Breadcrumb.Item>{title}</Breadcrumb.Item> : null}
                                    </Breadcrumb>
                                </Space>
                                <Space size={16}>
                                    {userData.fullName && (
                                        <div
                                            className={
                                                profilePath
                                                    ? 'pro-container-header-user pro-container-header-profile'
                                                    : 'pro-container-header-user'
                                            }
                                            onClick={() => {
                                                if (profilePath) navigate(profilePath);
                                            }}
                                        >
                                            {userData.fullName}
                                            <span className='pro-container-user-role'>
                                                {userData.role ? userData.roleNames[userData.role] : null}
                                            </span>
                                        </div>
                                    )}
                                    {onLogout && (
                                        <Tooltip title='Выйти'>
                                            <LogoutOutlined className='icon-button' onClick={onLogout} />
                                        </Tooltip>
                                    )}
                                </Space>
                            </Header>
                            <Content className={transparentContent ? 'pro-container-transparent-content' : undefined}>
                                <Routes>
                                    {items.map((item) => {
                                        if (item.children) {
                                            return (
                                                <>
                                                    {item.children.map((childItem) => (
                                                        <Route
                                                            key={childItem.key}
                                                            path={childItem.path}
                                                            element={childItem.element}
                                                        />
                                                    ))}
                                                </>
                                            );
                                        }
                                        return <Route key={item.key} path={item.path} element={item.element} />;
                                    })}
                                    {defaultPath && <Route path='*' element={<Navigate to={defaultPath} />} />}
                                </Routes>
                            </Content>
                        </Layout>
                    </Layout>
                </ProContainerContext.Provider>
            </ProFormCardContext.Provider>
        </ConfigProvider>
    );
};

export default ProContainer;
