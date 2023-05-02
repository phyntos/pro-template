import { RollbackOutlined, SaveOutlined } from '@ant-design/icons';
import {
    FormInstance,
    ProForm,
    ProFormSelectProps,
    ProFormUploadButtonProps,
    useIntl,
} from '@ant-design/pro-components';
import { ProFormFieldItemProps } from '@ant-design/pro-form/es/typing';
import { ConfigProvider, DatePickerProps, Space, Spin } from 'antd';
import { InputProps, PasswordProps, TextAreaProps } from 'antd/lib/input';
import { InputRef } from 'antd/lib/input/Input';
import { TextAreaRef } from 'antd/lib/input/TextArea';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { NumberNormalizeArgs, RegexNormalizeArgs, deepComparison } from '../../functions';
import ProButton from '../ProButton/ProButton';
import { ProContainerItem, useSetProFormCardInstance } from '../ProContainer/ProContainer';
import './ProFormCard.scss';
import { ProFields, ProFieldRow, ProField } from './components';

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

    const actions = useMemo<ProFormCardActions<FormVM>>(
        () => ({ setField, saveForm, setForm }),
        [setForm, saveForm, setField],
    );

    useSetProFormCardInstance(id, form, actions);

    return [form, actions] as const;
};
// eslint-disable-next-line @typescript-eslint/ban-types
export type KeyOfWithString<DataSource extends Record<string, any>> = (string & {}) | Extract<keyof DataSource, string>;

export type KeyPath<FormVM extends Record<string, any>> =
    // eslint-disable-next-line @typescript-eslint/ban-types
    KeyOfWithString<FormVM> | (KeyOfWithString<FormVM> | number)[];

type FormItemProps<T, FormVM extends Record<string, any>> = Omit<T, 'name'> & { name: KeyPath<FormVM> };

export type ProFormCardSelectField<FormVM extends Record<string, any>> = {
    type: 'select';
    props: FormItemProps<ProFormSelectProps<any>, FormVM>;
};

export type ProFormCardDateTimeField<FormVM extends Record<string, any>> = {
    type: 'date';
    props: FormItemProps<ProFormFieldItemProps<DatePickerProps, any>, FormVM>;
};

export type ProFormCardUploadButtonField<FormVM extends Record<string, any>> = {
    type: 'upload_button';
    props: FormItemProps<ProFormUploadButtonProps, FormVM>;
};

export type ProFormCardTextField<FormVM extends Record<string, any>> = {
    type: 'text';
    props: FormItemProps<ProFormFieldItemProps<InputProps, InputRef>, FormVM>;
};

export type ProFormCardTextAreaField<FormVM extends Record<string, any>> = {
    type: 'textarea';
    props: FormItemProps<ProFormFieldItemProps<TextAreaProps, TextAreaRef>, FormVM>;
};

export type ProFormCardNumberField<FormVM extends Record<string, any>> = {
    type: 'number';
    props: FormItemProps<Omit<ProFormFieldItemProps<InputProps, InputRef>, 'normalize'>, FormVM>;
} & NumberNormalizeArgs;

export type ProFormCardRegExpField<FormVM extends Record<string, any>> = {
    type: 'regex';
    props: FormItemProps<Omit<ProFormFieldItemProps<InputProps, InputRef>, 'normalize'>, FormVM>;
} & RegexNormalizeArgs;

export type ProFormCardPasswordField<FormVM extends Record<string, any>> = {
    type: 'password';
    props: FormItemProps<ProFormFieldItemProps<PasswordProps, InputRef>, FormVM>;
};

export type ProFormCardRenderField = {
    type: 'render';
    render: () => React.ReactNode;
};

export type ProFormCardNullField = {
    type: 'null';
};

export type ProFormCardSubmitterField = {
    type: 'submitter';
};

export type ProFormCardItemField<FormVM extends Record<string, any>> = {
    type: 'item';
    children: ProFormCardChildField<FormVM>[];
    transparent?: boolean;
    title?: React.ReactNode;
    titleExtraRender?: React.ReactNode;
};

