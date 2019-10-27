import React, { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import { Nullable } from 'tsdef';

import {
    addGenericListener,
    addGlobalMenuHandler,
    addLocalMenuHandler,
    EventName,
    removeGenericListener,
    removeGlobalMenuHandler,
    removeLocalMenuHandler,
} from './globalState';
import { ContextMenuEvent } from './handlers';
import { ContextMenuEventContext } from './hooks';
import { isMobileDevice, warn } from './util';

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

const determineMenuPlacement = (
    clientX: number,
    clientY: number,
    menuWidth: number,
    menuHeight: number
): { left: number; top: number } => {
    let left, top;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    if (isMobileDevice()) {
        // On mobile devices, horizontally centre the menu on the tap, and place it above the tap
        const halfWidth = menuWidth / 2;
        left = clientX - halfWidth;
        top = clientY - menuHeight - 20;
    } else {
        // On desktop, mimic native context menu placement
        const placeToTheLeftOfCursor = windowWidth - clientX > menuWidth;
        const placeBelowCursor = windowHeight - clientY > menuHeight;
        left = placeToTheLeftOfCursor ? clientX : clientX - menuWidth;
        top = placeBelowCursor ? clientY : clientY - menuHeight;
    }

    // If menu overflows the page, try to nudge it in the correct direction, applying a small buffer
    const buffer = 5;
    const right = windowWidth - left - menuWidth;
    const bottom = windowHeight - top - menuHeight;
    if (right < 0) left += right - buffer;
    if (bottom < 0) top += bottom - buffer;
    if (left < 0) left = buffer;
    if (top < 0) top = buffer;

    return {
        left,
        top,
    };
};

export const ContextMenuWrapper: React.FC<ContextMenuWrapperProps> = ({ id, global, children, onShow, onHide }) => {
    const [lastShowMenuEvent, setShowMenuEvent] = useState<Nullable<ContextMenuEvent>>(null);
    const [placementStyle, setPlacementStyle] = useState<Nullable<CSSProperties>>(null);
    const showMenu = useCallback(
        (event: ContextMenuEvent) => {
            setShowMenuEvent(event);
            if (onShow) onShow(event);
        },
        [onShow]
    );
    const hideMenu = useCallback(() => {
        setShowMenuEvent(null);
        if (onHide) onHide();
    }, [onHide]);

    const wrapperRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    useEffect(() => {
        if (lastShowMenuEvent) {
            const { clientX, clientY } = lastShowMenuEvent;

            let menuWidth = 200;
            let menuHeight = 200;
            const { current } = wrapperRef;
            if (current) {
                menuWidth = current.offsetWidth;
                menuHeight = current.offsetHeight;
            }

            setPlacementStyle(determineMenuPlacement(clientX, clientY, menuWidth, menuHeight));
        }

        addGenericListener(EventName.CloseAllMenus, hideMenu);
        if (global) addGlobalMenuHandler(showMenu);
        else if (id) addLocalMenuHandler(id, showMenu);
        else warn('A menu should either be global or have an ID specified!');

        return () => {
            setPlacementStyle(null);
            removeGenericListener(EventName.CloseAllMenus, hideMenu);
            if (global) removeGlobalMenuHandler(showMenu);
            else if (id) removeLocalMenuHandler(id);
        };
    }, [lastShowMenuEvent, wrapperRef.current, id, global]);

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
    global: false,

    hideOnSelfClick: true,
    hideOnOutsideClick: true,

    hideOnEscape: true,
    hideOnScroll: true,
    hideOnWindowResize: true,
};
