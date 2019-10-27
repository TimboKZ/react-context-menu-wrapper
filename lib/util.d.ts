import { EventEmitter } from 'events';
import { Nullable } from 'tsdef';
export declare enum EventName {
    RequestMenu = "request_menu",
    RequestGlobalMenu = "request_global_menu",
    CloseAllMenus = "close_all_menus"
}
export interface ContextMenuEvent {
    data?: any;
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
export declare const addGenericListener: (name: EventName, listener: EventListener) => void;
export declare const removeGenericListener: (name: EventName, listener: EventListener) => void;
export declare const addLocalMenuHandler: (externalId: string, handler: InternalHandler) => void;
export declare const removeLocalMenuHandler: (externalId: string, handler: InternalHandler) => void;
export declare const addGlobalMenuHandler: (handler: InternalHandler) => void;
export declare const removeGlobalMenuHandler: (handler: InternalHandler) => void;
export declare const saveData: (data?: any) => Nullable<string>;
export declare const fetchData: (dataId: string) => string;
export declare const deleteData: (dataId: string) => void;
export declare const handleContextMenu: (event: MouseEvent) => void;
