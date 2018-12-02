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
    TryShowContextMenu: 'react-context-menu-wrapper-try-show',
    DoShowContextMenu: 'react-context-menu-wrapper-do-show',
    HideAllContextMenus: 'react-context-menu-wrapper-hide-all',
};

export function windowExists() {
    return typeof window !== 'undefined';
}

export function prepareDataStorage() {
    if (window._reactContextMenuWrapperData) return;

    window._reactContextMenuWrapper = {
        globalMenus: [], // Array of IDs of menus that are currently global
        lastTriggerDataMap: {}, // Map of event IDs to their last 'context-menu' events
        intentTimeout: null,
        intentWinner: null,
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

export function dispatchWindowEvent(eventName, detail = {}) {
    let event;
    if (typeof window.CustomEvent === 'function') {
        event = new window.CustomEvent(eventName, {detail});
    } else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(eventName, false, true, detail);
    }
    window.dispatchEvent(event);
}

const notifyIntentWinner = () => {
    const store = window._reactContextMenuWrapper;
    const winner = store.intentWinner;
    store.intentTimeout = null;
    store.intentWinner = null;
    if (!winner) return;

    dispatchWindowEvent(EventNames.DoShowContextMenu, winner);
    // console.log(`${winner.eventDetails.preventDefault ? 'Local' : 'Global'} won!`);
};

/**
 * Called by 'ContextMenuWrapper' instances when they receive a show request. This method is responsible for resolving
 * which context menu should actually be shown.
 *
 * Chooses the context menu associated with the bottom-most DOM node in the tree.
 *
 * @param {object} data
 * @param {string} data.internalId
 * @param {string} data.externalId
 * @param {object} data.eventDetails  The object that triggered the context menu event.
 * @param {*}      data.data          Data associated with the trigger.
 */
export function registerShowIntent(data) {
    const store = window._reactContextMenuWrapper;

    if (store.intentWinner) {
        const ourSource = data.eventDetails.triggerSource;
        const otherSource = store.intentWinner.eventDetails.triggerSource;

        // If we have high precedence than our opponent, we win the intent.
        if (ourSource.contains(otherSource)) {
            return;
        }
        // TODO: Handle the weird case when none of the sources contain the other.
    }
    // console.log(`${data.eventDetails.preventDefault ? 'Local' : 'Global'} proceeds!`);
    store.intentWinner = data;

    clearTimeout(store.intentTimeout);
    store.intentTimeout = setTimeout(notifyIntentWinner, 20);
}

export function setLastTriggerData(internalId, data) {
    const map = window._reactContextMenuWrapper.lastTriggerDataMap;
    map[internalId] = data;
}

export function getLastTriggerData(internalId) {
    const map = window._reactContextMenuWrapper.lastTriggerDataMap;
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
            const eventDetails = {
                preventDefault: event.preventDefault,
                triggerSource: event.currentTarget,
                triggerTarget: event.target,
                x: event.clientX,
                y: event.clientY,
            };
            dispatchWindowEvent(EventNames.TryShowContextMenu, {eventDetails, externalId, data});
        },
    };
};
