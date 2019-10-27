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
//# sourceMappingURL=hooks.js.map