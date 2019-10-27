import { EventEmitter } from 'events';
import shortid from 'shortid';
import { Undefinable } from 'tsdef';

import { ContextMenuEvent, GlobalHandlers } from './handlers';
import { warn } from './util';

export enum EventName {
    RequestMenu = 'request_menu',
    RequestGlobalMenu = 'request_global_menu',
    CloseAllMenus = 'close_all_menus',
}
export enum HideReason {
    Manual,
}
export type EventListener = (data: any) => void;
export type InternalHandler = (event: ContextMenuEvent) => void;

declare global {
    interface Window {
        __ReactContextMenuWrapper: {
            emitter: EventEmitter;
            localMenuHandlers: { [externalId: string]: InternalHandler };
            globalMenuHandlers: InternalHandler[];
            dataMap: { [randomId: string]: string };
        };
    }
}

export const initWindowState = () => {
    window.__ReactContextMenuWrapper = {
        emitter: new EventEmitter(),
        localMenuHandlers: {},
        globalMenuHandlers: [],
        dataMap: {},
    };

    document.body.addEventListener('contextmenu', GlobalHandlers.handleContextMenu);
};
export const hideAllMenus = () => {
    const { emitter } = window.__ReactContextMenuWrapper;
    emitter.emit(EventName.CloseAllMenus);
};

export const addGenericListener = (name: EventName, listener: EventListener) => {
    const { emitter } = window.__ReactContextMenuWrapper;
    emitter.addListener(name, listener);
};
export const removeGenericListener = (name: EventName, listener: EventListener) => {
    const { emitter } = window.__ReactContextMenuWrapper;
    emitter.removeListener(name, listener);
};

export const addLocalMenuHandler = (menuId: string, handler: InternalHandler) => {
    const { localMenuHandlers } = window.__ReactContextMenuWrapper;
    if (localMenuHandlers[menuId]) {
        warn(`Detected duplicate menu id: ${menuId}. Only the last one will be used.`);
    }
    localMenuHandlers[menuId] = handler;
};
export const getLocalMenuHandler = (menuId: string): Undefinable<InternalHandler> => {
    const { localMenuHandlers } = window.__ReactContextMenuWrapper;
    return localMenuHandlers[menuId];
};
export const removeLocalMenuHandler = (menuId: string) => {
    const { localMenuHandlers } = window.__ReactContextMenuWrapper;
    delete localMenuHandlers[menuId];
};

export const addGlobalMenuHandler = (handler: InternalHandler) => {
    const { globalMenuHandlers } = window.__ReactContextMenuWrapper;
    if (globalMenuHandlers.length > 0) {
        warn('You have defined multiple global menus. Only the last one will be used');
    }
    globalMenuHandlers.push(handler);
};
export const getGlobalMenuHandler = (): Undefinable<InternalHandler> => {
    const { globalMenuHandlers } = window.__ReactContextMenuWrapper;
    if (globalMenuHandlers.length <= 0) return undefined;
    return globalMenuHandlers[globalMenuHandlers.length - 1];
};
export const removeGlobalMenuHandler = (handler: InternalHandler) => {
    const { globalMenuHandlers } = window.__ReactContextMenuWrapper;
    const handlerIndex = globalMenuHandlers.indexOf(handler);
    if (handlerIndex !== -1) globalMenuHandlers.splice(handlerIndex);
};

export const generateDataId = (): string => shortid.generate();
export const saveData = (dataId: string, data: any) => {
    if (data === undefined) return;

    const { dataMap } = window.__ReactContextMenuWrapper;
    dataMap[dataId] = data;
};
export const fetchData = (dataId: string) => {
    const { dataMap } = window.__ReactContextMenuWrapper;
    return dataMap[dataId];
};
export const deleteData = (dataId: string) => {
    const { dataMap } = window.__ReactContextMenuWrapper;
    delete dataMap[dataId];
};
