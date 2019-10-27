"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var globalState_1 = require("./globalState");
var DataAttributes;
(function (DataAttributes) {
    DataAttributes["MenuId"] = "data-contextmenu-menu-id";
    DataAttributes["DataId"] = "data-contextmenu-data-id";
})(DataAttributes = exports.DataAttributes || (exports.DataAttributes = {}));
var ContextMenuEventType;
(function (ContextMenuEventType) {
    ContextMenuEventType["Show"] = "Show";
    ContextMenuEventType["Hide"] = "Hide";
})(ContextMenuEventType = exports.ContextMenuEventType || (exports.ContextMenuEventType = {}));
var createMenuEvent = function (type, mouseEvent, data) {
    return {
        type: type,
        clientX: mouseEvent.clientX,
        clientY: mouseEvent.clientY,
        data: data,
    };
};
var extractMenuData = function (target) {
    if (!target) {
        // If target is not set, we were triggered by a global context menu event so there's
        // nothing we can extract here.
        return [null, undefined];
    }
    var menuId = target.getAttribute(DataAttributes.MenuId);
    var dataId = target.getAttribute(DataAttributes.DataId);
    var data = dataId ? globalState_1.fetchData(dataId) : undefined;
    return [menuId, data];
};
var GenericHandlers = {
    handleContextMenu: function (event, handlerTarget) {
        var _a = extractMenuData(handlerTarget), menuId = _a[0], data = _a[1];
        var handler;
        if (menuId)
            handler = globalState_1.getLocalMenuHandler(menuId);
        else
            handler = globalState_1.getGlobalMenuHandler();
        if (!handler)
            return;
        event.preventDefault();
        event.stopPropagation();
        globalState_1.hideAllMenus();
        var menuEvent = createMenuEvent(ContextMenuEventType.Show, event, data);
        handler(menuEvent);
    },
};
exports.GlobalHandlers = {
    handleContextMenu: function (event) { return GenericHandlers.handleContextMenu(event, null); },
};
exports.LocalHandlers = {
    handleContextMenu: function (event) {
        return GenericHandlers.handleContextMenu(event, event.currentTarget);
    },
};
//# sourceMappingURL=handlers.js.map