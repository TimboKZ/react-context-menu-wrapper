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
exports.isMobileDevice = function () {
    return typeof window.orientation !== 'undefined' || navigator.userAgent.indexOf('IEMobile') !== -1;
};
//# sourceMappingURL=util.js.map