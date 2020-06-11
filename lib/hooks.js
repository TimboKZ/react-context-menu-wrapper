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
exports.useContextMenuTrigger = function (parameters) {
    var menuId = parameters.menuId, data = parameters.data;
    // If user did not provide a ref, we simply generate a new one.
    var ref = parameters.ref ? parameters.ref : react_1.useRef(null);
    // Define data ID to be constant throughout the lifetime of the trigger.
    var dataId = exports.useLazyValue(function () { return globalState_1.generateHandlerDataId(); });
    react_1.useEffect(function () {
        globalState_1.saveHandlerData(dataId, data);
        return function () { return globalState_1.deleteHandlerData(dataId); };
    }, [data]);
    react_1.useEffect(function () {
        var current = ref.current;
        if (!current)
            return;
        if (menuId)
            current.setAttribute(handlers_1.DataAttributes.MenuId, menuId);
        current.setAttribute(handlers_1.DataAttributes.DataId, dataId);
        current.addEventListener('contextmenu', handlers_1.LocalHandlers.handleContextMenu);
        current.addEventListener('touchstart', handlers_1.LocalHandlers.handleTouchStart);
        current.addEventListener('touchmove', handlers_1.LocalHandlers.handleTouchMove);
        current.addEventListener('touchend', handlers_1.LocalHandlers.handleTouchEnd);
        current.addEventListener('touchcancel', handlers_1.LocalHandlers.handleTouchCancel);
        return function () {
            current.removeAttribute(handlers_1.DataAttributes.MenuId);
            current.removeAttribute(handlers_1.DataAttributes.DataId);
            current.removeEventListener('contextmenu', handlers_1.LocalHandlers.handleContextMenu);
            current.removeEventListener('touchstart', handlers_1.LocalHandlers.handleTouchStart);
            current.removeEventListener('touchmove', handlers_1.LocalHandlers.handleTouchMove);
            current.removeEventListener('touchend', handlers_1.LocalHandlers.handleTouchEnd);
            current.removeEventListener('touchcancel', handlers_1.LocalHandlers.handleTouchCancel);
        };
    }, [ref.current]);
    return ref;
};
exports.useMenuToggleMethods = function (lastShowMenuEvent, setShowMenuEvent, onShow, onHide) {
    var showMenu = react_1.useCallback(function (event) {
        setShowMenuEvent(event);
        if (onShow)
            onShow(event);
    }, [setShowMenuEvent, onShow]);
    var hideMenu = react_1.useCallback(function () {
        if (lastShowMenuEvent === null)
            return;
        setShowMenuEvent(null);
        if (onHide)
            onHide();
    }, [lastShowMenuEvent, setShowMenuEvent, onHide]);
    return [showMenu, hideMenu];
};
exports.useMenuPlacementStyle = function (wrapperRef, lastShowMenuEvent, setMenuPlacementStyle) {
    react_1.useEffect(function () {
        if (lastShowMenuEvent) {
            var clientX = lastShowMenuEvent.clientX, clientY = lastShowMenuEvent.clientY;
            var menuWidth = 200;
            var menuHeight = 200;
            if (wrapperRef.current) {
                menuWidth = wrapperRef.current.offsetWidth;
                menuHeight = wrapperRef.current.offsetHeight;
            }
            setMenuPlacementStyle(util_1.determineMenuPlacement(clientX, clientY, menuWidth, menuHeight));
        }
        return function () { return setMenuPlacementStyle(null); };
    }, [lastShowMenuEvent, wrapperRef.current]);
};
exports.useInternalHandlers = function (wrapperRef, lastShowMenuEvent, showMenu, hideMenu, id, global, hideOnSelfClick, hideOnOutsideClick, hideOnEscape, hideOnScroll, hideOnWindowResize) {
    var isVisible = !!lastShowMenuEvent;
    var handleClick = react_1.useCallback(function (event) {
        var node = wrapperRef.current;
        if (!node || !isVisible)
            return;
        var wasOutside = event.target !== node && !node.contains(event.target);
        if (wasOutside && hideOnOutsideClick) {
            hideMenu();
        }
        else if (hideOnSelfClick) {
            if (event.touches)
                setTimeout(function () { return hideMenu(); }, 200);
            else
                hideMenu();
        }
    }, [hideMenu, isVisible, wrapperRef.current, hideOnSelfClick, hideOnOutsideClick]);
    var handleKeydown = react_1.useCallback(function (event) {
        if (!isVisible)
            return;
        // Hide on escape
        if (event.key === 'Escape' || event.code === 'Escape')
            hideMenu();
    }, [hideMenu, isVisible]);
    react_1.useEffect(function () {
        document.addEventListener('click', handleClick);
        document.addEventListener('touchstart', handleClick);
        if (hideOnEscape)
            document.addEventListener('keydown', handleKeydown);
        if (hideOnScroll)
            document.addEventListener('scroll', hideMenu);
        if (hideOnWindowResize)
            window.addEventListener('resize', hideMenu);
        globalState_1.addGenericListener(globalState_1.EventName.CloseAllMenus, hideMenu);
        if (global)
            globalState_1.addGlobalMenuHandler(showMenu);
        else if (id)
            globalState_1.addLocalMenuHandler(id, showMenu);
        else
            util_1.warn('A menu should either be global or have an ID specified!');
        return function () {
            document.removeEventListener('click', handleClick);
            document.removeEventListener('touchstart', handleClick);
            if (hideOnEscape)
                document.removeEventListener('keydown', handleKeydown);
            if (hideOnScroll)
                document.removeEventListener('scroll', hideMenu);
            if (hideOnWindowResize)
                window.removeEventListener('resize', hideMenu);
            globalState_1.removeGenericListener(globalState_1.EventName.CloseAllMenus, hideMenu);
            if (global)
                globalState_1.removeGlobalMenuHandler(showMenu);
            else if (id)
                globalState_1.removeLocalMenuHandler(id);
        };
    }, [showMenu, hideMenu, id, global, handleClick, handleKeydown, hideOnEscape, hideOnScroll, hideOnWindowResize]);
};
//# sourceMappingURL=hooks.js.map