import { EventEmitter } from 'events';
import { Undefinable } from 'tsdef';
import { ContextMenuEvent } from './handlers';
export declare enum EventName {
    RequestMenu = "request_menu",
    RequestGlobalMenu = "request_global_menu",
    CloseAllMenus = "close_all_menus"
}
export declare enum HideReason {
    Manual = 0
}
export declare type EventListener = (data: any) => void;
export declare type InternalHandler = (event: ContextMenuEvent) => void;
declare global {
    interface Window {
        __ReactContextMenuWrapper: {
            emitter: EventEmitter;
            localMenuHandlers: {
                [externalId: string]: InternalHandler;
            };
            globalMenuHandlers: InternalHandler[];
            dataMap: {
                [randomId: string]: string;
            };
        };
    }
}
export declare const initWindowState: () => void;
export declare const hideAllMenus: () => void;
export declare const addGenericListener: (name: EventName, listener: EventListener) => void;
export declare const removeGenericListener: (name: EventName, listener: EventListener) => void;
export declare const addLocalMenuHandler: (menuId: string, handler: InternalHandler) => void;
export declare const getLocalMenuHandler: (menuId: string) => Undefinable<InternalHandler>;
export declare const removeLocalMenuHandler: (menuId: string) => void;
export declare const addGlobalMenuHandler: (handler: InternalHandler) => void;
export declare const getGlobalMenuHandler: () => Undefinable<InternalHandler>;
export declare const removeGlobalMenuHandler: (handler: InternalHandler) => void;
export declare const generateDataId: () => string;
export declare const saveData: (dataId: string, data: any) => void;
export declare const fetchData: (dataId: string) => string;
export declare const deleteData: (dataId: string) => void;
