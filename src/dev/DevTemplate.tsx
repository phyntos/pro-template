import { ToolOutlined } from '@ant-design/icons';
import React, { useContext, useEffect, useState } from 'react';
import { ProContainer, ProLogin } from '../pro-template';
import DevItem from './DevItem';
import DevLogo from './DevLogo';
import './DevTemplate.scss';

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

    if (!loggedIn)
        return (
            <ProLogin
                onLogin={async ({ login }: { login: DevAppRole; password: string }) => {
                    if (roles.includes(login)) setRole(login);
                    else setRole('contact');
                    setLoggedIn(true);
                }}
                logo={<DevLogo size='big' withDescription />}
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
            />
        </DevTemplateContext.Provider>
    );
};

export default DevTemplate;
