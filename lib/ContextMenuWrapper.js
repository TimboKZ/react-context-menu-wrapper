"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var hooks_1 = require("./hooks");
exports.ContextMenuWrapper = function (_a) {
    var id = _a.id, global = _a.global, children = _a.children, onShow = _a.onShow, onHide = _a.onHide, hideOnSelfClick = _a.hideOnSelfClick, hideOnOutsideClick = _a.hideOnOutsideClick, hideOnEscape = _a.hideOnEscape, hideOnScroll = _a.hideOnScroll, hideOnWindowResize = _a.hideOnWindowResize;
    var _b = react_1.useState(null), lastShowMenuEvent = _b[0], setShowMenuEvent = _b[1];
    var _c = react_1.useState(null), placementStyle = _c[0], setMenuPlacementStyle = _c[1];
    var _d = hooks_1.useMenuToggleMethods(lastShowMenuEvent, setShowMenuEvent, onShow, onHide), showMenu = _d[0], hideMenu = _d[1];
    hooks_1.useInternalHandlers(showMenu, hideMenu, id, global, hideOnSelfClick, hideOnOutsideClick, hideOnEscape, hideOnScroll, hideOnWindowResize);
    var wrapperRef = react_1.useRef();
    hooks_1.useMenuPlacementStyle(lastShowMenuEvent, setMenuPlacementStyle, wrapperRef);
    if (!lastShowMenuEvent)
        return null;
    var style = __assign({ position: 'fixed', zIndex: 999, left: -9999, top: -9999 }, placementStyle);
    return (react_1.default.createElement("div", { ref: wrapperRef, style: style },
        react_1.default.createElement(hooks_1.ContextMenuEventContext.Provider, { value: lastShowMenuEvent }, children)));
};
exports.ContextMenuWrapper.defaultProps = {
    id: undefined,
    global: false,
    onShow: undefined,
    onHide: undefined,
    hideOnSelfClick: true,
    hideOnOutsideClick: true,
    hideOnEscape: true,
    hideOnScroll: true,
    hideOnWindowResize: true,
};
//# sourceMappingURL=ContextMenuWrapper.js.map