import React, { CSSProperties, useRef, useState } from 'react';
import { Nullable } from 'tsdef';

import { ContextMenuEvent } from './handlers';
import { ContextMenuEventContext, useInternalHandlers, useMenuPlacementStyle, useMenuToggleMethods } from './hooks';

export interface ContextMenuWrapperProps {
    /**
     * A unique ID that will be used to trigger this context menu from other components on the page. Global menus don't
     * use IDs.
     */
    id?: string;
    /**
     * Determines whether this context menu should replace the default context meu of your browser.
     * If this is set, `id` is ignored.
     */
    global?: boolean;
    children?: React.ReactElement;

    /**
     * Callback that is triggered after the menu has appeared.
     */
    onShow?: (event: ContextMenuEvent) => void;
    /**
     * Callback that is triggered after the menu has been dismissed.
     */
    onHide?: () => void;

    /**
     * Makes context menu disappear when user clicks (or taps) anywhere inside of the menu.
     */
    hideOnSelfClick?: boolean;
    /**
     * Makes context menu disappear when user clicks (or taps) anywhere outside of the menu.
     */
    hideOnOutsideClick?: boolean;

    /**
     * Makes context menu disappear when user presses the Escape key.
     */
    hideOnEscape?: boolean;
    /**
     * Makes context menu disappear when page is scrolled.
     */
    hideOnScroll?: boolean;
    /**
     * Makes context menu disappear when window is resized.
     */
    hideOnWindowResize?: boolean;
}

export const ContextMenuWrapper: React.FC<ContextMenuWrapperProps> = ({
    id,
    global,
    children,
    onShow,
    onHide,
    hideOnSelfClick,
    hideOnOutsideClick,
    hideOnEscape,
    hideOnScroll,
    hideOnWindowResize,
}) => {
    const wrapperRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const [lastShowMenuEvent, setShowMenuEvent] = useState<Nullable<ContextMenuEvent>>(null);
    const [placementStyle, setMenuPlacementStyle] = useState<Nullable<CSSProperties>>(null);
    const [showMenu, hideMenu] = useMenuToggleMethods(lastShowMenuEvent, setShowMenuEvent, onShow, onHide);
    useInternalHandlers(
        wrapperRef,
        lastShowMenuEvent,
        showMenu,
        hideMenu,
        id,
        global,
        hideOnSelfClick,
        hideOnOutsideClick,
        hideOnEscape,
        hideOnScroll,
        hideOnWindowResize
    );
    useMenuPlacementStyle(wrapperRef, lastShowMenuEvent, setMenuPlacementStyle);

    if (!lastShowMenuEvent) return null;

    const style: CSSProperties = {
        position: 'fixed',
        zIndex: 999,
        left: -9999,
        top: -9999,
        ...placementStyle,
    };
    return (
        <div ref={wrapperRef} style={style}>
            <ContextMenuEventContext.Provider value={lastShowMenuEvent}>{children}</ContextMenuEventContext.Provider>
        </div>
    );
};

ContextMenuWrapper.defaultProps = {
    id: undefined,
    global: false,

    onShow: undefined,
    onHide: undefined,

    hideOnSelfClick: true,
    hideOnOutsideClick: true,

    hideOnEscape: true,
    hideOnScroll: true,
    hideOnWindowResize: true,
};
