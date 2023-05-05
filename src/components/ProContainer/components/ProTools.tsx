import { LogoutOutlined, MenuOutlined } from '@ant-design/icons';
import { Col, Popover, Row, Space, Tooltip, theme } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProLocaleChanger, { ProLocaleChangerProps } from '../../ProLocaleChanger/ProLocaleChanger';
import ProThemeChanger, { ProThemeChangerProps } from '../../ProThemeChanger/ProThemeChanger';
import { UserData } from '../ProContainer';
import { useWindowSize } from '../../../pro-template';

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
    extraItems?: { label: string; key: string; render: JSX.Element | undefined }[];
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
    extraItems,
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

    const { isMobile } = useWindowSize();

    const userRender = user && (
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
    );

    const logoutRender = logout && (
        <Tooltip title={logout.logoutText || 'Logout'} placement='bottomRight'>
            <LogoutOutlined className='icon-button' onClick={logout.onLogout} />
        </Tooltip>
    );

    const localeRender = localeChanger && <ProLocaleChanger {...localeChanger} />;
    const themeRender = themeChanger && <ProThemeChanger {...(themeChanger === true ? {} : themeChanger)} />;

    const mobileItems = [
        { label: 'Тема', key: 'locale', render: themeRender },
        { label: 'Язык', key: 'locale', render: localeRender },
    ];

    if (extraItems) mobileItems.push(...extraItems);

    if (isMobile)
        return (
            <Popover
                content={
                    <Space
                        size={gap}
                        style={{ color: token.colorText }}
                        direction='vertical'
                        className='pro-tools-mobile'
                    >
                        <Space size={gap} align='start'>
                            {userRender}
                            {logoutRender}
                        </Space>
                        {mobileItems.map((item) => (
                            <Row key={item.key}>
                                <Col flex={1}>{item.label}</Col>
                                <Col>{item.render}</Col>
                            </Row>
                        ))}
                    </Space>
                }
                trigger='click'
                placement='bottomRight'
            >
                <MenuOutlined />
            </Popover>
        );

    return (
        <Space size={gap} style={{ color: token.colorText }}>
            {render({
                extraHeader,
                localeChanger: localeChanger && <ProLocaleChanger {...localeChanger} />,
                onLogout: logoutRender,
                themeChanger: themeChanger && <ProThemeChanger {...(themeChanger === true ? {} : themeChanger)} />,
                userData: userRender,
            })}
        </Space>
    );
};

export default ProTools;
