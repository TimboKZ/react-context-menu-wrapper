"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var shortid_1 = __importDefault(require("shortid"));
var events_1 = require("events");
var EventName;
(function (EventName) {
    EventName["RequestMenu"] = "request_menu";
    EventName["RequestGlobalMenu"] = "request_global_menu";
    EventName["CloseAllMenus"] = "close_all_menus";
})(EventName = exports.EventName || (exports.EventName = {}));
exports.initWindowState = function () {
    window.__ReactContextMenuWrapper = {
        emitter: new events_1.EventEmitter(),
        localMenuHandlers: {},
        globalMenuHandlers: [],
        dataMap: {},
    };
};
exports.addGenericListener = function (name, listener) {
    var emitter = window.__ReactContextMenuWrapper.emitter;
    emitter.addListener(name, listener);
};
exports.removeGenericListener = function (name, listener) {
    var emitter = window.__ReactContextMenuWrapper.emitter;
    emitter.removeListener(name, listener);
};
exports.addLocalMenuHandler = function (externalId, handler) {
    var localMenuHandlers = window.__ReactContextMenuWrapper.localMenuHandlers;
    if (localMenuHandlers[externalId]) {
        console.warn("[react-context-menu-wrapper] Detected duplicate menu id: " + externalId);
    }
    localMenuHandlers[externalId] = handler;
};
exports.removeLocalMenuHandler = function (externalId, handler) {
    var localMenuHandlers = window.__ReactContextMenuWrapper.localMenuHandlers;
    delete localMenuHandlers[externalId];
};
exports.addGlobalMenuHandler = function (handler) {
    var globalMenuHandlers = window.__ReactContextMenuWrapper.globalMenuHandlers;
    if (globalMenuHandlers.length > 0) {
        console.warn("[react-context-menu-wrapper] You have defined multiple global IDs - user experience might suffer.");
    }
    globalMenuHandlers.push(handler);
};
exports.removeGlobalMenuHandler = function (handler) {
    var globalMenuHandlers = window.__ReactContextMenuWrapper.globalMenuHandlers;
    var handlerIndex = globalMenuHandlers.indexOf(handler);
    if (handlerIndex !== -1)
        globalMenuHandlers.splice(handlerIndex);
};
exports.saveData = function (data) {
    if (data === undefined)
        return null;
    var dataMap = window.__ReactContextMenuWrapper.dataMap;
    var randomId = shortid_1.default.generate();
    dataMap[randomId] = data;
    return randomId;
};
exports.fetchData = function (dataId) {
    var dataMap = window.__ReactContextMenuWrapper.dataMap;
    return dataMap[dataId];
};
exports.deleteData = function (dataId) {
    var dataMap = window.__ReactContextMenuWrapper.dataMap;
    delete dataMap[dataId];
};
exports.handleContextMenu = function (event) {
    console.log(event);
};
//# sourceMappingURL=util.js.map