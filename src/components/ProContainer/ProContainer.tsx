import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { FormInstance } from '@ant-design/pro-components';
import { ConfigProvider, Layout, Menu, Space, theme } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { ProFormCardActions } from '../ProFormCard/ProFormCard';
import { ProLogoSize } from '../ProLogo/ProLogo';
import './ProContainer.scss';
import ProTools, { ProToolsProps } from './components/ProTools';
import useProRoutes, { ProRoutesProps } from './components/useProRoutes';

const { Header, Sider, Content } = Layout;

export const ProContainerContext = React.createContext<{
    title: string;
    setTitle: (title: string) => void;
    transparent: boolean;
    setTransparent: (title: boolean) => void;
    loading: boolean;
    setLoading: (title: boolean) => void;
}>({
    title: '',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setTitle: () => {},
    transparent: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setTransparent: () => {},
    loading: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setLoading: () => {},
});

export const useProContainer = ({
    title = '',
    transparent = false,
    loading = false,
}: {
    title?: string;
    transparent?: boolean;
    loading?: boolean;
}) => {
    const { setTitle, setTransparent, setLoading } = useContext(ProContainerContext);

    useEffect(() => {
        setTitle(title);
        return () => {
            setTitle('');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [title]);

    useEffect(() => {
        setTransparent(transparent);
        return () => {
            setTransparent(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transparent]);

    useEffect(() => {
        setLoading(loading);
        return () => {
            setLoading(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]);
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

export const ProContainerItem = ({
    children,
    className,
    transparent,
}: {
    children?: React.ReactNode;
    className?: string;
    transparent?: boolean;
}) => {
    const { token } = theme.useToken();

    return (
        <div
            style={{ backgroundColor: !transparent ? token.colorBgContainer : undefined, color: token.colorText }}
            className={['pro-container-item', className, transparent && 'pro-container-item-transparent']
                .filter(Boolean)
                .join(' ')}
        >
            {children}
        </div>
    );
};

export type UserData<Roles extends string> = {
    role: Roles | null;
    fullName?: string | null;
    roleNames: Record<Roles, string>;
};

const ProContainer = <
    ItemKey extends string,
    Roles extends string,
    LangLabels extends Record<string, string | undefined>,
>({
    routes,
    logo,
    tools,
    userData,
}: {
    routes?: Omit<ProRoutesProps<ItemKey, Roles>, 'role' | 'loading' | 'transparent' | 'title'>;
    logo?: (size: ProLogoSize) => React.ReactNode;
    tools?: ProToolsProps<Roles, LangLabels>;
    userData: UserData<Roles>;
}) => {
    const [title, setTitle] = useState('');
    const [transparent, setTransparent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [collapsed, setCollapsed] = useState(true);
    const [forms, setForms] = useState<ProFormCardContextType[]>([]);
    const { token } = theme.useToken();
    const [routeComponent, { breadcrumbs, menuItems: mappedItems, profilePath, activeKey }] = useProRoutes({
        role: userData.role,
        loading,
        transparent,
        title,
        ...routes,
        items: routes?.items || [],
    });

    return (
        <ConfigProvider prefixCls='pro-container' iconPrefixCls='pro-container-icon'>
            <ProFormCardContext.Provider value={{ forms, setForms }}>
                <ProContainerContext.Provider
                    value={{ title, setTitle, transparent, setTransparent, loading, setLoading }}
                >
                    <Layout className='pro-container-main-layout'>
                        <Sider theme='dark' trigger={null} collapsible collapsed={collapsed}>
                            <div className='pro-container-logo'>{logo?.(collapsed ? 'mini' : 'normal')}</div>
                            <Menu
                                theme='dark'
                                mode='inline'
                                items={mappedItems}
                                selectedKeys={activeKey ? [activeKey] : []}
                            />
                        </Sider>
                        <Layout>
                            <Header style={{ backgroundColor: token.colorBgContainer }}>
                                <Space size={16} className='pro-container-header-title'>
                                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                        className: 'icon-button pro-container-trigger',
                                        onClick: () => setCollapsed((collapsed) => !collapsed),
                                    })}
                                    {breadcrumbs}
                                </Space>
                                <ProTools user={{ userData, profilePath }} {...tools} />
                            </Header>
                            <Content>{routeComponent}</Content>
                        </Layout>
                    </Layout>
                </ProContainerContext.Provider>
            </ProFormCardContext.Provider>
        </ConfigProvider>
    );
};

ProContainer.Tools = ProTools;
ProContainer.useRoutes = useProRoutes;
ProContainer.Item = ProContainerItem;
ProContainer.useContainer = useProContainer;

export default ProContainer;
