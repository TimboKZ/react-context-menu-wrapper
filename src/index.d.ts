import {Component} from 'react';

export class ContextMenuWrapper extends Component<any, any, any> {
    readonly id?: string;
    readonly global?: boolean;
    readonly onShow?: () => void | null;
    readonly onHide?: () => void | null;
    readonly hideOnSelfClick?: boolean;
    readonly hideOnOutsideClick?: boolean;
    readonly hideOnScroll?: boolean;
    readonly hideOnWindowResize?: boolean;
    readonly context: any;
}

export function prepareContextMenuHandlers(params?: PrepareContextMenuHandlersParams): ContextMenuHandlers;

export interface PrepareContextMenuHandlersParams {
    readonly id?: string;
    readonly data?: any;
}

export function addContextMenuEventListener(id: string | null,
                                            listener: ContextMenuEventListener): void;

export function removeContextMenuEventListener(id: string | null, listener: ContextMenuEventListener): void;

export type ContextMenuEventListener = (eventName: string, data: any | null, publicProps: any) => void

export function hideAllContextMenus(): void;

export function cancelOtherContextMenus(): void;

export enum ContextMenuEvent {
    Show, Hide
}

export function showContextMenu(data: ShowContextMenuData): void;

export interface ShowContextMenuData {
    readonly id?: string;
    readonly data?: any;
    readonly event?: MouseEvent | ContextMenuEvent;
    readonly x?: any;
    readonly y?: any;
}

export interface ContextMenuHandlers {
    // TODO: not sure what react event types to use.
    onContextMenu: (event: any) => void;
    onTouchStart: (event: any) => void;
    onTouchEnd: (event: any) => void;
}
