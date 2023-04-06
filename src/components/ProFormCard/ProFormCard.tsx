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
import { Col, ConfigProvider, DatePickerProps, Row, Space, Spin } from 'antd';
import { InputProps, PasswordProps } from 'antd/lib/input';
import { InputRef } from 'antd/lib/input/Input';
import React, { useCallback, useEffect, useMemo } from 'react';
import {
    deepComparison,
    numberNormalize,
    NumberNormalizeArgs,
    regexNormalize,
    RegexNormalizeArgs,
} from '../../functions';
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

export type ProFormCardNumberField = {
    type: 'number';
    props: Omit<ProFormFieldItemProps<InputProps, InputRef>, 'normalize'>;
} & NumberNormalizeArgs;

export type ProFormCardRegExpField = {
    type: 'regex';
    props: Omit<ProFormFieldItemProps<InputProps, InputRef>, 'normalize'>;
} & RegexNormalizeArgs;

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

export type ProFormCardSubmitterField = {
    type: 'submitter';
};

export type ProFormCardItemField = {
    type: 'item';
    children: ProFormCardChildField[];
    transparent?: boolean;
    title?: React.ReactNode;
    titleExtraRender?: React.ReactNode;
};

type ProFormCardFieldCommon =
    | ProFormCardSelectField
    | ProFormCardDateTimeField
    | ProFormCardRenderField
    | ProFormCardNullField
    | ProFormCardTextField
    | ProFormCardNumberField
    | ProFormCardRegExpField
    | ProFormCardPasswordField;

type ProFormCardField = (ProFormCardFieldCommon | ProFormCardItemField | ProFormCardSubmitterField) & {
    hidden?: boolean;
    span?: number | string;
};

type ProFormCardChildField = ProFormCardFieldCommon & {
    hidden?: boolean;
    span?: number | string;
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
    title,
    loading,
    titleExtraRender,
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
    const getField = (field: ProFormCardField): React.ReactNode => {
        switch (field.type) {
            case 'select':
                return <ProFormSelect {...field.props} disabled={submitter === false || field.props.disabled} />;
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
            case 'number':
                return (
                    <ProFormText
                        {...field.props}
                        disabled={submitter === false || field.props.disabled}
                        normalize={numberNormalize({
                            isInteger: field.isInteger,
                            isPositive: field.isPositive,
                            max: field.max,
                            min: field.min,
                            fractionDigits: field.fractionDigits,
                        })}
                    />
                );
            case 'regex':
                return (
                    <ProFormText
                        {...field.props}
                        disabled={submitter === false || field.props.disabled}
                        normalize={regexNormalize({
                            regex: field.regex,
                            toUpper: field.toUpper,
                        })}
                    />
                );
            case 'password':
                return <ProFormText.Password {...field.props} disabled={submitter === false || field.props.disabled} />;
            case 'render':
                return field.render();
            case 'null':
                return null;
            case 'submitter':
                return submitterButtons;
            case 'item':
                return (
                    <ProContainerItem transparent={field.transparent}>
                        {getFieldsRow({
                            title: field.title,
                            titleExtraRender: field.titleExtraRender,
                            children: getFields(field.children),
                            hideSubmitter: true,
                        })}
                    </ProContainerItem>
                );

            default:
                return null;
        }
    };

    const getFields = (fields?: ProFormCardField[]): React.ReactNode => {
        if (!fields?.length) return null;

        const hiddenFields = fields.filter((x) => x.hidden);
        const visibleFields = fields.filter((x) => !x.hidden);
        return (
            <>
                <div className='pro-form-card-hidden-fields'>{hiddenFields}</div>
                {visibleFields
                    .filter((x) => !x.hidden)
                    .map((item, index) => {
                        return (
                            <Col key={index} span={item.span || span}>
                                {getField(item)}
                            </Col>
                        );
                    })}
            </>
        );
    };

    const getFieldsRow = ({
        children,
        title,
        titleExtraRender,
        hideSubmitter,
    }: {
        title?: React.ReactNode;
        titleExtraRender?: React.ReactNode;
        children: React.ReactNode;
        hideSubmitter?: boolean;
    }) => {
        return (
            <Row gutter={[14, 0]}>
                {(title || titleExtraRender || (!hideSubmitter && isSubmitterTop)) && (
                    <Col span={24}>
                        <div className='pro-form-card-title'>
                            {title ? <div className='pro-form-card-title-text'>{title}</div> : null}
                            {titleExtraRender}
                            {!hideSubmitter && isSubmitterTop ? submitterButtons : null}
                        </div>
                    </Col>
                )}
                {children}
                {!hideSubmitter && isSubmitterBottom ? <Col span={24}>{submitterButtons}</Col> : null}
            </Row>
        );
    };

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
                    {submitter?.extraRender}
                </Space>
            </div>
        ) : null;

    const children = getFields(fields);

    if (hidden) return null;

    return (
        <ConfigProvider prefixCls='pro-form-card'>
            <ProContainerItem className='pro-form-card' transparent={transparent}>
                <Spin spinning={loading || false}>
                    <ProForm submitter={false} form={form}>
                        {getFieldsRow({ children, title, titleExtraRender })}
                    </ProForm>
                </Spin>
            </ProContainerItem>
        </ConfigProvider>
    );
};

export default ProFormCard;
