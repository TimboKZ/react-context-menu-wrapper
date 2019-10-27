import { useEffect, useMemo } from 'react';

import { handleContextMenu, deleteData, saveData } from './util';

export interface ContextMenuHandlerObject {
    onContextMenu: (event: MouseEvent) => void;
    'data-contextmenu-id': string;
    'data-contextmenu-data-id'?: string;
}

export const useContextMenuHandlers = (menuId: string, data?: any) => {
    const handlers: ContextMenuHandlerObject = useMemo(
        () => ({
            onContextMenu: handleContextMenu,
            'data-contextmenu-id': menuId,
        }),
        [menuId]
    );

    useEffect(() => {
        const dataId = saveData(data);
        if (dataId) handlers['data-contextmenu-data-id'] = dataId;
        return () => {
            if (dataId) deleteData(dataId);
        };
    }, [data]);

    return handlers;
};
