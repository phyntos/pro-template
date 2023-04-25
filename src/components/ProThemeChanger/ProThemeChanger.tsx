import { AlertFilled, AlertOutlined } from '@ant-design/icons';
import { ConfigProvider, theme as antTheme } from 'antd';
import React, { useContext, useState } from 'react';

export type AntTheme = 'dark' | 'light';

const ProThemeContext = React.createContext<{
    theme: AntTheme;
    setTheme: React.Dispatch<React.SetStateAction<AntTheme>>;
}>({
    theme: 'light',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setTheme: () => {},
});

export const ProThemeProvider = ({ children }: { children?: React.ReactNode }) => {
    const [theme, setTheme] = useState<AntTheme>('light');

    return (
        <ProThemeContext.Provider value={{ setTheme, theme }}>
            <ConfigProvider
                theme={{ algorithm: theme === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm }}
            >
                {children}
            </ConfigProvider>
        </ProThemeContext.Provider>
    );
};

export const useProTheme = () => {
    const { setTheme, theme } = useContext(ProThemeContext);

    return [theme, setTheme] as const;
};

const ProThemeChanger = ({
    darkIcon = AlertFilled,
    lightIcon = AlertOutlined,
    customRender,
}: {
    darkIcon?: typeof AlertFilled;
    lightIcon?: typeof AlertFilled;
    customRender?: (theme: AntTheme, setTheme: React.Dispatch<React.SetStateAction<AntTheme>>) => React.ReactNode;
}) => {
    const [theme, setTheme] = useProTheme();

    if (customRender) return <>{customRender(theme, setTheme)}</>;

    return React.createElement(theme === 'dark' ? darkIcon : lightIcon, {
        className: 'icon-button',
        onClick: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    });
};

export default ProThemeChanger;
