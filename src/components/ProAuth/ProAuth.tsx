import { ProForm } from '@ant-design/pro-components';
import { ConfigProvider, theme } from 'antd';
import React from 'react';
import { ProFormCard } from '../../pro-template';
import ProTools, { ProToolsProps } from '../ProContainer/components/ProTools';
import { ProFormCardField } from '../ProFormCard/ProFormCard';
import './ProAuth.scss';

const ProAuth = <
    AuthVM extends Record<string, any>,
    LangLabels extends Record<string, string | undefined> = Record<string, string | undefined>,
>({
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
    width = 350,
    tools,
}: {
    onSubmit: (fields: AuthVM) => Promise<any>;
    className?: string;
    header?: React.ReactNode;
    fields?: ProFormCardField<AuthVM>[];
    submitter: (onSubmit: () => Promise<void>) => React.ReactNode;
    render?: (dom: { header: React.ReactNode; fields: React.ReactNode; submitter: React.ReactNode }) => React.ReactNode;
    width?: number;
    tools?: Omit<ProToolsProps<string, LangLabels>, 'user' | 'logout'>;
}) => {
    const [form] = ProForm.useForm<AuthVM>();
    const classNames = ['pro-auth-container'];
    if (className) classNames.push(className);

    const { token } = theme.useToken();

    const onSubmitClick = async () => {
        const fields = await form.validateFields();
        await onSubmit(fields);
    };

    return (
        <ConfigProvider prefixCls='pro-auth'>
            <div className={classNames.join(' ')} style={{ backgroundColor: token.colorBgLayout }}>
                <ProForm
                    form={form}
                    className='pro-auth-form'
                    style={{ backgroundColor: token.colorBgContainer, width: 'min(' + width + 'px, 100vw - 20px)' }}
                    submitter={false}
                >
                    {render({
                        header: (
                            <div className='pro-auth-header'>
                                {header}
                                <div style={{ position: 'absolute', top: 0, right: 0 }}>
                                    <ProTools {...tools} />
                                </div>
                            </div>
                        ),
                        fields: <ProFormCard.FieldRow span={24} hideSubmitter fields={fields} />,
                        submitter: <div className='pro-auth-submitter'>{submitter(onSubmitClick)}</div>,
                    })}
                </ProForm>
            </div>
        </ConfigProvider>
    );
};

export default ProAuth;
