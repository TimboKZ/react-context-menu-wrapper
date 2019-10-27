import React from 'react';
import { ContextMenuEvent } from './handlers';
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
export declare const ContextMenuWrapper: React.FC<ContextMenuWrapperProps>;
