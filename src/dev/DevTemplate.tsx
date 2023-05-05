import { ToolOutlined } from '@ant-design/icons';
import React, { useContext, useEffect, useState } from 'react';
import { ProContainer, ProAuth, ProButton } from '../pro-template';
import DevItem from './DevItem';
import DevLogo from './DevLogo';
import './DevTemplate.scss';
import ruRU from 'antd/locale/ru_RU';
import kkKZ from 'antd/locale/kk_KZ';
import { Button } from 'antd';

export type DevAppType = 'dev' | 'prod' | 'local';

declare global {
    interface Window {
        AppType: DevAppType;
        AppRole: DevAppRole;
    }
}

const roles = ['admin', 'contact', 'root'] as const;

export type DevAppRole = (typeof roles)[number];

const DevTemplateContext = React.createContext<{
    type: DevAppType;
    setType: React.Dispatch<React.SetStateAction<DevAppType>>;
    role: DevAppRole;
    setRole: React.Dispatch<React.SetStateAction<DevAppRole>>;
}>({
    type: 'dev',
    setRole: () => {
        return;
    },
    setType: () => {
        return;
    },
    role: 'contact',
});

export const useDevTemplateContext = (context?: { type?: DevAppType; role?: DevAppRole }) => {
    const { setRole, setType, role, type } = useContext(DevTemplateContext);

    useEffect(() => {
        if (context?.role) setRole(context?.role);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context?.role]);

    useEffect(() => {
        if (context?.type) setType(context?.type);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context?.type]);

    return { role, type };
};

const DevTemplate = () => {
    const [loggedIn, setLoggedIn] = useState(true);
    const [role, setRole] = useState<DevAppRole>('contact');
    const [type, setType] = useState<DevAppType>('dev');
    const [lang, setLang] = useState<'kz' | 'ru'>('kz');

    if (!loggedIn)
        return (
            <ProAuth<{ login: DevAppRole; password: string }>
                onSubmit={async ({ login }: { login: DevAppRole; password: string }) => {
                    if (roles.includes(login)) setRole(login);
                    else setRole('contact');
                    setLoggedIn(true);
                }}
                header={<DevLogo size='big' withDescription />}
                fields={[
                    {
                        type: 'text',
                        props: {
                            name: 'login',
                            label: 'Email',
                            rules: [{ required: true, message: 'Введите почту' }],
                        },
                    },
                    {
                        type: 'password',
                        props: {
                            name: 'password',
                            label: 'Пароль',
                            rules: [{ required: true, message: 'Введите пароль' }],
                        },
                    },
                ]}
                submitter={(onSubmit) => (
                    <ProButton prefixCls='login-button' primaryColor='#EF2920' onAsyncClick={onSubmit}>
                        Войти
                    </ProButton>
                )}
                width={500}
                render={({ fields, header, submitter }) => (
                    <>
                        {header}
                        {fields}
                        <div>
                            <Button style={{ float: 'right' }} type='link'>
                                Забыли пароль
                            </Button>
                        </div>
                        {submitter}
                    </>
                )}
                tools={{ themeChanger: true }}
            />
        );

    return (
        <DevTemplateContext.Provider value={{ role, type, setRole, setType }}>
            <ProContainer
                routes={{
                    items: [
                        {
                            key: 'dev',
                            label: 'DEV DEV DEV DEV',
                            roles: ['root'],
                            path: '/dev',
                            element: <DevItem />,
                            icon: <ToolOutlined />,
                        },
                    ],
                    defaultKey: 'dev',
                    profileKey: 'dev',
                }}
                userData={{
                    role: 'root',
                    roleNames: {
                        root: 'ROOT',
                    },
                    fullName: 'ROOT NAME',
                }}
                logo={(size) => <DevLogo size={size} />}
                tools={{
                    logout: {
                        onLogout: () => setLoggedIn(false),
                    },
                    extraHeader: 'asd',
                    localeChanger: {
                        labels: { kz: 'КАЗ', ru: 'РУС' },
                        lang: lang,
                        locales: {
                            kz: kkKZ,
                            ru: ruRU,
                        },
                        onChange: setLang,
                    },
                    themeChanger: true,
                }}
            />
        </DevTemplateContext.Provider>
    );
};

export default DevTemplate;
