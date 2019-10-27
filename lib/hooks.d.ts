import React from 'react';
import { Nullable } from 'tsdef';
import { ContextMenuEvent, DataAttributes } from './handlers';
export declare const useLazyValue: <T>(factory: () => T) => T;
export declare const ContextMenuEventContext: React.Context<Nullable<ContextMenuEvent>>;
export declare const useContextMenuEvent: () => Nullable<ContextMenuEvent>;
export interface ContextMenuHandlerObject {
    onContextMenu: (event: React.MouseEvent) => void;
    [DataAttributes.MenuId]?: string;
    [DataAttributes.DataId]?: string;
}
export declare const useContextMenuHandlers: (ref: React.RefObject<HTMLElement>, { id, data }: {
    id?: string | undefined;
    data?: any;
}) => void;
