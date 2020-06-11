/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
import React from 'react';
import { ContextMenuEvent } from './handlers';
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
export declare const ContextMenuWrapper: React.FC<ContextMenuWrapperProps>;
