import { BulbFilled, BulbOutlined } from '@ant-design/icons';
import { ConfigProvider, theme as antTheme } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import './ProThemeChanger.scss';

export type AntTheme = 'dark' | 'light';

const ProThemeContext = React.createContext<{
    theme: AntTheme;
    setTheme: React.Dispatch<React.SetStateAction<AntTheme>>;
}>({
    theme: 'light',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setTheme: () => {},
});

export const ProThemeProvider = ({
    children,
    storage = true,
    defaultTheme,
}: {
    children?: React.ReactNode;
    storage?: boolean;
    defaultTheme?: AntTheme;
}) => {
    const localTheme =
        (storage ? (localStorage.getItem('pro-theme') as AntTheme | undefined) ?? defaultTheme : defaultTheme) ??
        'light';

    const [theme, setTheme] = useState<AntTheme>(localTheme);

    useEffect(() => {
        if (storage) {
            localStorage.setItem('pro-theme', theme);
        }
    }, [theme, storage]);

    useEffect(() => {
        const element = document.body;
        if (theme === 'dark') element.classList.add('dark-mode');
        else element.classList.remove('dark-mode');
    }, [theme]);

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

export type ProThemeChangerProps = {
    darkIcon?: typeof BulbFilled;
    lightIcon?: typeof BulbFilled;
    hidden?: boolean;
    customRender?: (theme: AntTheme, setTheme: React.Dispatch<React.SetStateAction<AntTheme>>) => React.ReactNode;
};

const ProThemeChanger = ({
    darkIcon = BulbFilled,
    lightIcon = BulbOutlined,
    customRender,
    hidden,
}: ProThemeChangerProps) => {
    const [theme, setTheme] = useProTheme();

    if (hidden) return null;

    if (customRender) return <>{customRender(theme, setTheme)}</>;

    return React.createElement(theme === 'dark' ? darkIcon : lightIcon, {
        className: 'icon-button',
        onClick: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    });
};

export default ProThemeChanger;
