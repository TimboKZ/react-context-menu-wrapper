"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var globalState_1 = require("./globalState");
globalState_1.initWindowState();
var ContextMenuWrapper_1 = require("./ContextMenuWrapper");
exports.ContextMenuWrapper = ContextMenuWrapper_1.ContextMenuWrapper;
var hooks_1 = require("./hooks");
exports.useContextMenuEvent = hooks_1.useContextMenuEvent;
exports.useContextMenuHandlers = hooks_1.useContextMenuHandlers;
//# sourceMappingURL=index.js.map