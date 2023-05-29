import { ArrowLeftOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Col, ColProps, ConfigProvider, Row, Space, Typography } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import useWindowSize, { useSelectorSize } from '../../hooks/useWindowSize';
import { ProContainerItem } from '../../pro-template';
import './ProHeader.scss';
import ProActionsDropdown, { ProActionsDropdownProps } from './components/ProActionsDropdown';
import ProInfoItem, { InfoItem } from './components/ProInfoItem';

type ProHeaderProps<T extends Record<string, any>> = {
    back?: true | string;
    transparent?: boolean;
    title?: React.ReactNode;
    infos?: InfoItem[];
    infoDirection?: 'vertical' | 'horizontal';
    extraCols?: React.ReactNode;
    actions?: React.ReactNode;
    titleExtraRender?: React.ReactNode;
    titleColProps?: ColProps;
    actionsColProps?: ColProps;
    actionItems?: ProActionsDropdownProps[];
    initialValues?: T;
    onReload?: () => void;
};

const ProHeader = <T extends Record<string, any>>({
    title,
    back,
    infos,
    infoDirection = 'vertical',
    titleExtraRender,
    actions,
    extraCols,
    titleColProps,
    actionsColProps,
    actionItems,
    onReload,
    initialValues,
    transparent,
}: ProHeaderProps<T>) => {
    const navigate = useNavigate();
    let isLimited = false;
    const { isMobile } = useWindowSize();

    const [titleColWidth] = useSelectorSize('.pro-header-title-col');
    const [extraColWidth] = useSelectorSize('.pro-header-extra-col');
    const [actionsColWidth] = useSelectorSize('.pro-header-actions-col');
    const [proHeaderWidth] = useSelectorSize('.pro-header');

    const colWidths = titleColWidth + extraColWidth + actionsColWidth;

    if (proHeaderWidth) {
        isLimited = proHeaderWidth - 20 - colWidths < 0;
    }

    return (
        <ConfigProvider prefixCls='pro-header'>
            <ProContainerItem
                className={'pro-header' + (isLimited ? ' pro-header-limited' : '')}
                transparent={transparent}
            >
                <Row align='middle' gutter={[8, 8]} justify='space-between' wrap>
                    <Col {...titleColProps} className='pro-header-title-col'>
                        <Space size={16} wrap>
                            {(back || title) && (
                                <Space>
                                    {back && (
                                        <Button
                                            type='text'
                                            onClick={() => {
                                                if (typeof back === 'string') {
                                                    navigate(back);
                                                } else {
                                                    navigate(-1);
                                                }
                                            }}
                                            icon={<ArrowLeftOutlined />}
                                        />
                                    )}
                                    {title && (
                                        <Typography.Title level={4} className='pro-header-title'>
                                            {title}
                                        </Typography.Title>
                                    )}
                                </Space>
                            )}
                            {!isMobile && infos && infoDirection === 'horizontal' && infos.length > 0 && (
                                <Space wrap size={[5, 0]} align='center'>
                                    {infos.map((item) => (
                                        <ProInfoItem key={item.key} item={item} direction='horizontal' />
                                    ))}
                                </Space>
                            )}
                            {!isMobile &&
                                infoDirection === 'vertical' &&
                                infos?.map((item) => <ProInfoItem key={item.key} item={item} direction='vertical' />)}
                            {titleExtraRender}
                        </Space>
                    </Col>
                    <Col className='pro-header-extra-col'>
                        <Row align='middle' gutter={[8, 8]} justify='center' wrap>
                            {extraCols}
                        </Row>
                    </Col>
                    <Col {...actionsColProps} className='pro-header-actions-col'>
                        <Space className='pro-header-actions-space'>
                            {onReload && <Button icon={<ReloadOutlined />} onClick={onReload} />}
                            {actions}
                            {actionItems && <ProActionsDropdown items={actionItems} initialValues={initialValues} />}
                        </Space>
                    </Col>
                </Row>
            </ProContainerItem>
        </ConfigProvider>
    );
};

export default ProHeader;