type ProFormCardFieldCommon<FormVM extends Record<string, any>> =
    | ProFormCardSelectField<FormVM>
    | ProFormCardDateTimeField<FormVM>
    | ProFormCardRenderField
    | ProFormCardNullField
    | ProFormCardTextField<FormVM>
    | ProFormCardTextAreaField<FormVM>
    | ProFormCardNumberField<FormVM>
    | ProFormCardRegExpField<FormVM>
    | ProFormCardUploadButtonField<FormVM>
    | ProFormCardPasswordField<FormVM>;

type ProFormCardFieldDefault = {
    hidden?: boolean;
    span?: number | string;
};

export type ProFormCardField<FormVM extends Record<string, any>> = (
    | ProFormCardFieldCommon<FormVM>
    | ProFormCardItemField<FormVM>
    | ProFormCardSubmitterField
) &
    ProFormCardFieldDefault;

type ProFormCardChildField<FormVM extends Record<string, any>> = ProFormCardFieldCommon<FormVM> &
    ProFormCardFieldDefault;

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
    title,
    loading,
    titleExtraRender,
}: {
    form: FormInstance<FormVM>;
    actions: ProFormCardActions<FormVM>;
    fields?: ProFormCardField<FormVM>[];
    submitter?:
        | false
        | {
              hideReset?: boolean;
              saveText?: string;
              resetText?: string;
              saveIcon?: false | React.ReactNode;
              resetIcon?: false | React.ReactNode;
              position?: 'top' | 'bottom';
              validate?: boolean;
              extraRender?: React.ReactNode;
          };
    span?: number | string;
    hidden?: boolean;
    transparent?: boolean;
    loading?: boolean;
    title?: React.ReactNode;
    titleExtraRender?: React.ReactNode;
}) => {
    const intl = useIntl();
    const { locale } = useContext(ConfigProvider.ConfigContext);

    const isSubmitterField = submitter !== false && fields?.some((x) => x.type === 'submitter');

    const isSubmitterTop = !isSubmitterField && submitter !== false && submitter?.position === 'top';
    const isSubmitterBottom =
        !isSubmitterField && submitter !== false && (!submitter?.position || submitter?.position === 'bottom');

    const submitterButtons =
        submitter !== false ? (
            <div className={'pro-form-card-submitter' + (isSubmitterBottom ? ' pro-form-card-submitter-bottom' : '')}>
                <Space>
                    <ProButton
                        onAsyncClick={() => actions.saveForm(submitter?.validate)}
                        icon={submitter?.saveIcon === false ? undefined : submitter?.saveIcon || <SaveOutlined />}
                    >
                        {submitter?.saveText || intl.getMessage('editableTable.action.save', 'Save')}
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
                            {submitter?.resetText || locale?.Modal?.cancelText || 'Cancel'}
                        </ProButton>
                    )}
                    {submitter?.extraRender}
                </Space>
            </div>
        ) : null;

    if (hidden) return null;

    return (
        <ConfigProvider prefixCls='pro-form-card'>
            <ProContainerItem className='pro-form-card' transparent={transparent}>
                <Spin spinning={loading || false}>
                    <ProForm submitter={false} form={form}>
                        <ProFieldRow<FormVM>
                            title={title}
                            titleExtraRender={titleExtraRender}
                            isSubmitterBottom={isSubmitterBottom}
                            isSubmitterTop={isSubmitterTop}
                            span={span}
                            submitterButtons={submitterButtons}
                            submitterDisabled={submitter === false}
                            fields={fields}
                        />
                    </ProForm>
                </Spin>
            </ProContainerItem>
        </ConfigProvider>
    );
};

ProFormCard.FieldRow = ProFieldRow;
ProFormCard.FieldList = ProFields;
ProFormCard.Field = ProField;

export default ProFormCard;
