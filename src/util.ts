declare global {
    interface Window {
        __ReactContextMenuWrapper: {};
    }
}

export const initWindowState = () => {
    window.__ReactContextMenuWrapper = {};
};
