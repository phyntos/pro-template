import React from 'react';
import { ProLogoSize } from '../components/ProLogo/ProLogo';
import { ProLogo } from '../pro-template';

const DevLogo = ({ size, withDescription }: { size: ProLogoSize; withDescription?: boolean }) => {
    return <ProLogo size={size} withDescription={withDescription} logo='DEV' description='DEV IS DEV' />;
};

export default DevLogo;
