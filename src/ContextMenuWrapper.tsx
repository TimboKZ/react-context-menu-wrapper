import React, { CSSProperties, useRef, useState } from 'react';
import { Nullable } from 'tsdef';

import { ContextMenuEvent } from './handlers';
import { ContextMenuEventContext, useInternalHandlers, useMenuPlacementStyle, useMenuToggleMethods } from './hooks';

export interface ContextMenuWrapperProps {
    id?: string;
    global?: boolean;
    children?: React.ReactElement;

    onShow?: (event: ContextMenuEvent) => void;
    onHide?: () => void;

    hideOnSelfClick?: boolean;
    hideOnOutsideClick?: boolean;

    hideOnEscape?: boolean;
    hideOnScroll?: boolean;
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
