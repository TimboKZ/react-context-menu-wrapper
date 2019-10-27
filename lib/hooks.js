"use strict";
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
var handlers_1 = require("./handlers");
var util_1 = require("./util");
var UNINITIALIZED_SENTINEL = {};
exports.useLazyValue = function (factory) {
    var valueRef = react_1.useRef(UNINITIALIZED_SENTINEL);
    if (valueRef.current === UNINITIALIZED_SENTINEL)
        valueRef.current = factory();
    return valueRef.current;
};
exports.ContextMenuEventContext = react_1.default.createContext(null);
exports.useContextMenuEvent = function () {
    return react_1.useContext(exports.ContextMenuEventContext);
};
exports.useContextMenuHandlers = function (ref, _a) {
    var id = _a.id, data = _a.data;
    var dataId = exports.useLazyValue(function () { return globalState_1.generateDataId(); });
    react_1.useEffect(function () {
        globalState_1.saveData(dataId, data);
        return function () { return globalState_1.deleteData(dataId); };
    }, [data]);
    react_1.useEffect(function () {
        var current = ref.current;
        if (!current)
            return;
        if (id)
            current.setAttribute(handlers_1.DataAttributes.MenuId, id);
        current.setAttribute(handlers_1.DataAttributes.DataId, dataId);
        current.addEventListener('contextmenu', handlers_1.LocalHandlers.handleContextMenu);
        return function () {
            current.removeAttribute(handlers_1.DataAttributes.MenuId);
            current.removeAttribute(handlers_1.DataAttributes.DataId);
            current.removeEventListener('contextmenu', handlers_1.LocalHandlers.handleContextMenu);
        };
    }, [ref.current]);
};
exports.useMenuToggleMethods = function (lastShowMenuEvent, setShowMenuEvent, onShow, onHide) {
    var showMenu = react_1.useCallback(function (event) {
        setShowMenuEvent(event);
        if (onShow)
            onShow(event);
    }, [onShow]);
    var hideMenu = react_1.useCallback(function () {
        if (lastShowMenuEvent === null)
            return;
        setShowMenuEvent(null);
        if (onHide)
            onHide();
    }, [lastShowMenuEvent, onHide]);
    return [showMenu, hideMenu];
};
exports.useMenuPlacementStyle = function (lastShowMenuEvent, setMenuPlacementStyle, wrapperRef) {
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
            setMenuPlacementStyle(util_1.determineMenuPlacement(clientX, clientY, menuWidth, menuHeight));
        }
        return function () { return setMenuPlacementStyle(null); };
    }, [lastShowMenuEvent, wrapperRef.current]);
};
exports.useInternalHandlers = function (showMenu, hideMenu, id, global, hideOnSelfClick, hideOnOutsideClick, hideOnEscape, hideOnScroll, hideOnWindowResize) {
    react_1.useEffect(function () {
        globalState_1.addGenericListener(globalState_1.EventName.CloseAllMenus, hideMenu);
        if (global)
            globalState_1.addGlobalMenuHandler(showMenu);
        else if (id)
            globalState_1.addLocalMenuHandler(id, showMenu);
        else
            util_1.warn('A menu should either be global or have an ID specified!');
        return function () {
            globalState_1.removeGenericListener(globalState_1.EventName.CloseAllMenus, hideMenu);
            if (global)
                globalState_1.removeGlobalMenuHandler(showMenu);
            else if (id)
                globalState_1.removeLocalMenuHandler(id);
        };
    }, [showMenu, hideMenu, id, global]);
};
//# sourceMappingURL=hooks.js.map