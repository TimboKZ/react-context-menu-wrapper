"use strict";
/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
var globalState_1 = require("./globalState");
var LONG_PRESS_DURATION_IN_MS = 420;
var DataAttributes;
(function (DataAttributes) {
    DataAttributes["MenuId"] = "data-contextmenu-menu-id";
    DataAttributes["DataId"] = "data-contextmenu-data-id";
})(DataAttributes = exports.DataAttributes || (exports.DataAttributes = {}));
var isTouchEvent = function (event) {
    return !!event.targetTouches;
};
var createMenuEvent = function (event, data) {
    var clientX;
    var clientY;
    if (isTouchEvent(event)) {
        var touch = event.targetTouches[0];
        clientX = touch.clientX;
        clientY = touch.clientY;
    }
    else {
        clientX = event.clientX;
        clientY = event.clientY;
    }
    return {
        clientX: clientX,
        clientY: clientY,
        data: data,
    };
};
var getData = function (target) {
    var data = undefined;
    if (target) {
        var dataId = target.getAttribute(DataAttributes.DataId);
        data = dataId ? globalState_1.fetchHandlerData(dataId) : undefined;
    }
    return data;
};
var GenericHandlers = {
    handleContextMenu: function (event, target) {
        // When menus are triggered using Ctrl + Right Click, we bring up the native context menu.
        if (event.ctrlKey)
            return;
        var menuId = target ? target.getAttribute(DataAttributes.MenuId) : null;
        var handler = menuId ? globalState_1.getLocalMenuHandler(menuId) : globalState_1.getGlobalMenuHandler();
        if (!handler)
            return;
        event.preventDefault();
        event.stopPropagation();
        var data = getData(target);
        var menuEvent = createMenuEvent(event, data);
        globalState_1.hideAllMenus();
        handler(menuEvent);
    },
    handleTouchStart: function (event, target) {
        var menuId = target ? target.getAttribute(DataAttributes.MenuId) : null;
        var handler = menuId ? globalState_1.getLocalMenuHandler(menuId) : globalState_1.getGlobalMenuHandler();
        if (!handler || globalState_1.hasLongPressTimeout())
            return;
        var data = getData(target);
        var menuEvent = createMenuEvent(event, data);
        globalState_1.addLongPressTimeout(function () {
            globalState_1.clearLongPressTimeout();
            globalState_1.hideAllMenus();
            handler(menuEvent);
        }, LONG_PRESS_DURATION_IN_MS);
    },
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    handleTouchCancel: function (event, target) { return globalState_1.clearLongPressTimeout(); },
};
exports.GlobalHandlers = {
    handleContextMenu: function (e) { return GenericHandlers.handleContextMenu(e, null); },
    handleTouchStart: function (e) { return GenericHandlers.handleTouchStart(e, null); },
    handleTouchMove: function (e) { return GenericHandlers.handleTouchCancel(e, null); },
    handleTouchEnd: function (e) { return GenericHandlers.handleTouchCancel(e, null); },
    handleTouchCancel: function (e) { return GenericHandlers.handleTouchCancel(e, null); },
};
exports.LocalHandlers = {
    handleContextMenu: function (e) { return GenericHandlers.handleContextMenu(e, e.currentTarget); },
    handleTouchStart: function (e) { return GenericHandlers.handleTouchStart(e, e.currentTarget); },
    handleTouchMove: function (e) { return GenericHandlers.handleTouchCancel(e, e.currentTarget); },
    handleTouchEnd: function (e) { return GenericHandlers.handleTouchCancel(e, e.currentTarget); },
    handleTouchCancel: function (e) { return GenericHandlers.handleTouchCancel(e, e.currentTarget); },
};
//# sourceMappingURL=handlers.js.map