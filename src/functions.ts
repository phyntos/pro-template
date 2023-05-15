export const deepComparison = <T>(first: T, second: T) => {
    /* Checking if the types and values of the two arguments are the same. */
    if (first === second) return true;

    /* Checking if any arguments are null */
    if (first === null || second === null) return false;

    /* Checking if any argument is none object */
    if (typeof first !== 'object' || typeof second !== 'object') return false;

    /* Using Object.getOwnPropertyNames() method to return the list of the objects’ properties */
    const first_keys = Object.getOwnPropertyNames(first) as (keyof T)[];

    const second_keys = Object.getOwnPropertyNames(second) as (keyof T)[];

    /* Checking if the objects' length are same*/
    if (first_keys.length !== second_keys.length) return false;

    /* Iterating through all the properties of the first object with the for of method*/
    for (const key of first_keys) {
        /* Making sure that every property in the first object also exists in second object. */
        if (!Object.hasOwn(second, key)) return false;

        /* Using the deepComparison function recursively (calling itself) and passing the values of each property into it to check if they are equal. */
        if (deepComparison(first[key], second[key]) === false) return false;
    }

    /* if no case matches, returning true */
    return true;
};

const toFixed = (num: string, fixed: number) => {
    const re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');
    return num.match(re)?.[0] || '';
};

export type NumberNormalizeArgs = {
    isInteger?: boolean;
    isPositive?: boolean;
    min?: number;
    max?: number;
    fractionDigits?: number;
};

export const formatSeparator = (value: string) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

export const numberNormalize =
    ({
        isInteger,
        isPositive,
        min,
        max,
        fractionDigits,
    }: NumberNormalizeArgs): ((value: string, prevValue: string) => any) =>
    (value, prevValue) => {
        if (typeof value === 'undefined') return undefined;

        value = value.replaceAll(' ', '');
        if (!isInteger) value = value.replace(',', '.');
        else {
            value = value.replace(',', '');
            value = value.replace('.', '');
        }
        if (isPositive) {
            value = value.replace('-', '');
        }

        let numberState: 'current' | 'prev' | 'zero' = 'current';

        if (Number.isNaN(Number(value)) && value !== '-') {
            numberState = 'prev';
            if (Number.isNaN(Number(prevValue))) numberState = 'zero';
        }

        let number = numberState === 'current' ? value : numberState === 'prev' ? prevValue : '0';

        const isMin = typeof min !== 'undefined' && Number(number) < min;
        const isMax = typeof max !== 'undefined' && Number(number) > max;

        if (isMin) number = min.toString();
        if (isMax) number = max.toString();
        if (isMax && isMin) number = '0';

        let numberValue = String(number);

        if (!isInteger && value[value.length - 1] === '.' && !numberValue.includes('.')) {
            numberValue += '.';
        }

        if (
            fractionDigits &&
            fractionDigits > 0 &&
            numberValue.includes('.') &&
            numberValue.split('.')[1].length > fractionDigits
        )
            numberValue = toFixed(number, fractionDigits);

        if (value[0] === '0' && /^\d+$/.test(value[1])) {
            numberValue = numberValue.substring(1);
        }

        if (!isPositive) {
            if (value === '0-') {
                numberValue = '-';
            }
            if (value[0] === '-' && value[1] === '0' && /^\d+$/.test(value[2])) {
                numberValue = numberValue.slice(0, 1) + numberValue.slice(2);
            }
        }

        return numberValue;
    };
export type RegexNormalizeArgs = { regex?: RegExp | RegExp[]; toUpper?: boolean };

export const regexNormalize =
    ({ regex, toUpper }: RegexNormalizeArgs): ((value: string, prevValue: string) => any) =>
    (value: string, prevValue) => {
        if (typeof value === 'undefined') return undefined;
        if (value === '') return '';
        const inputValue = toUpper ? value.toUpperCase() : value;
        const isIncorrect = inputValue.split('').some((char: any, index: number) => {
            if (Array.isArray(regex)) {
                return !char.match(regex[index]);
            } else {
                return !char.match(regex);
            }
        });

        if (isIncorrect) return prevValue;

        return inputValue;
    };

export const groupByArray = function <T extends Record<string, any> = Record<string, any>>(
    arr: T[],
    key: Extract<keyof T, string>,
) {
    return arr.reduce<T[][]>((acc, element) => {
        let find = acc.find((arr) => arr[0][key] == element[key]);

        if (find) {
            find.push(element);
        } else {
            find = [element];
            acc.push(find);
        }

        return acc;
    }, []);
};
