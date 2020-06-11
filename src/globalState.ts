/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import { EventEmitter } from 'events';
import shortid from 'shortid';
import { Nullable, Undefinable } from 'tsdef';

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

interface ReactContextMenuWrapperState {
    emitter: EventEmitter;
    localMenuHandlers: { [menuId: string]: InternalHandler };
    globalMenuHandlers: InternalHandler[];
    longPressTimeout: Nullable<number>;
    handlerDataMap: { [randomId: string]: any };
}
interface CustomWindow {
    __ReactContextMenuWrapper: ReactContextMenuWrapperState;
}

let state: ReactContextMenuWrapperState;
export const initWindowState = () => {
    state = {
        emitter: new EventEmitter(),
        localMenuHandlers: {},
        globalMenuHandlers: [],
        longPressTimeout: null,
        handlerDataMap: {},
    };
    ((window as any) as CustomWindow).__ReactContextMenuWrapper = state;

    document.body.addEventListener('contextmenu', GlobalHandlers.handleContextMenu);
    document.body.addEventListener('touchstart', GlobalHandlers.handleTouchStart);
    document.body.addEventListener('touchmove', GlobalHandlers.handleTouchMove);
    document.body.addEventListener('touchend', GlobalHandlers.handleTouchEnd);
    document.body.addEventListener('touchcancel', GlobalHandlers.handleTouchCancel);
};
export const hideAllMenus = () => {
    state.emitter.emit(EventName.CloseAllMenus);
};

export const addGenericListener = (name: EventName, listener: EventListener) => {
    state.emitter.addListener(name, listener);
};
export const removeGenericListener = (name: EventName, listener: EventListener) => {
    state.emitter.removeListener(name, listener);
};

export const addLocalMenuHandler = (menuId: string, handler: InternalHandler) => {
    if (state.localMenuHandlers[menuId]) {
        warn(`Detected duplicate menu id: ${menuId}. Only the last one will be used.`);
    }
    state.localMenuHandlers[menuId] = handler;
};
export const getLocalMenuHandler = (menuId: string): Undefinable<InternalHandler> => {
    return state.localMenuHandlers[menuId];
};
export const removeLocalMenuHandler = (menuId: string) => {
    delete state.localMenuHandlers[menuId];
};

export const addGlobalMenuHandler = (handler: InternalHandler) => {
    if (state.globalMenuHandlers.length > 0) {
        warn('You have defined multiple global menus. Only the last one will be used');
    }
    state.globalMenuHandlers.push(handler);
};
export const getGlobalMenuHandler = (): Undefinable<InternalHandler> => {
    if (state.globalMenuHandlers.length <= 0) return undefined;
    return state.globalMenuHandlers[state.globalMenuHandlers.length - 1];
};
export const removeGlobalMenuHandler = (handler: InternalHandler) => {
    const handlerIndex = state.globalMenuHandlers.indexOf(handler);
    if (handlerIndex !== -1) state.globalMenuHandlers.splice(handlerIndex);
};

export const addLongPressTimeout = (callback: () => void, timeout: number) => {
    state.longPressTimeout = setTimeout(callback, timeout);
};
export const hasLongPressTimeout = () => typeof state.longPressTimeout === 'number';
export const clearLongPressTimeout = () => {
    const timeoutId = state.longPressTimeout;
    if (timeoutId === null) return;
    state.longPressTimeout = null;
    clearTimeout(timeoutId);
};

export const generateHandlerDataId = (): string => shortid.generate();
export const saveHandlerData = (dataId: string, data: any) => {
    if (data === undefined) return;
    state.handlerDataMap[dataId] = data;
};
export const fetchHandlerData = (dataId: string) => {
    return state.handlerDataMap[dataId];
};
export const deleteHandlerData = (dataId: string) => {
    delete state.handlerDataMap[dataId];
};
