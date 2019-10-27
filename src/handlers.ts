import { Nullable } from 'tsdef';
import { fetchData, getGlobalMenuHandler, getLocalMenuHandler, hideAllMenus } from './globalState';

export enum DataAttributes {
    MenuId = 'data-contextmenu-menu-id',
    DataId = 'data-contextmenu-data-id',
}

export enum ContextMenuEventType {
    Show = 'Show',
    Hide = 'Hide',
}
export interface ContextMenuEvent {
    type: ContextMenuEventType;
    clientX: number;
    clientY: number;
    data: any;
}
const createMenuEvent = (type: ContextMenuEventType, mouseEvent: MouseEvent, data: any): ContextMenuEvent => {
    return {
        type,
        clientX: mouseEvent.clientX,
        clientY: mouseEvent.clientY,
        data,
    };
};

type ContextMenuTarget = EventTarget & Element;
const extractMenuData = (target: Nullable<ContextMenuTarget>): [Nullable<string>, any] => {
    if (!target) {
        // If target is not set, we were triggered by a global context menu event so there's
        // nothing we can extract here.
        return [null, undefined];
    }

    const menuId = target.getAttribute(DataAttributes.MenuId);
    const dataId = target.getAttribute(DataAttributes.DataId);
    const data = dataId ? fetchData(dataId) : undefined;
    return [menuId, data];
};
const GenericHandlers = {
    handleContextMenu: (event: MouseEvent, handlerTarget: Nullable<ContextMenuTarget>) => {
        const [menuId, data] = extractMenuData(handlerTarget);

        let handler;
        if (menuId) handler = getLocalMenuHandler(menuId);
        else handler = getGlobalMenuHandler();
        if (!handler) return;

        event.preventDefault();
        event.stopPropagation();
        hideAllMenus();

        const menuEvent = createMenuEvent(ContextMenuEventType.Show, event, data);
        handler(menuEvent);
    },
} as const;

export const GlobalHandlers = {
    handleContextMenu: (event: MouseEvent) => GenericHandlers.handleContextMenu(event, null),
} as const;

export const LocalHandlers = {
    handleContextMenu: (event: MouseEvent) =>
        GenericHandlers.handleContextMenu(event, (event.currentTarget as any) as ContextMenuTarget),
} as const;
