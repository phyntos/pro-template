import { ToolOutlined } from '@ant-design/icons';
import React, { useContext, useEffect, useState } from 'react';
import { ProContainer, ProAuth, ProButton } from '../pro-template';
import DevItem from './DevItem';
import DevLogo from './DevLogo';
import './DevTemplate.scss';
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
    const [loggedIn, setLoggedIn] = useState(false);
    const [role, setRole] = useState<DevAppRole>('contact');
    const [type, setType] = useState<DevAppType>('dev');

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
                        name: 'login',
                        label: 'Email',
                        rules: [{ required: true, message: 'Введите почту' }],
                    },
                    {
                        type: 'password',
                        name: 'password',
                        label: 'Пароль',
                        rules: [{ required: true, message: 'Введите пароль' }],
                    },
                ]}
                submitter={(onSubmit) => (
                    <ProButton prefixCls='login-button' primaryColor='#EF2920' onAsyncClick={onSubmit}>
                        Войти
                    </ProButton>
                )}
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
            />
        );

    return (
        <DevTemplateContext.Provider value={{ role, type, setRole, setType }}>
            <ProContainer
                defaultKey='dev'
                menuItems={[
                    {
                        key: 'dev',
                        label: 'DEV',
                        roles: ['root'],
                        path: '/dev',
                        element: <DevItem />,
                        icon: <ToolOutlined />,
                    },
                ]}
                userData={{
                    role: 'root',
                    roleNames: {
                        root: 'ROOT',
                    },
                    fullName: 'ROOT NAME',
                }}
                logo={(size) => <DevLogo size={size} />}
                onLogout={() => setLoggedIn(false)}
                profileKey='dev'
                // transparentContent
                extraHeader={'asd'}
            />
        </DevTemplateContext.Provider>
    );
};

export default DevTemplate;
