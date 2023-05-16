import { theme } from 'antd';
import React from 'react';

const ProContainerItem = ({
    children,
    className,
    transparent,
}: {
    children?: React.ReactNode;
    className?: string;
    transparent?: boolean;
}) => {
    const { token } = theme.useToken();

    return (
        <div
            style={{
                backgroundColor: !transparent ? token.colorBgContainer : undefined,
                color: token.colorText,
                border: !transparent ? '1px solid ' + token.colorBorderSecondary : undefined,
            }}
            className={['pro-container-item', className, transparent && 'pro-container-item-transparent']
                .filter(Boolean)
                .join(' ')}
        >
            {children}
        </div>
    );
};

export default ProContainerItem;
