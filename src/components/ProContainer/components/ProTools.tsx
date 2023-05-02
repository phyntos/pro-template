import { LogoutOutlined } from '@ant-design/icons';
import { Space, Tooltip, theme } from 'antd';
import React from 'react';
import ProLocaleChanger, { ProLocaleChangerProps } from '../../ProLocaleChanger/ProLocaleChanger';
import ProThemeChanger, { ProThemeChangerProps } from '../../ProThemeChanger/ProThemeChanger';
import { useNavigate } from 'react-router-dom';
import { UserData } from '../ProContainer';

export type ProToolsProps<Roles extends string, LangLabels extends Record<string, string | undefined>> = {
    logout?: {
        onLogout: () => void;
        logoutText?: string;
    };
    user?: {
        userData: UserData<Roles>;
        profilePath?: string;
    };
    extraHeader?: React.ReactNode;
    localeChanger?: ProLocaleChangerProps<LangLabels>;
    themeChanger?: true | ProThemeChangerProps;
    gap?: number;
    render?: (dom: {
        extraHeader: React.ReactNode;
        themeChanger: React.ReactNode;
        localeChanger: React.ReactNode;
        userData: React.ReactNode;
        onLogout: React.ReactNode;
    }) => React.ReactNode;
};

const ProTools = <Roles extends string, LangLabels extends Record<string, string | undefined>>({
    logout,
    user,
    extraHeader,
    themeChanger,
    localeChanger,
    gap = 16,
    render = ({ extraHeader, localeChanger, onLogout, themeChanger, userData }) => (
        <>
            {extraHeader}
            {themeChanger}
            {localeChanger}
            {userData}
            {onLogout}
        </>
    ),
}: ProToolsProps<Roles, LangLabels>) => {
    const navigate = useNavigate();
    const { token } = theme.useToken();

    return (
        <Space size={gap} style={{ color: token.colorText }}>
            {render({
                extraHeader,
                localeChanger: localeChanger && <ProLocaleChanger {...localeChanger} />,
                onLogout: logout && (
                    <Tooltip title={logout.logoutText || 'Logout'} placement='bottomRight'>
                        <LogoutOutlined className='icon-button' onClick={logout.onLogout} />
                    </Tooltip>
                ),
                themeChanger: themeChanger && <ProThemeChanger {...(themeChanger === true ? {} : themeChanger)} />,
                userData: user && (
                    <div
                        className={
                            user.profilePath
                                ? 'pro-container-header-user pro-container-header-profile'
                                : 'pro-container-header-user'
                        }
                        onClick={() => {
                            if (user.profilePath) navigate(user.profilePath);
                        }}
                    >
                        {user.userData.fullName}
                        <span className='pro-container-user-role' style={{ color: token.colorTextDescription }}>
                            {user.userData.role ? user.userData.roleNames[user.userData.role] : null}
                        </span>
                    </div>
                ),
            })}
        </Space>
    );
};

export default ProTools;
