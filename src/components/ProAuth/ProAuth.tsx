import { ProForm, ProFormText } from '@ant-design/pro-components';
import { ProFormFieldItemProps } from '@ant-design/pro-form/es/typing';
import { ConfigProvider, InputProps, InputRef } from 'antd';
import { PasswordProps } from 'antd/es/input';
import React from 'react';
import { KeyPath } from '../ProFormCard/ProFormCard';
import './ProAuth.scss';

const ProAuth = <AuthVM extends Record<string, any>>({
    onSubmit,
    header,
    className,
    fields,
    submitter,
    render = ({ fields, header, submitter }) => (
        <>
            {header}
            {fields}
            {submitter}
        </>
    ),
}: {
    onSubmit: (fields: AuthVM) => Promise<any>;
    className?: string;
    header?: React.ReactNode;
    fields: (
        | ({ type: 'password'; name: KeyPath<AuthVM> } & Omit<ProFormFieldItemProps<PasswordProps, InputRef>, 'name'>)
        | ({ type: 'text'; name: KeyPath<AuthVM> } & Omit<ProFormFieldItemProps<InputProps, InputRef>, 'name'>)
    )[];
    submitter: (onSubmit: () => Promise<void>) => React.ReactNode;
    render?: (dom: { header: React.ReactNode; fields: React.ReactNode; submitter: React.ReactNode }) => React.ReactNode;
}) => {
    const [form] = ProForm.useForm<AuthVM>();
    const classNames = ['pro-auth-container'];
    if (className) classNames.push(className);

    const onSubmitClick = async () => {
        const fields = await form.validateFields();
        await onSubmit(fields);
    };

    return (
        <ConfigProvider prefixCls='pro-auth'>
            <div className={classNames.join(' ')}>
                <ProForm form={form} className='pro-auth-form' submitter={false}>
                    {render({
                        header: <div className='pro-auth-header'>{header}</div>,
                        fields: fields?.map(({ type, name, ...props }) => {
                            if (type === 'password') {
                                return <ProFormText.Password key={String(name)} name={name} {...props} />;
                            } else {
                                return <ProFormText key={String(name)} name={name} {...props} />;
                            }
                        }),
                        submitter: <div className='pro-auth-submitter'>{submitter(onSubmitClick)}</div>,
                    })}
                </ProForm>
            </div>
        </ConfigProvider>
    );
};

export default ProAuth;
