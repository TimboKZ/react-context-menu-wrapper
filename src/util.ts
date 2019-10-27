export const warn = (...args: any[]) => {
    const parts: any = [`[react-context-menu-wrapper]`].concat(args);
    // eslint-disable-next-line no-console
    console.warn.apply(null, parts);
};

export const isMobileDevice =
    typeof window.orientation !== 'undefined' || navigator.userAgent.indexOf('IEMobile') !== -1;
export const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

export const determineMenuPlacement = (
    clientX: number,
    clientY: number,
    menuWidth: number,
    menuHeight: number
): { left: number; top: number } => {
    let left, top;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    if (isMobileDevice) {
        // On mobile devices, horizontally centre the menu on the tap, and place it above the tap
        const halfWidth = menuWidth / 2;
        left = clientX - halfWidth;
        top = clientY - menuHeight - 20;
    } else {
        // On desktop, mimic native context menu placement
        const placeToTheLeftOfCursor = windowWidth - clientX > menuWidth;
        const placeBelowCursor = windowHeight - clientY > menuHeight;
        left = placeToTheLeftOfCursor ? clientX : clientX - menuWidth;
        top = placeBelowCursor ? clientY : clientY - menuHeight;
    }

    // If menu overflows the page, try to nudge it in the correct direction, applying a small buffer
    const buffer = 5;
    const right = windowWidth - left - menuWidth;
    const bottom = windowHeight - top - menuHeight;
    if (right < 0) left += right - buffer;
    if (bottom < 0) top += bottom - buffer;
    if (left < 0) left = buffer;
    if (top < 0) top = buffer;

    return {
        left,
        top,
    };
};
