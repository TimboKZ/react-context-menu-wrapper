import React from 'react';
import { Nullable } from 'tsdef';
import { ContextMenuEvent } from './handlers';
export declare const useLazyValue: <T>(factory: () => T) => T;
export declare const ContextMenuEventContext: React.Context<Nullable<ContextMenuEvent>>;
export declare const useContextMenuEvent: () => Nullable<ContextMenuEvent>;
export declare const useContextMenuHandlers: (ref: React.RefObject<HTMLElement>, { id, data }: {
    id?: string | undefined;
    data?: any;
}) => void;
export declare const useMenuToggleMethods: (lastShowMenuEvent: Nullable<ContextMenuEvent>, setShowMenuEvent: (event: Nullable<ContextMenuEvent>) => void, onShow?: ((event: ContextMenuEvent) => void) | undefined, onHide?: (() => void) | undefined) => [(event: ContextMenuEvent) => void, () => void];
export declare const useMenuPlacementStyle: (wrapperRef: React.RefObject<HTMLElement>, lastShowMenuEvent: Nullable<ContextMenuEvent>, setMenuPlacementStyle: (style: Nullable<React.CSSProperties>) => void) => void;
export declare const useInternalHandlers: (wrapperRef: React.RefObject<HTMLElement>, lastShowMenuEvent: Nullable<ContextMenuEvent>, showMenu: (event: ContextMenuEvent) => void, hideMenu: () => void, id?: string | undefined, global?: boolean | undefined, hideOnSelfClick?: boolean | undefined, hideOnOutsideClick?: boolean | undefined, hideOnEscape?: boolean | undefined, hideOnScroll?: boolean | undefined, hideOnWindowResize?: boolean | undefined) => void;
