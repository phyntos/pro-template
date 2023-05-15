import { useEffect, useState } from 'react';

const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState<{
        width?: number;
        height?: number;
    }>({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        window.addEventListener('resize', handleResize);

        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return {
        ...windowSize,
        isMobile: windowSize?.width && windowSize.width <= 768,
        isTablet: windowSize?.width && windowSize.width <= 1300,
    };
};

export default useWindowSize;
