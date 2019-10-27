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
var globalState_1 = require("./globalState");
var hooks_1 = require("./hooks");
var util_1 = require("./util");
var determineMenuPlacement = function (clientX, clientY, menuWidth, menuHeight) {
    var left, top;
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    if (util_1.isMobileDevice()) {
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
exports.ContextMenuWrapper = function (_a) {
    var id = _a.id, global = _a.global, children = _a.children, onShow = _a.onShow, onHide = _a.onHide;
    var _b = react_1.useState(null), lastShowMenuEvent = _b[0], setShowMenuEvent = _b[1];
    var _c = react_1.useState(null), placementStyle = _c[0], setPlacementStyle = _c[1];
    var showMenu = react_1.useCallback(function (event) {
        setShowMenuEvent(event);
        if (onShow)
            onShow(event);
    }, [onShow]);
    var hideMenu = react_1.useCallback(function () {
        setShowMenuEvent(null);
        if (onHide)
            onHide();
    }, [onHide]);
    var wrapperRef = react_1.useRef();
    react_1.useEffect(function () {
        if (lastShowMenuEvent) {
            var clientX = lastShowMenuEvent.clientX, clientY = lastShowMenuEvent.clientY;
            var menuWidth = 200;
            var menuHeight = 200;
            var current = wrapperRef.current;
            if (current) {
                menuWidth = current.offsetWidth;
                menuHeight = current.offsetHeight;
            }
            setPlacementStyle(determineMenuPlacement(clientX, clientY, menuWidth, menuHeight));
        }
        globalState_1.addGenericListener(globalState_1.EventName.CloseAllMenus, hideMenu);
        if (global)
            globalState_1.addGlobalMenuHandler(showMenu);
        else if (id)
            globalState_1.addLocalMenuHandler(id, showMenu);
        else
            util_1.warn('A menu should either be global or have an ID specified!');
        return function () {
            setPlacementStyle(null);
            globalState_1.removeGenericListener(globalState_1.EventName.CloseAllMenus, hideMenu);
            if (global)
                globalState_1.removeGlobalMenuHandler(showMenu);
            else if (id)
                globalState_1.removeLocalMenuHandler(id);
        };
    }, [lastShowMenuEvent, wrapperRef.current, id, global]);
    if (!lastShowMenuEvent)
        return null;
    var style = __assign({ position: 'fixed', zIndex: 999, left: -9999, top: -9999 }, placementStyle);
    return (react_1.default.createElement("div", { ref: wrapperRef, style: style },
        react_1.default.createElement(hooks_1.ContextMenuEventContext.Provider, { value: lastShowMenuEvent }, children)));
};
exports.ContextMenuWrapper.defaultProps = {
    global: false,
    hideOnSelfClick: true,
    hideOnOutsideClick: true,
    hideOnEscape: true,
    hideOnScroll: true,
    hideOnWindowResize: true,
};
//# sourceMappingURL=ContextMenuWrapper.js.map