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
var util_1 = require("./util");
exports.ContextMenuWrapper = function (_a) {
    var id = _a.id, global = _a.global, render = _a.render, onShow = _a.onShow, onHide = _a.onHide;
    var _b = react_1.useState(true), hidden = _b[0], setHidden = _b[1];
    var showMenu = react_1.useCallback(function (event) {
        setHidden(false);
        if (onShow)
            onShow(event);
    }, [onShow]);
    var hideMenu = react_1.useCallback(function (event) {
        setHidden(true);
        if (onHide)
            onHide(event);
    }, [onHide]);
    react_1.useEffect(function () {
        if (global)
            util_1.addGlobalMenuHandler(showMenu);
        else if (id)
            util_1.addLocalMenuHandler(id, showMenu);
        else {
            console.warn('[react-context-menu-wrapper] One of your menus does not have an ID specified and' +
                ' is not global. Users will have no way of triggering it.');
        }
        util_1.addGenericListener(util_1.EventName.CloseAllMenus, hideMenu);
        return function () {
            if (global)
                util_1.removeGlobalMenuHandler(showMenu);
            else if (id)
                util_1.removeLocalMenuHandler(id, showMenu);
            util_1.removeGenericListener(util_1.EventName.CloseAllMenus, hideMenu);
        };
    }, [id, global]);
    return (react_1.default.createElement("h1", null,
        "Menu ",
        id,
        " is hidden: ", "" + hidden));
};
exports.ContextMenuWrapper.defaultProps = {
    id: undefined,
    global: false,
    render: undefined,
    onShow: undefined,
    onHide: undefined,
    hideOnSelfClick: true,
    hideOnOutsideClick: true,
    hideOnEscape: true,
    hideOnScroll: true,
    hideOnWindowResize: true,
};
//# sourceMappingURL=ContextMenuWrapper.js.map