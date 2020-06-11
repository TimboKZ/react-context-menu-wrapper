import React, {CSSProperties, useCallback, useContext, useEffect, useRef} from 'react';
import {Nullable} from 'tsdef';

import {
    addGenericListener,
    addGlobalMenuHandler,
    addLocalMenuHandler,
    deleteHandlerData,
    EventName,
    generateHandlerDataId,
    removeGenericListener,
    removeGlobalMenuHandler,
    removeLocalMenuHandler,
    saveHandlerData,
} from './globalState';
import {ContextMenuEvent, DataAttributes, LocalHandlers} from './handlers';
import {determineMenuPlacement, warn} from './util';

const UNINITIALIZED_SENTINEL = {};
export const useLazyValue = <T>(factory: () => T): T => {
    const valueRef = useRef<T>(UNINITIALIZED_SENTINEL as T);
    if (valueRef.current === UNINITIALIZED_SENTINEL) valueRef.current = factory();
    return valueRef.current;
};

export const ContextMenuEventContext = React.createContext<Nullable<ContextMenuEvent>>(null);
export const useContextMenuEvent = (): Nullable<ContextMenuEvent> => {
    return useContext(ContextMenuEventContext);
};

export const useContextMenuTrigger = <RefType extends HTMLElement>(
    parameters: { id?: string; data?: any, ref?: React.RefObject<RefType> },
): React.RefObject<RefType> => {
    const {id, data} = parameters;

    // If user did not provide a ref, we simply generate a new one.
    const ref = parameters.ref ? parameters.ref : useRef<RefType>(null);

    // Define data ID to be constant throughout the lifetime of the trigger.
    const dataId = useLazyValue(() => generateHandlerDataId());

    useEffect(() => {
        saveHandlerData(dataId, data);
        return () => deleteHandlerData(dataId);
    }, [data]);

    useEffect(() => {
        const {current} = ref;
        if (!current) return;

        if (id) current.setAttribute(DataAttributes.MenuId, id);
        current.setAttribute(DataAttributes.DataId, dataId);
        current.addEventListener('contextmenu', LocalHandlers.handleContextMenu);
        current.addEventListener('touchstart', LocalHandlers.handleTouchStart);
        current.addEventListener('touchmove', LocalHandlers.handleTouchMove);
        current.addEventListener('touchend', LocalHandlers.handleTouchEnd);
        current.addEventListener('touchcancel', LocalHandlers.handleTouchCancel);

        return () => {
            current.removeAttribute(DataAttributes.MenuId);
            current.removeAttribute(DataAttributes.DataId);
            current.removeEventListener('contextmenu', LocalHandlers.handleContextMenu);
            current.removeEventListener('touchstart', LocalHandlers.handleTouchStart);
            current.removeEventListener('touchmove', LocalHandlers.handleTouchMove);
            current.removeEventListener('touchend', LocalHandlers.handleTouchEnd);
            current.removeEventListener('touchcancel', LocalHandlers.handleTouchCancel);
        };
    }, [ref.current]);

    return ref;
};

export const useMenuToggleMethods = (
    lastShowMenuEvent: Nullable<ContextMenuEvent>,
    setShowMenuEvent: (event: Nullable<ContextMenuEvent>) => void,
    onShow?: (event: ContextMenuEvent) => void,
    onHide?: () => void,
): [(event: ContextMenuEvent) => void, () => void] => {
    const showMenu = useCallback(
        (event: ContextMenuEvent) => {
            setShowMenuEvent(event);
            if (onShow) onShow(event);
        },
        [setShowMenuEvent, onShow],
    );
    const hideMenu = useCallback(() => {
        if (lastShowMenuEvent === null) return;
        setShowMenuEvent(null);
        if (onHide) onHide();
    }, [lastShowMenuEvent, setShowMenuEvent, onHide]);
    return [showMenu, hideMenu];
};

export const useMenuPlacementStyle = (
    wrapperRef: React.RefObject<HTMLElement>,
    lastShowMenuEvent: Nullable<ContextMenuEvent>,
    setMenuPlacementStyle: (style: Nullable<CSSProperties>) => void,
) => {
    useEffect(() => {
        if (lastShowMenuEvent) {
            const {clientX, clientY} = lastShowMenuEvent;

            let menuWidth = 200;
            let menuHeight = 200;
            if (wrapperRef.current) {
                menuWidth = wrapperRef.current.offsetWidth;
                menuHeight = wrapperRef.current.offsetHeight;
            }

            setMenuPlacementStyle(determineMenuPlacement(clientX, clientY, menuWidth, menuHeight));
        }

        return () => setMenuPlacementStyle(null);
    }, [lastShowMenuEvent, wrapperRef.current]);
};

export const useInternalHandlers = (
    wrapperRef: React.RefObject<HTMLElement>,
    lastShowMenuEvent: Nullable<ContextMenuEvent>,
    showMenu: (event: ContextMenuEvent) => void,
    hideMenu: () => void,
    id?: string,
    global?: boolean,
    hideOnSelfClick?: boolean,
    hideOnOutsideClick?: boolean,
    hideOnEscape?: boolean,
    hideOnScroll?: boolean,
    hideOnWindowResize?: boolean,
) => {
    const isVisible = !!lastShowMenuEvent;
    const handleClick = useCallback(
        (event: MouseEvent & TouchEvent) => {
            const node = wrapperRef.current;
            if (!node || !isVisible) return;

            const wasOutside = event.target !== node && !node.contains(event.target as Node);
            if (wasOutside && hideOnOutsideClick) {
                hideMenu();
            } else if (hideOnSelfClick) {
                if (event.touches) setTimeout(() => hideMenu(), 200);
                else hideMenu();
            }
        },
        [hideMenu, isVisible, wrapperRef.current, hideOnSelfClick, hideOnOutsideClick],
    );
    const handleKeydown = useCallback(
        (event: KeyboardEvent) => {
            if (!isVisible) return;
            // Hide on escape
            if (event.key === 'Escape' || event.code === 'Escape') hideMenu();
        },
        [hideMenu, isVisible],
    );

    useEffect(() => {
        document.addEventListener('click', handleClick);
        document.addEventListener('touchstart', handleClick);

        if (hideOnEscape) document.addEventListener('keydown', handleKeydown);
        if (hideOnScroll) document.addEventListener('scroll', hideMenu);
        if (hideOnWindowResize) window.addEventListener('resize', hideMenu);

        addGenericListener(EventName.CloseAllMenus, hideMenu);
        if (global) addGlobalMenuHandler(showMenu);
        else if (id) addLocalMenuHandler(id, showMenu);
        else warn('A menu should either be global or have an ID specified!');

        return () => {
            document.removeEventListener('click', handleClick);
            document.removeEventListener('touchstart', handleClick);
            if (hideOnEscape) document.removeEventListener('keydown', handleKeydown);
            if (hideOnScroll) document.removeEventListener('scroll', hideMenu);
            if (hideOnWindowResize) window.removeEventListener('resize', hideMenu);

            removeGenericListener(EventName.CloseAllMenus, hideMenu);
            if (global) removeGlobalMenuHandler(showMenu);
            else if (id) removeLocalMenuHandler(id);
        };
    }, [showMenu, hideMenu, id, global, handleClick, handleKeydown, hideOnEscape, hideOnScroll, hideOnWindowResize]);
};
