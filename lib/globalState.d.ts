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
export declare const addLongPressTimeout: (callback: () => void, timeout: number) => void;
export declare const hasLongPressTimeout: () => boolean;
export declare const clearLongPressTimeout: () => void;
export declare const generateHandlerDataId: () => string;
export declare const saveHandlerData: (dataId: string, data: any) => void;
export declare const fetchHandlerData: (dataId: string) => any;
export declare const deleteHandlerData: (dataId: string) => void;
