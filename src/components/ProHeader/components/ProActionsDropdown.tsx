import { DownOutlined } from '@ant-design/icons';
import { ModalForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Button, Dropdown, Form, Space } from 'antd';
import React, { useState } from 'react';
import { numberNormalize } from '../../../functions';
import { ProButton } from '../../../pro-template';

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

export type ProActionsDropdownProps = {
    key: string;
    label: React.ReactNode;
    onClick?: (fields?: Record<string, any>) => any;
    modalFields?: ModalField[];
};

const ProActionsDropdown = <T extends Record<string, any>>({
    items,
    icon,
    initialValues,
}: {
    items: ProActionsDropdownProps[];
    icon?: React.ReactNode;
    initialValues?: T;
}) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [actionKey, setActionKey] = useState<string>('');
    const [modalForm] = Form.useForm();

    const onDropdownClick = async (action: ProActionsDropdownProps) => {
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
                initialValues={initialValues}
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

export default ProActionsDropdown;
