import { ProForm, ProFormText } from '@ant-design/pro-components';
import { ConfigProvider } from 'antd';
import React from 'react';
import ProButton from '../ProButton/ProButton';
import './ProLogin.scss';

const ProLogin = <LoginVM extends { login: string; password: string }>({
    onLogin,
    logo,
    className,
}: {
    onLogin: (fields: LoginVM) => Promise<any>;
    className?: string;
    logo?: React.ReactNode;
}) => {
    const [form] = ProForm.useForm<LoginVM>();
    const classNames = ['pro-login-container'];
    if (className) classNames.push(className);

    const onLoginSubmit = async () => {
        const fields = await form.validateFields();
        await onLogin(fields);
    };

    return (
        <ConfigProvider prefixCls='pro-login'>
            <div className={classNames.join(' ')}>
                <ProForm form={form} className='pro-login-form' submitter={false}>
                    <div className='pro-login-logo'>{logo}</div>
                    <ProFormText
                        name='login'
                        label='Email'
                        rules={[{ required: true, message: 'Пожалуйства введите Email' }]}
                    />
                    <ProFormText.Password
                        name='password'
                        label='Пароль'
                        rules={[{ required: true, message: 'Пожалуйства введите пароль' }]}
                    />
                    <ProButton htmlType='submit' onAsyncClick={onLoginSubmit}>
                        Войти
                    </ProButton>
                </ProForm>
            </div>
        </ConfigProvider>
    );
};

export default ProLogin;
