/**
 * @author v1ndic4te
 * @copyright 2018
 * @licence GPL-3.0
 */

export function warn(/*arguments*/) {
    const args = Array.prototype.slice.call(arguments);
    args.unshift('[react-context-menu-wrapper]');
    console.warn.apply(this, args);
}

export const EventNames = {
    ShowContextMenu: 'react-context-menu-wrapper-show',
    HideAllContextMenus: 'react-context-menu-wrapper-hide-all',
};

export function windowExists() {
    return typeof window !== 'undefined';
}

export function dispatchWindowEvent(eventName, detail = {}) {
    const event = new CustomEvent(eventName, {detail});
    window.dispatchEvent(event);
}

export function prepareDataStorage() {
    if (window._reactContextMenuWrapperData) return;

    window._reactContextMenuWrapper = {
        globalMenus: [], // Array of IDs of menus that are currently global
        lastEventMap: {}, // Map of event IDs to their last 'context-menu' events
    };
}

export function generateInternalId() {
    return Math.random().toString(36).substring(6);
}

export function registerGlobalContextMenu(internalId) {
    const menus = window._reactContextMenuWrapper.globalMenus;
    if (menus.length !== 0) {
        warn('You have registered multiple global context menus - menus will likely display incorrectly. It\'s ' +
            'recommended you only have one global context menu.');
    }
    menus.push(internalId);
}

export function removeGlobalContextMenu(internalId) {
    const menus = window._reactContextMenuWrapper.globalMenus;

    let index = menus.indexOf(internalId);
    if (index > -1) {
        menus.splice(index, 1);
    }
}

export function setLastTriggerData(internalId, data) {
    const map = window._reactContextMenuWrapper.lastEventMap;
    map[internalId] = data;
}

export function getLastTriggerData(internalId) {
    const map = window._reactContextMenuWrapper.lastEventMap;
    return map[internalId];
}

export function getPropertySize(node, property) {
    const value = window.getComputedStyle(node).getPropertyValue(property);
    return +value.replace(/[^\d.]+/g, '');
}

export function showContextMenu(id, event = null) {
    if (event) event.preventDefault();

}

export function hideAllContextMenus() {
    dispatchWindowEvent(EventNames.HideAllContextMenus);
}

/**
 * Prepares an object with handlers for different events
 * @param {string} externalId
 * @param {*} [data]
 */
export const prepareContextMenuHandlers = (externalId, data = null) => {
    return {
        onContextMenu: event => {
            dispatchWindowEvent(EventNames.ShowContextMenu, {event, externalId, data});
        },
    };
};
