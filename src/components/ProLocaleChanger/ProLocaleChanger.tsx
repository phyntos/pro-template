import { DownOutlined } from '@ant-design/icons';
import { ConfigProvider, Dropdown, theme } from 'antd';
import { Locale } from 'antd/es/locale';
import ruRU from 'antd/locale/ru_RU';
import React, { useContext, useEffect, useState } from 'react';

const ProLocaleContext = React.createContext<{
    locale: Locale;
    setLocale: React.Dispatch<React.SetStateAction<Locale>>;
}>({
    locale: ruRU,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setLocale: () => {},
});

export const ProLocaleProvider = ({ children }: { children?: React.ReactNode }) => {
    const [locale, setLocale] = useState<Locale>(ruRU);

    return (
        <ProLocaleContext.Provider value={{ setLocale, locale }}>
            <ConfigProvider locale={locale}>{children}</ConfigProvider>
        </ProLocaleContext.Provider>
    );
};

export const useProLocale = () => {
    const { setLocale, locale } = useContext(ProLocaleContext);

    return [locale, setLocale] as const;
};

export type ProLocaleChangerProps<LangLabels extends Record<string, string | undefined>> = {
    onChange: (value: keyof LangLabels) => void;
    lang: keyof LangLabels;
    labels: LangLabels;
    locales: Record<keyof LangLabels, Locale>;
};

const ProLocaleChanger = <LangLabels extends Record<string, string | undefined>>({
    onChange,
    labels,
    lang,
    locales,
}: ProLocaleChangerProps<LangLabels>) => {
    const [, setLocale] = useProLocale();
    const { token } = theme.useToken();

    useEffect(() => {
        setLocale(locales[lang]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lang, locales]);

    const options = Object.entries(labels).filter(([, value]) => !!value);

    return (
        <Dropdown
            menu={{
                items: options.map(([lang, label]) => {
                    return {
                        key: lang,
                        label,
                    };
                }),
                onClick: (info) => {
                    onChange(info.key as keyof LangLabels);
                },
            }}
            placement='bottomRight'
            trigger={['click']}
        >
            <div
                style={{
                    display: 'flex',
                    gap: 3,
                    cursor: 'pointer',
                    fontWeight: '700',
                    color: token.colorText,
                }}
            >
                {labels[lang]}
                <DownOutlined />
            </div>
        </Dropdown>
    );
};

export default ProLocaleChanger;
