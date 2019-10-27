"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var util_1 = require("./util");
exports.useContextMenuHandlers = function (menuId, data) {
    var handlers = {
        onContextMenu: util_1.handleContextMenu,
        'data-contextmenu-id': menuId,
    };
    react_1.useEffect(function () {
        var dataId = util_1.saveData(data);
        if (dataId)
            handlers['data-contextmenu-data-id'] = dataId;
        return function () {
            if (dataId)
                util_1.deleteData(dataId);
        };
    });
    return handlers;
};
//# sourceMappingURL=hooks.js.map