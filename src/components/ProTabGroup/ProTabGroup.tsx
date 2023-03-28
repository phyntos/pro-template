import { Radio, RadioChangeEvent } from 'antd';
import React from 'react';

type TabOptionType<T> = { label: React.ReactNode; value: T; style?: React.CSSProperties }[];

type TabGroupProps<T extends string> = {
    defaultTab?: T;
    tab: T | undefined;
    onTabChange: (tab: T) => void;
    tabEnum?: Partial<Record<T, string>>;
    options?: TabOptionType<T>;
    hiddenTabs?: T[];
    hiddenTabEnum?: Partial<Record<T, boolean>>;
    showTabs?: T[];
    className?: string;
};

const ProTabGroup = <T extends string>({
    onTabChange,
    tab,
    options,
    tabEnum,
    defaultTab,
    hiddenTabs,
    showTabs,
    hiddenTabEnum,
    className,
}: TabGroupProps<T>) => {
    const handleRadioChange = (e: RadioChangeEvent) => {
        onTabChange(e.target.value);
    };
    let tabOptions: TabOptionType<T> = [];

    if (options) tabOptions = options;
    else if (tabEnum) {
        tabOptions = Object.entries(tabEnum).map((value) => ({
            label: value[1] as string,
            value: value[0] as T,
        }));
    }

    if (hiddenTabs) tabOptions = tabOptions.filter((option) => !hiddenTabs?.includes(option.value));
    if (hiddenTabEnum) tabOptions = tabOptions.filter((option) => !hiddenTabEnum[option.value]);
    if (showTabs) tabOptions = tabOptions.filter((option) => showTabs?.includes(option.value));

    const classNames = [];
    if (className) classNames.push(className);

    return (
        <Radio.Group
            defaultValue={defaultTab}
            value={tab}
            onChange={handleRadioChange}
            optionType='button'
            options={tabOptions}
            className={classNames.join(' ')}
        />
    );
};

export default ProTabGroup;
