import React from 'react';

export interface ContextMenuEvent {
    data?: any;
}

export interface ContextMenuWrapperProps {
    id?: string;
    global?: boolean;
    render?: (event: ContextMenuEvent) => React.ElementType;

    onShow?: (itemId?: string) => void;
    onHide?: (itemId?: string) => void;

    hideOnSelfClick?: boolean;
    hideOnOutsideClick?: boolean;

    hideOnEscape?: boolean;
    hideOnScroll?: boolean;
    hideOnWindowResize?: boolean;
}

export const ContextMenuWrapper: React.FC<ContextMenuWrapperProps> = ({ id }) => {
    return <h1>ContextMenuWrapper component {id}</h1>;
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
