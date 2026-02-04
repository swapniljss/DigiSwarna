import { useCallback, useRef } from 'react';

/**
 * function will be run after the the time of wait delay
 * @param {function} func
 * @param {Number} wait
 * @returns
 */
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

function useDebounce(callback, delay) {
    const ref = useRef();

    const doCallback = useCallback(
        (...args) => {
            callback && callback(...args);
        },
        [callback],
    );
    ref.current = doCallback;

    const debounced = useCallback((...args) => {
        ref.current(...args);
    }, []);

    // eslint-disable-next-line 
    return useCallback(debounce(debounced, delay || 1000), []);
}

export default useDebounce;
