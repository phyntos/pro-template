import { ArrowLeftOutlined, DownOutlined, QuestionCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { ModalForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Button, Col, ColProps, ConfigProvider, Dropdown, Form, Row, Space, Typography } from 'antd';
import Popover from 'antd/es/popover';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { numberNormalize } from '../../functions';
import ProButton from '../ProButton/ProButton';
import { ProContainerItem } from '../ProContainer/ProContainer';
import './ProHeader.scss';

export type InfoItem<T = string> = {
    key?: T;
    label?: string;
    value?: React.ReactNode;
    hidden?: boolean;
    danger?: boolean;
    children?: InfoItem<T>[];
};

type ModalTableData = {
    id: string | null;
    firstName: string | null;
    lastName: string | null;
    middleName: string | null;
    phoneNumber: string | null;
    fullName: string | null;
    email: string | null;
};

export type ModalField = {
    id?: number;
    required?: boolean;
    model?: string;
    name: string;
    type: 'textarea' | 'table' | 'input' | 'number';
    label: string;
    placeHolder?: string;
    read?: boolean;
    data?: null | ModalTableData[];
    tableName?: string;
    columns?: any[];
    multipleResult?: boolean;
};

export type HeaderDropdownItem = {
    key: string;
    label: React.ReactNode;
    onClick?: (fields?: Record<string, any>) => any;
    modalFields?: ModalField[];
};

export const ProActionsDropdown = ({ items, icon }: { items: HeaderDropdownItem[]; icon?: React.ReactNode }) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [actionKey, setActionKey] = useState<string>('');
    const [modalForm] = Form.useForm();

    const onDropdownClick = async (action: HeaderDropdownItem) => {
        try {
            if (action.modalFields?.length) {
                setOpen(true);
                setActionKey(action.key);
                return;
            }
            setLoading(true);
            await action.onClick?.();
        } finally {
            setLoading(false);
        }
    };

    const action = items.find((item) => item.key === actionKey);

    return (
        <>
            {items.length > 1 && (
                <Dropdown
                    placement='bottomRight'
                    disabled={loading}
                    trigger={['click']}
                    menu={{
                        items: items.map((action) => ({
                            ...action,
                            key: action.key,
                            onClick: async () => {
                                await onDropdownClick(action);
                            },
                        })),
                    }}
                >
                    <Button type='primary'>
                        <Space>
                            Действия
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown>
            )}
            {items.length === 1 && (
                <ProButton type='primary' onAsyncClick={() => onDropdownClick(items[0])} icon={icon}>
                    {items[0].label}
                </ProButton>
            )}
            <ModalForm
                onFinish={async (fields) => {
                    await action?.onClick?.(fields);
                    return true;
                }}
                open={open}
                onOpenChange={setOpen}
                form={modalForm}
                submitter={{ searchConfig: { submitText: action?.label } }}
            >
                {action?.modalFields?.map((field) => {
                    switch (field.type) {
                        case 'textarea':
                            return (
                                <ProFormTextArea
                                    label={field.label}
                                    placeholder={field.placeHolder || undefined}
                                    name={field.name}
                                    key={field.id}
                                    rules={field.required ? [{ required: true }] : undefined}
                                />
                            );
                        case 'input':
                            return (
                                <ProFormText
                                    label={field.label}
                                    placeholder={field.placeHolder || undefined}
                                    name={field.name}
                                    key={field.id}
                                    rules={field.required ? [{ required: true }] : undefined}
                                />
                            );
                        case 'number':
                            return (
                                <ProFormText
                                    normalize={numberNormalize({ isPositive: true, fractionDigits: 2 })}
                                    label={field.label}
                                    placeholder={field.placeHolder || undefined}
                                    name={field.name}
                                    key={field.id}
                                    rules={field.required ? [{ required: true }] : undefined}
                                />
                            );
                        case 'table':
                            return (
                                <ProFormSelect
                                    label={field.label}
                                    placeholder={field.placeHolder || undefined}
                                    name={field.name}
                                    key={field.id}
                                    rules={field.required ? [{ required: true }] : undefined}
                                    options={field.data?.map((item) => {
                                        let label = item.fullName;
                                        if (item.email) label += ' - ' + item.email;
                                        if (item.phoneNumber) label += ' - ' + item.phoneNumber;
                                        return {
                                            label,
                                            value: item.id,
                                        };
                                    })}
                                    showSearch
                                />
                            );
                        default:
                            return null;
                    }
                })}
            </ModalForm>
        </>
    );
};

export const InfoItem = ({
    item,
    direction = 'vertical',
}: {
    item: InfoItem;
    direction?: 'horizontal' | 'vertical';
}) => {
    if (item.hidden) return null;
    const childInfo =
        item.children && item.children.length ? (
            <Popover
                content={
                    <Space size={16}>
                        {item.children.map((childItem) => (
                            <InfoItem key={childItem.key} item={childItem} />
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

type ProHeaderProps = {
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
    actionItems?: HeaderDropdownItem[];
    onReload?: () => void;
};

const ProHeader = ({
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
    transparent,
}: ProHeaderProps) => {
    const navigate = useNavigate();

    return (
        <ConfigProvider prefixCls='pro-header'>
            <ProContainerItem className='pro-header' transparent={transparent}>
                <Row align='middle' justify='space-between' wrap={false}>
                    <Col {...titleColProps}>
                        <Space size={16}>
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
                            {infos && infoDirection === 'horizontal' && infos.length > 0 && (
                                <Space wrap size={[5, 0]} align='center'>
                                    {infos.map((item) => (
                                        <InfoItem key={item.key} item={item} direction='horizontal' />
                                    ))}
                                </Space>
                            )}
                            {infoDirection === 'vertical' &&
                                infos?.map((item) => <InfoItem key={item.key} item={item} direction='vertical' />)}
                            {titleExtraRender}
                        </Space>
                    </Col>
                    {extraCols}
                    <Col {...actionsColProps}>
                        <Space className='pro-header-actions-space'>
                            {onReload && <Button icon={<ReloadOutlined />} onClick={onReload} />}
                            {actions}
                            {actionItems && <ProActionsDropdown items={actionItems} />}
                        </Space>
                    </Col>
                </Row>
            </ProContainerItem>
        </ConfigProvider>
    );
};

export default ProHeader;
