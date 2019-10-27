import React from 'react';
import { ContextMenuEvent } from './util';
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
export declare const ContextMenuWrapper: React.FC<ContextMenuWrapperProps>;
