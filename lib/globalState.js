"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var shortid_1 = __importDefault(require("shortid"));
var handlers_1 = require("./handlers");
var util_1 = require("./util");
var EventName;
(function (EventName) {
    EventName["RequestMenu"] = "request_menu";
    EventName["RequestGlobalMenu"] = "request_global_menu";
    EventName["CloseAllMenus"] = "close_all_menus";
})(EventName = exports.EventName || (exports.EventName = {}));
var HideReason;
(function (HideReason) {
    HideReason[HideReason["Manual"] = 0] = "Manual";
})(HideReason = exports.HideReason || (exports.HideReason = {}));
exports.initWindowState = function () {
    window.__ReactContextMenuWrapper = {
        emitter: new events_1.EventEmitter(),
        localMenuHandlers: {},
        globalMenuHandlers: [],
        dataMap: {},
    };
    document.body.addEventListener('contextmenu', handlers_1.GlobalHandlers.handleContextMenu);
};
exports.hideAllMenus = function () {
    var emitter = window.__ReactContextMenuWrapper.emitter;
    emitter.emit(EventName.CloseAllMenus);
};
exports.addGenericListener = function (name, listener) {
    var emitter = window.__ReactContextMenuWrapper.emitter;
    emitter.addListener(name, listener);
};
exports.removeGenericListener = function (name, listener) {
    var emitter = window.__ReactContextMenuWrapper.emitter;
    emitter.removeListener(name, listener);
};
exports.addLocalMenuHandler = function (menuId, handler) {
    var localMenuHandlers = window.__ReactContextMenuWrapper.localMenuHandlers;
    if (localMenuHandlers[menuId]) {
        util_1.warn("Detected duplicate menu id: " + menuId + ". Only the last one will be used.");
    }
    localMenuHandlers[menuId] = handler;
};
exports.getLocalMenuHandler = function (menuId) {
    var localMenuHandlers = window.__ReactContextMenuWrapper.localMenuHandlers;
    return localMenuHandlers[menuId];
};
exports.removeLocalMenuHandler = function (menuId) {
    var localMenuHandlers = window.__ReactContextMenuWrapper.localMenuHandlers;
    delete localMenuHandlers[menuId];
};
exports.addGlobalMenuHandler = function (handler) {
    var globalMenuHandlers = window.__ReactContextMenuWrapper.globalMenuHandlers;
    if (globalMenuHandlers.length > 0) {
        util_1.warn('You have defined multiple global menus. Only the last one will be used');
    }
    globalMenuHandlers.push(handler);
};
exports.getGlobalMenuHandler = function () {
    var globalMenuHandlers = window.__ReactContextMenuWrapper.globalMenuHandlers;
    if (globalMenuHandlers.length <= 0)
        return undefined;
    return globalMenuHandlers[globalMenuHandlers.length - 1];
};
exports.removeGlobalMenuHandler = function (handler) {
    var globalMenuHandlers = window.__ReactContextMenuWrapper.globalMenuHandlers;
    var handlerIndex = globalMenuHandlers.indexOf(handler);
    if (handlerIndex !== -1)
        globalMenuHandlers.splice(handlerIndex);
};
exports.generateDataId = function () { return shortid_1.default.generate(); };
exports.saveData = function (dataId, data) {
    if (data === undefined)
        return;
    var dataMap = window.__ReactContextMenuWrapper.dataMap;
    dataMap[dataId] = data;
};
exports.fetchData = function (dataId) {
    var dataMap = window.__ReactContextMenuWrapper.dataMap;
    return dataMap[dataId];
};
exports.deleteData = function (dataId) {
    var dataMap = window.__ReactContextMenuWrapper.dataMap;
    delete dataMap[dataId];
};
//# sourceMappingURL=globalState.js.map