import {
    ProFormDatePicker,
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
    ProFormUploadButton,
} from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import React from 'react';
import { numberNormalize, regexNormalize } from '../../functions';
import useWindowSize from '../../hooks/useWindowSize';
import { ProContainerItem } from '../ProContainer/ProContainer';
import { ProFormCardField } from './ProFormCard';

export const ProField = <FormVM extends Record<string, any>>({
    field,
    submitterButtons,
    submitterDisabled,
    span,
}: {
    field: ProFormCardField<FormVM>;
    submitterDisabled?: boolean;
    submitterButtons?: React.ReactNode;
    span?: string | number;
}) => {
    switch (field.type) {
        case 'select':
            return <ProFormSelect {...field.props} disabled={submitterDisabled || field.props.disabled} />;
        case 'date':
            return (
                <ProFormDatePicker
                    {...field.props}
                    disabled={submitterDisabled || field.props.disabled}
                    fieldProps={{ ...field.props.fieldProps, format: 'DD.MM.YYYY' }}
                />
            );
        case 'upload_button':
            return <ProFormUploadButton {...field.props} disabled={submitterDisabled || field.props.disabled} />;
        case 'text':
            return <ProFormText {...field.props} disabled={submitterDisabled || field.props.disabled} />;
        case 'textarea':
            return <ProFormTextArea {...field.props} disabled={submitterDisabled || field.props.disabled} />;
        case 'number':
            return (
                <ProFormText
                    {...field.props}
                    disabled={submitterDisabled || field.props.disabled}
                    normalize={numberNormalize({
                        isInteger: field.isInteger,
                        isPositive: field.isPositive,
                        max: field.max,
                        min: field.min,
                        fractionDigits: field.fractionDigits,
                        withSeparator: field.withSeparator,
                    })}
                />
            );
        case 'regex':
            return (
                <ProFormText
                    {...field.props}
                    disabled={submitterDisabled || field.props.disabled}
                    normalize={regexNormalize({
                        regex: field.regex,
                        toUpper: field.toUpper,
                    })}
                />
            );
        case 'password':
            return <ProFormText.Password {...field.props} disabled={submitterDisabled || field.props.disabled} />;
        case 'render':
            return <>{field.render()}</>;
        case 'null':
            return null;
        case 'submitter':
            return <>{submitterButtons}</>;
        case 'item':
            return (
                <ProContainerItem transparent={field.transparent}>
                    <ProFieldRow
                        title={field.title}
                        titleExtraRender={field.titleExtraRender}
                        hideSubmitter
                        fields={field.children}
                        span={span}
                        submitterButtons={submitterButtons}
                        submitterDisabled={submitterDisabled}
                    />
                </ProContainerItem>
            );

        default:
            return null;
    }
};

export const ProFields = <FormVM extends Record<string, any>>({
    fields,
    span,
    submitterButtons,
    submitterDisabled,
}: {
    fields?: ProFormCardField<FormVM>[];
    submitterDisabled?: boolean;
    submitterButtons?: React.ReactNode;
    span?: string | number;
}) => {
    const { isMobile, isTablet } = useWindowSize();

    if (!fields?.length) return null;

    const hiddenFields = fields.filter((x) => x.hidden);
    const visibleFields = fields.filter((x) => !x.hidden);

    const getSpan = (span?: string | number | undefined) => {
        if (isMobile) return 24;
        if (isTablet && (span ? Number(span) < 12 : true)) return 12;
        return span;
    };

    return (
        <>
            <div className='pro-form-card-hidden-fields'>
                {hiddenFields.map((item, index) => (
                    <ProField
                        key={index}
                        field={item}
                        submitterButtons={submitterButtons}
                        submitterDisabled={submitterDisabled}
                    />
                ))}
            </div>
            {visibleFields
                .filter((x) => !x.hidden)
                .map((item, index) => {
                    return (
                        <Col key={index} span={getSpan(item.span || span)}>
                            <ProField
                                field={item}
                                submitterButtons={submitterButtons}
                                span={getSpan(span)}
                                submitterDisabled={submitterDisabled}
                            />
                        </Col>
                    );
                })}
        </>
    );
};

export const ProFieldRow = <FormVM extends Record<string, any>>({
    title,
    titleExtraRender,
    hideSubmitter,
    isSubmitterTop,
    isSubmitterBottom,
    submitterButtons,
    span,
    submitterDisabled,
    fields,
}: {
    title?: React.ReactNode;
    titleExtraRender?: React.ReactNode;
    hideSubmitter?: boolean;
    isSubmitterTop?: boolean;
    isSubmitterBottom?: boolean;
    submitterButtons?: React.ReactNode;
    span?: string | number;
    submitterDisabled?: boolean;
    fields?: ProFormCardField<FormVM>[];
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
            <ProFields
                span={span}
                submitterDisabled={submitterDisabled}
                submitterButtons={submitterButtons}
                fields={fields}
            />
            {!hideSubmitter && isSubmitterBottom ? <Col span={24}>{submitterButtons}</Col> : null}
        </Row>
    );
};
