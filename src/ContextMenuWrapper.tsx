import React, { useCallback, useEffect, useState } from 'react';

import {
    addGenericListener,
    addGlobalMenuHandler,
    addLocalMenuHandler,
    ContextMenuEvent,
    EventName,
    removeGenericListener,
    removeGlobalMenuHandler,
    removeLocalMenuHandler,
} from './util';

export interface ContextMenuWrapperProps {
    id?: string;
    global?: boolean;
    render?: (event: ContextMenuEvent) => React.ElementType;

    onShow?: (event: ContextMenuEvent) => void;
    onHide?: (event: ContextMenuEvent) => void;

    hideOnSelfClick?: boolean;
    hideOnOutsideClick?: boolean;

    hideOnEscape?: boolean;
    hideOnScroll?: boolean;
    hideOnWindowResize?: boolean;
}

export const ContextMenuWrapper: React.FC<ContextMenuWrapperProps> = ({ id, global, render, onShow, onHide }) => {
    const [hidden, setHidden] = useState(true);
    const showMenu = useCallback(
        (event: ContextMenuEvent) => {
            setHidden(false);
            if (onShow) onShow(event);
        },
        [onShow]
    );
    const hideMenu = useCallback(
        (event: ContextMenuEvent) => {
            setHidden(true);
            if (onHide) onHide(event);
        },
        [onHide]
    );

    useEffect(() => {
        if (global) addGlobalMenuHandler(showMenu);
        else if (id) addLocalMenuHandler(id, showMenu);
        else {
            console.warn(
                '[react-context-menu-wrapper] One of your menus does not have an ID specified and' +
                    ' is not global. Users will have no way of triggering it.'
            );
        }

        addGenericListener(EventName.CloseAllMenus, hideMenu);
        return () => {
            if (global) removeGlobalMenuHandler(showMenu);
            else if (id) removeLocalMenuHandler(id, showMenu);

            removeGenericListener(EventName.CloseAllMenus, hideMenu);
        };
    }, [id, global]);

    return (
        <h1>
            Menu {id} is hidden: {`${hidden}`}
        </h1>
    );
};

ContextMenuWrapper.defaultProps = {
    id: undefined,
    global: false,
    render: undefined,

    onShow: undefined,
    onHide: undefined,

    hideOnSelfClick: true,
    hideOnOutsideClick: true,

    hideOnEscape: true,
    hideOnScroll: true,
    hideOnWindowResize: true,
};
