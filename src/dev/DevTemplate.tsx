import { ToolOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { ProContainer, ProLogin } from '../pro-template';
import DevItem from './DevItem';
import DevLogo from './DevLogo';
import './DevTemplate.scss';

const DevTemplate = () => {
    const [loggedIn, setLoggedIn] = useState(true);

    if (!loggedIn)
        return <ProLogin onLogin={async () => setLoggedIn(true)} logo={<DevLogo size='big' withDescription />} />;

    return (
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
    );
};

export default DevTemplate;
