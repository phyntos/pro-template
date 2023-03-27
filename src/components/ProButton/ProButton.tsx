import { Button, ButtonProps, ConfigProvider } from 'antd';
import React, { useState } from 'react';

export type ProButtonProps = ButtonProps &
    React.RefAttributes<HTMLElement> & {
        onAsyncClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => Promise<any | void>;
    };

const ProButton: React.FC<ProButtonProps> = ({
    children,
    onClick,
    onAsyncClick,
    type = 'primary',
    size = 'middle',
    style,
    className,
    ...props
}) => {
    const [asyncLoading, setAsyncLoading] = useState(false);

    const asyncClick: React.MouseEventHandler<HTMLElement> = (event) => {
        if (onAsyncClick) {
            setAsyncLoading(true);
            onAsyncClick(event).finally(() => {
                setAsyncLoading(false);
            });
        }
    };

    return (
        <ConfigProvider prefixCls='pro-button'>
            <Button
                {...props}
                className={className}
                style={style}
                type={type}
                loading={asyncLoading}
                size={size}
                onClick={onClick || asyncClick}
            >
                {children}
            </Button>
        </ConfigProvider>
    );
};

export default ProButton;
