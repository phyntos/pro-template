import ruRU from 'antd/locale/ru_RU';
import React from 'react';
import { legacyLogicalPropertiesTransformer, StyleProvider } from '@ant-design/cssinjs';
import { ConfigProvider, Empty } from 'antd';
import { ProLocaleProvider, ProThemeProvider } from '../pro-template';

const ProAntProvider = ({
    children,
    primaryColor,
    prefix,
    storageTheme,
}: {
    children: React.ReactNode;
    primaryColor?: string;
    prefix?: string;
    storageTheme?: boolean;
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
                    <ProThemeProvider storage={storageTheme}>{children}</ProThemeProvider>
                </ProLocaleProvider>
            </ConfigProvider>
        </StyleProvider>
    );
};

export default ProAntProvider;
