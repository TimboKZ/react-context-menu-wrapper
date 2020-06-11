/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
import React from 'react';
import { Nullable } from 'tsdef';
import { ContextMenuEvent } from './handlers';
export declare const useLazyValue: <T>(factory: () => T) => T;
export declare const ContextMenuEventContext: React.Context<Nullable<ContextMenuEvent<any>>>;
export declare const useContextMenuEvent: <DataType = any>() => Nullable<ContextMenuEvent<DataType>>;
export declare const useContextMenuTrigger: <RefType extends HTMLElement>(parameters: {
    menuId?: string | undefined;
    data?: any;
    ref?: React.RefObject<RefType> | undefined;
}) => React.RefObject<RefType>;
export declare const useMenuToggleMethods: (lastShowMenuEvent: Nullable<ContextMenuEvent<any>>, setShowMenuEvent: (event: Nullable<ContextMenuEvent<any>>) => void, onShow?: ((event: ContextMenuEvent<any>) => void) | undefined, onHide?: (() => void) | undefined) => [(event: ContextMenuEvent<any>) => void, () => void];
export declare const useMenuPlacementStyle: (wrapperRef: React.RefObject<HTMLElement>, lastShowMenuEvent: Nullable<ContextMenuEvent<any>>, setMenuPlacementStyle: (style: Nullable<React.CSSProperties>) => void) => void;
export declare const useInternalHandlers: (wrapperRef: React.RefObject<HTMLElement>, lastShowMenuEvent: Nullable<ContextMenuEvent<any>>, showMenu: (event: ContextMenuEvent<any>) => void, hideMenu: () => void, id?: string | undefined, global?: boolean | undefined, hideOnSelfClick?: boolean | undefined, hideOnOutsideClick?: boolean | undefined, hideOnEscape?: boolean | undefined, hideOnScroll?: boolean | undefined, hideOnWindowResize?: boolean | undefined) => void;
