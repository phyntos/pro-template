import ruRU from 'antd/locale/ru_RU';
import React from 'react';
import { legacyLogicalPropertiesTransformer, StyleProvider } from '@ant-design/cssinjs';
import { ConfigProvider, Empty } from 'antd';

const ProAntProvider = ({
    children,
    primaryColor,
    prefix,
}: {
    children: React.ReactNode;
    primaryColor?: string;
    prefix?: string;
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
                {children}
            </ConfigProvider>
        </StyleProvider>
    );
};

export default ProAntProvider;
