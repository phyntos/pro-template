import ruRU from 'antd/locale/ru_RU';
import React from 'react';
import { legacyLogicalPropertiesTransformer, StyleProvider } from '@ant-design/cssinjs';
import { ConfigProvider, Empty } from 'antd';
import { ProLocaleProvider, ProThemeProvider } from '../pro-template';
import { AntTheme } from './ProThemeChanger/ProThemeChanger';

const ProAntProvider = ({
    children,
    primaryColor,
    prefix,
    storageTheme,
    defaultTheme,
}: {
    children: React.ReactNode;
    primaryColor?: string;
    prefix?: string;
    storageTheme?: boolean;
    defaultTheme?: AntTheme;
}) => {
    return (
        <StyleProvider hashPriority='high' transformers={[legacyLogicalPropertiesTransformer]}>
            <ConfigProvider
                theme={
                    primaryColor
                        ? {
                              token: {
                                  colorPrimary: primaryColor,
                                  colorInfo: primaryColor,
                              },
                          }
                        : undefined
                }
                locale={ruRU}
                renderEmpty={() => <Empty description='Отсутствуют данные' />}
                prefixCls={prefix}
            >
                <ProLocaleProvider>
                    <ProThemeProvider storage={storageTheme} defaultTheme={defaultTheme}>
                        {children}
                    </ProThemeProvider>
                </ProLocaleProvider>
            </ConfigProvider>
        </StyleProvider>
    );
};

export default ProAntProvider;
