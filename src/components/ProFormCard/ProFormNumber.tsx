import { ProFormField } from '@ant-design/pro-components';
import { Input } from 'antd';
import React, { ChangeEventHandler } from 'react';
import { formatSeparator, numberNormalize } from '../../functions';
import { ProFormCardNumberField } from './ProFormCard';

export const SeparatorInput = ({
    value = '',
    onChange,
    withSeparator,
    ...props
}: {
    value?: string;
    onChange?: (value: string) => void;
    withSeparator?: boolean;
}) => {
    const onNumberChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const value = e.target.value.replaceAll(' ', '');
        onChange?.(value);
    };

    return <Input value={withSeparator ? formatSeparator(value) : value} onChange={onNumberChange} {...props} />;
};

const ProFormNumber = (field: ProFormCardNumberField<any>) => {
    return (
        <ProFormField
            {...field.props}
            renderFormItem={() => <SeparatorInput withSeparator={field.withSeparator} />}
            normalize={numberNormalize({
                isInteger: field.isInteger,
                isPositive: field.isPositive,
                max: field.max,
                min: field.min,
                fractionDigits: field.fractionDigits,
            })}
        />
    );
};

export default ProFormNumber;
