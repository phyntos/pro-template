import React from 'react';
import './ProLogo.scss';

export type ProLogoSize = 'normal' | 'mini' | 'big';

const ProLogo = ({
    withDescription,
    className,
    size = 'normal',
    description,
    logo,
}: {
    withDescription?: boolean;
    className?: string;
    size?: ProLogoSize;
    description?: string;
    logo: React.ReactNode;
}) => {
    const classNames = ['pro-logo-container'];
    if (className) classNames.push(className);
    if (size === 'mini') classNames.push('pro-logo-mini');
    if (size === 'big') classNames.push('pro-logo-big');

    return (
        <div className={classNames.join(' ')}>
            <div className='pro-logo'>{logo}</div>
            {withDescription && <div className='pro-logo-desc'>{description}</div>}
        </div>
    );
};

export default ProLogo;
