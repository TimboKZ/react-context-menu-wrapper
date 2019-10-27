"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.warn = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var parts = ["[react-context-menu-wrapper]"].concat(args);
    // eslint-disable-next-line no-console
    console.warn.apply(null, parts);
};
exports.isMobileDevice = typeof window.orientation !== 'undefined' || navigator.userAgent.indexOf('IEMobile') !== -1;
exports.isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
exports.determineMenuPlacement = function (clientX, clientY, menuWidth, menuHeight) {
    var left, top;
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    if (exports.isMobileDevice) {
        // On mobile devices, horizontally centre the menu on the tap, and place it above the tap
        var halfWidth = menuWidth / 2;
        left = clientX - halfWidth;
        top = clientY - menuHeight - 20;
    }
    else {
        // On desktop, mimic native context menu placement
        var placeToTheLeftOfCursor = windowWidth - clientX > menuWidth;
        var placeBelowCursor = windowHeight - clientY > menuHeight;
        left = placeToTheLeftOfCursor ? clientX : clientX - menuWidth;
        top = placeBelowCursor ? clientY : clientY - menuHeight;
    }
    // If menu overflows the page, try to nudge it in the correct direction, applying a small buffer
    var buffer = 5;
    var right = windowWidth - left - menuWidth;
    var bottom = windowHeight - top - menuHeight;
    if (right < 0)
        left += right - buffer;
    if (bottom < 0)
        top += bottom - buffer;
    if (left < 0)
        left = buffer;
    if (top < 0)
        top = buffer;
    return {
        left: left,
        top: top,
    };
};
//# sourceMappingURL=util.js.map