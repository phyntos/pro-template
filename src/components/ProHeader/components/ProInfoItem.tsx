import { QuestionCircleOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import Popover from 'antd/es/popover';
import React from 'react';

export type InfoItem<T = string> = {
    key?: T;
    label?: string;
    value?: React.ReactNode;
    hidden?: boolean;
    danger?: boolean;
    children?: InfoItem<T>[];
};

const ProInfoItem = ({ item, direction = 'vertical' }: { item: InfoItem; direction?: 'horizontal' | 'vertical' }) => {
    if (item.hidden) return null;
    const childInfo =
        item.children && item.children.length && item.children.some((child) => !child.hidden) ? (
            <Popover
                content={
                    <Space size={16}>
                        {item.children.map((childItem) => (
                            <ProInfoItem key={childItem.key} item={childItem} />
                        ))}
                    </Space>
                }
                trigger='click'
                placement='bottom'
            >
                <QuestionCircleOutlined className='pro-header-info-child' />
            </Popover>
        ) : null;

    if (direction === 'horizontal')
        return (
            <Space
                key={item.key}
                size={5}
                direction='horizontal'
                className={'pro-header-info' + (item.danger ? ' pro-header-info-danger' : '')}
                align='center'
            >
                <div className='pro-header-info-label'>{`${item.label}: `}</div>
                <div className='pro-header-info-value'>
                    {item.value} {childInfo}
                </div>
            </Space>
        );
    return (
        <Space
            key={item.key}
            size={0}
            direction='vertical'
            className={'pro-header-info' + (item.danger ? ' pro-header-info-danger' : '')}
            align='start'
        >
            <div className='pro-header-info-label'>{item.label}</div>
            <div className='pro-header-info-value'>
                {item.value} {childInfo}
            </div>
        </Space>
    );
};

export default ProInfoItem;
