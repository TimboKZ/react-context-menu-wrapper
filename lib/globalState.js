"use strict";
/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
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
var state;
exports.initWindowState = function () {
    state = {
        emitter: new events_1.EventEmitter(),
        localMenuHandlers: {},
        globalMenuHandlers: [],
        longPressTimeout: null,
        handlerDataMap: {},
    };
    window.__ReactContextMenuWrapper = state;
    document.body.addEventListener('contextmenu', handlers_1.GlobalHandlers.handleContextMenu);
    document.body.addEventListener('touchstart', handlers_1.GlobalHandlers.handleTouchStart);
    document.body.addEventListener('touchmove', handlers_1.GlobalHandlers.handleTouchMove);
    document.body.addEventListener('touchend', handlers_1.GlobalHandlers.handleTouchEnd);
    document.body.addEventListener('touchcancel', handlers_1.GlobalHandlers.handleTouchCancel);
};
exports.hideAllMenus = function () {
    state.emitter.emit(EventName.CloseAllMenus);
};
exports.addGenericListener = function (name, listener) {
    state.emitter.addListener(name, listener);
};
exports.removeGenericListener = function (name, listener) {
    state.emitter.removeListener(name, listener);
};
exports.addLocalMenuHandler = function (menuId, handler) {
    if (state.localMenuHandlers[menuId]) {
        util_1.warn("Detected duplicate menu id: " + menuId + ". Only the last one will be used.");
    }
    state.localMenuHandlers[menuId] = handler;
};
exports.getLocalMenuHandler = function (menuId) {
    return state.localMenuHandlers[menuId];
};
exports.removeLocalMenuHandler = function (menuId) {
    delete state.localMenuHandlers[menuId];
};
exports.addGlobalMenuHandler = function (handler) {
    if (state.globalMenuHandlers.length > 0) {
        util_1.warn('You have defined multiple global menus. Only the last one will be used');
    }
    state.globalMenuHandlers.push(handler);
};
exports.getGlobalMenuHandler = function () {
    if (state.globalMenuHandlers.length <= 0)
        return undefined;
    return state.globalMenuHandlers[state.globalMenuHandlers.length - 1];
};
exports.removeGlobalMenuHandler = function (handler) {
    var handlerIndex = state.globalMenuHandlers.indexOf(handler);
    if (handlerIndex !== -1)
        state.globalMenuHandlers.splice(handlerIndex);
};
exports.addLongPressTimeout = function (callback, timeout) {
    state.longPressTimeout = setTimeout(callback, timeout);
};
exports.hasLongPressTimeout = function () { return typeof state.longPressTimeout === 'number'; };
exports.clearLongPressTimeout = function () {
    var timeoutId = state.longPressTimeout;
    if (timeoutId === null)
        return;
    state.longPressTimeout = null;
    clearTimeout(timeoutId);
};
exports.generateHandlerDataId = function () { return shortid_1.default.generate(); };
exports.saveHandlerData = function (dataId, data) {
    if (data === undefined)
        return;
    state.handlerDataMap[dataId] = data;
};
exports.fetchHandlerData = function (dataId) {
    return state.handlerDataMap[dataId];
};
exports.deleteHandlerData = function (dataId) {
    delete state.handlerDataMap[dataId];
};
//# sourceMappingURL=globalState.js.map