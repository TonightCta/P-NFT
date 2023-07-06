import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";

const useUnmounted = () => {
    const unmountedRef = useRef(false);
    useEffect(() => {
        return () => {
            unmountedRef.current = true;
        };
    }, []);
    return unmountedRef.current;
}

export const useAsyncState = <S>(initialState?: S | (() => S)): [S | undefined, Dispatch<SetStateAction<S>>] => {
    const unmountedRef = useUnmounted();
    const [state, setState] = useState(initialState);
    const setAsyncState = useCallback((s: any) => {
        if (unmountedRef) return;
        setState(s);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return [state, setAsyncState];
}