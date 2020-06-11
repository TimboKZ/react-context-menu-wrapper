/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
export declare enum DataAttributes {
    MenuId = "data-contextmenu-menu-id",
    DataId = "data-contextmenu-data-id"
}
export interface ContextMenuEvent<DataType = any> {
    clientX: number;
    clientY: number;
    data: DataType;
}
export declare const GlobalHandlers: {
    readonly handleContextMenu: (e: MouseEvent) => void;
    readonly handleTouchStart: (e: TouchEvent) => void;
    readonly handleTouchMove: (e: TouchEvent) => void;
    readonly handleTouchEnd: (e: TouchEvent) => void;
    readonly handleTouchCancel: (e: TouchEvent) => void;
};
export declare const LocalHandlers: {
    readonly handleContextMenu: (e: MouseEvent) => void;
    readonly handleTouchStart: (e: TouchEvent) => void;
    readonly handleTouchMove: (e: TouchEvent) => void;
    readonly handleTouchEnd: (e: TouchEvent) => void;
    readonly handleTouchCancel: (e: TouchEvent) => void;
};
