export declare enum DataAttributes {
    MenuId = "data-contextmenu-menu-id",
    DataId = "data-contextmenu-data-id"
}
export declare enum ContextMenuEventType {
    Show = "Show",
    Hide = "Hide"
}
export interface ContextMenuEvent {
    type: ContextMenuEventType;
    clientX: number;
    clientY: number;
    data: any;
}
export declare const GlobalHandlers: {
    readonly handleContextMenu: (event: MouseEvent) => void;
};
export declare const LocalHandlers: {
    readonly handleContextMenu: (event: MouseEvent) => void;
};
