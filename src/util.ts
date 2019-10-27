import shortid from 'shortid';
import { EventEmitter } from 'events';
import { Nullable } from 'tsdef';

export enum EventName {
    RequestMenu = 'request_menu',
    RequestGlobalMenu = 'request_global_menu',
    CloseAllMenus = 'close_all_menus',
}

export interface ContextMenuEvent {
    data?: any;
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
};

export const addGenericListener = (name: EventName, listener: EventListener) => {
    const { emitter } = window.__ReactContextMenuWrapper;
    emitter.addListener(name, listener);
};
export const removeGenericListener = (name: EventName, listener: EventListener) => {
    const { emitter } = window.__ReactContextMenuWrapper;
    emitter.removeListener(name, listener);
};

export const addLocalMenuHandler = (externalId: string, handler: InternalHandler) => {
    const { localMenuHandlers } = window.__ReactContextMenuWrapper;
    if (localMenuHandlers[externalId]) {
        console.warn(`[react-context-menu-wrapper] Detected duplicate menu id: ${externalId}`);
    }
    localMenuHandlers[externalId] = handler;
};
export const removeLocalMenuHandler = (externalId: string, handler: InternalHandler) => {
    const { localMenuHandlers } = window.__ReactContextMenuWrapper;
    delete localMenuHandlers[externalId];
};

export const addGlobalMenuHandler = (handler: InternalHandler) => {
    const { globalMenuHandlers } = window.__ReactContextMenuWrapper;
    if (globalMenuHandlers.length > 0) {
        console.warn(
            `[react-context-menu-wrapper] You have defined multiple global IDs - user experience might suffer.`
        );
    }
    globalMenuHandlers.push(handler);
};
export const removeGlobalMenuHandler = (handler: InternalHandler) => {
    const { globalMenuHandlers } = window.__ReactContextMenuWrapper;
    const handlerIndex = globalMenuHandlers.indexOf(handler);
    if (handlerIndex !== -1) globalMenuHandlers.splice(handlerIndex);
};

export const saveData = (data?: any): Nullable<string> => {
    if (data === undefined) return null;

    const { dataMap } = window.__ReactContextMenuWrapper;
    const randomId = shortid.generate();
    dataMap[randomId] = data;
    return randomId;
};
export const fetchData = (dataId: string) => {
    const { dataMap } = window.__ReactContextMenuWrapper;
    return dataMap[dataId];
};
export const deleteData = (dataId: string) => {
    const { dataMap } = window.__ReactContextMenuWrapper;
    delete dataMap[dataId];
};

export const handleContextMenu = (event: MouseEvent) => {
    console.log(event);
};
