import React, { useContext, useEffect, useRef } from 'react';
import { Nullable } from 'tsdef';

import { deleteData, generateDataId, saveData } from './globalState';
import { ContextMenuEvent, DataAttributes, LocalHandlers } from './handlers';

const UNINITIALIZED_SENTINEL = {};
export const useLazyValue = <T>(factory: () => T): T => {
    const valueRef = useRef<T>(UNINITIALIZED_SENTINEL as T);
    if (valueRef.current === UNINITIALIZED_SENTINEL) valueRef.current = factory();
    return valueRef.current;
};

export const ContextMenuEventContext = React.createContext<Nullable<ContextMenuEvent>>(null);
export const useContextMenuEvent = (): Nullable<ContextMenuEvent> => {
    return useContext(ContextMenuEventContext);
};

export interface ContextMenuHandlerObject {
    onContextMenu: (event: React.MouseEvent) => void;
    [DataAttributes.MenuId]?: string;
    [DataAttributes.DataId]?: string;
}
export const useContextMenuHandlers = (
    ref: React.RefObject<HTMLElement>,
    { id, data }: { id?: string; data?: any }
): void => {
    const dataId = useLazyValue(() => generateDataId());

    useEffect(() => {
        saveData(dataId, data);
        return () => deleteData(dataId);
    }, [data]);

    useEffect(() => {
        const { current } = ref;
        if (!current) return;

        if (id) current.setAttribute(DataAttributes.MenuId, id);
        current.setAttribute(DataAttributes.DataId, dataId);
        current.addEventListener('contextmenu', LocalHandlers.handleContextMenu);

        return () => {
            current.removeAttribute(DataAttributes.MenuId);
            current.removeAttribute(DataAttributes.DataId);
            current.removeEventListener('contextmenu', LocalHandlers.handleContextMenu);
        };
    }, [ref.current]);
};
