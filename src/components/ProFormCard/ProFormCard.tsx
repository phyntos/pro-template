import { RollbackOutlined, SaveOutlined } from '@ant-design/icons';
import {
    FormInstance,
    ProForm,
    ProFormDatePicker,
    ProFormSelect,
    ProFormSelectProps,
    ProFormText,
} from '@ant-design/pro-components';
import { ProFormFieldItemProps } from '@ant-design/pro-form/es/typing';
import { Col, ConfigProvider, DatePickerProps, Row, Space } from 'antd';
import { InputProps, PasswordProps } from 'antd/lib/input';
import { InputRef } from 'antd/lib/input/Input';
import React, { useCallback, useEffect, useMemo } from 'react';
import { deepComparison } from '../../functions';
import ProButton from '../ProButton/ProButton';
import { ProContainerItem, useSetProFormCardInstance } from '../ProContainer/ProContainer';
import './ProFormCard.scss';

export const useProFormCard = <FormVM extends Record<string, any>>({
    id,
    data,
    onUpdate,
}: {
    id: string;
    data?: FormVM | undefined;
    onUpdate?: (data: FormVM) => Promise<void>;
}) => {
    const [form] = ProForm.useForm<FormVM>();

    const setField = useCallback(
        <Key extends Extract<keyof FormVM, string>>(name: Key, value: FormVM[Key] | undefined = undefined) => {
            form.setFieldValue(name, value);
        },
        [form],
    );

    const setForm = useCallback(() => {
        if (data) {
            form.setFieldsValue(data as any);
        }
    }, [form, data]);

    useEffect(() => {
        setForm();
    }, [setForm]);

    const saveForm = useCallback(
        async (validate?: boolean) => {
            const values = validate === true ? await form.validateFields() : form.getFieldsValue();

            const request = Object.assign({}, data, values) as FormVM;
            const isCompared = deepComparison(data, request);

            if (isCompared) return undefined;

            await onUpdate?.(request);
            return request;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [data, form],
    );

    const actions = useMemo(() => ({ setField, saveForm, setForm }), [setForm, saveForm, setField]);

    useSetProFormCardInstance(id, form, actions);

    return [form, actions] as const;
};

export type ProFormCardSelectField<T = any> = {
    type: 'select';
    props: ProFormSelectProps<T>;
};

export type ProFormCardDateTimeField = {
    type: 'date';
    props: ProFormFieldItemProps<DatePickerProps, any>;
};

export type ProFormCardTextField = {
    type: 'text';
    props: ProFormFieldItemProps<InputProps, InputRef>;
};

export type ProFormCardPasswordField = {
    type: 'password';
    props: ProFormFieldItemProps<PasswordProps, InputRef>;
};

export type ProFormCardRenderField = {
    type: 'render';
    render: () => React.ReactNode;
};

export type ProFormCardNullField = {
    type: 'null';
};

type ProFormCardField = (
    | ProFormCardSelectField
    | ProFormCardDateTimeField
    | ProFormCardRenderField
    | ProFormCardNullField
    | ProFormCardTextField
    | ProFormCardPasswordField
) & {
    hidden?: boolean;
};

export type ProFormCardActions<FormVM extends Record<string, any>> = {
    setForm: () => void;
    saveForm: (validate?: boolean) => Promise<FormVM | undefined>;
    setField: <Key extends Extract<keyof FormVM, string>>(name: Key, value?: FormVM[Key] | undefined) => void;
};

const ProFormCard = <FormVM extends Record<string, any>>({
    form,
    actions,
    fields,
    submitter,
    span = 6,
    hidden,
    transparent,
}: {
    form: FormInstance<FormVM>;
    actions: {
        setForm: () => void;
        saveForm: (validate?: boolean) => Promise<FormVM | undefined>;
    };
    fields?: ProFormCardField[];
    submitter?:
        | false
        | {
              hideReset?: boolean;
              saveText?: string;
              resetText?: string;
              saveIcon?: false | React.ReactNode;
              resetIcon?: false | React.ReactNode;
              position?: 'top' | 'bottom';
          };
    span?: 6 | 12 | 3 | 8 | 4 | 1 | 2;
    hidden?: boolean;
    transparent?: boolean;
}) => {
    let childList: React.ReactNode[] = [];

    if (fields?.length) {
        childList = fields
            .filter((x) => !x.hidden)
            .map((field) => {
                switch (field.type) {
                    case 'select':
                        return (
                            <ProFormSelect {...field.props} disabled={submitter === false || field.props.disabled} />
                        );
                    case 'date':
                        return (
                            <ProFormDatePicker
                                {...field.props}
                                disabled={submitter === false || field.props.disabled}
                                fieldProps={{ ...field.props.fieldProps, format: 'DD.MM.YYYY' }}
                            />
                        );
                    case 'text':
                        return <ProFormText {...field.props} disabled={submitter === false || field.props.disabled} />;
                    case 'password':
                        return (
                            <ProFormText.Password
                                {...field.props}
                                disabled={submitter === false || field.props.disabled}
                            />
                        );
                    case 'render':
                        return field.render();
                    case 'null':
                        return null;

                    default:
                        return null;
                }
            });
    }
    const submitterButtons =
        submitter !== false ? (
            <div
                className={
                    'pro-form-card-submitter' +
                    (submitter?.position === 'bottom' ? ' pro-form-card-submitter-bottom' : '')
                }
            >
                <Space>
                    <ProButton
                        onAsyncClick={() => actions.saveForm()}
                        icon={submitter?.saveIcon === false ? undefined : submitter?.saveIcon || <SaveOutlined />}
                    >
                        {submitter?.saveText || 'Сохранить'}
                    </ProButton>
                    {!submitter?.hideReset && (
                        <ProButton
                            type='default'
                            onClick={() => actions.setForm()}
                            icon={
                                submitter?.resetIcon === false
                                    ? undefined
                                    : submitter?.resetIcon || <RollbackOutlined />
                            }
                        >
                            {submitter?.resetText || 'Отмена'}
                        </ProButton>
                    )}
                </Space>
            </div>
        ) : null;

    if (submitter !== false && (!submitter?.position || submitter.position === 'top')) {
        const spanDivider = 24 / span;

        for (let index = 0; index < spanDivider; index++) {
            if (childList.length < index) childList.push(null);
        }
        childList.splice(spanDivider - 1, 0, submitterButtons);
    }

    if (hidden) return null;

    return (
        <ConfigProvider prefixCls='pro-form-card'>
            <ProContainerItem className='pro-form-card' transparent={transparent}>
                <ProForm submitter={false} form={form}>
                    <Row gutter={[10, 10]}>
                        {childList.map((item, index) => {
                            return (
                                <Col key={index} span={span}>
                                    {item}
                                </Col>
                            );
                        })}
                        {submitter !== false && submitter?.position === 'bottom' ? (
                            <Col span={24}>{submitterButtons}</Col>
                        ) : null}
                    </Row>
                </ProForm>
            </ProContainerItem>
        </ConfigProvider>
    );
};

export default ProFormCard;
