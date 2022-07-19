import { useEffect, useCallback } from 'react';

export default (refs: any, handler: Function, eventNames = ['pointerup', 'keyup', 'touchend']) => {
    if (!refs) throw new Error("There is no `ref` in useOutsideClick. It's required.");
    if (!handler) throw new Error("There is no `handler` in useOutsideClick. It's required.");
    if (typeof handler !== 'function') throw new Error('The `handler` is not a function in useOutsideClick');

    const handlerWithCheck = useCallback(
        (event: any) => {
            if (Array.isArray(refs)) {
                const isNotCurrentRef = refs.every((ref) => ref && ref.current && !ref.current.contains(event.target));

                if (isNotCurrentRef) {
                    handler(event);
                }
            } else if (refs && refs.current && !refs.current.contains(event.target)) {
                handler(event);
            }
        },
        [refs, handler],
    );

    useEffect(() => {
        eventNames.forEach((eventName) => document.addEventListener(eventName, handlerWithCheck));
        return () => eventNames.forEach((eventName) => document.removeEventListener(eventName, handlerWithCheck));
    }, [eventNames, handlerWithCheck]);
};
