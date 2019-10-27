export interface ContextMenuHandlerObject {
    onContextMenu: (event: MouseEvent) => void;
    'data-contextmenu-id': string;
    'data-contextmenu-data-id'?: string;
}
export declare const useContextMenuHandlers: (menuId: string, data?: any) => ContextMenuHandlerObject;
