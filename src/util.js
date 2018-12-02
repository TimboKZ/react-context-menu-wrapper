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

export const EventName = {
    TryShowContextMenu: 'react-context-menu-wrapper-try-show',
    DoShowContextMenu: 'react-context-menu-wrapper-do-show',
    HideAllContextMenus: 'react-context-menu-wrapper-hide-all',
};

export const TriggerType = {
    Manual: 'manual', // When context menu is requested programmatically
    Global: 'global', // When requested via a global listener
    Local: 'local', // When requested via a local listener
};

export function windowExists() {
    return typeof window !== 'undefined';
}

export function initWindowState() {
    if (window._reactContextMenuWrapperData) return;

    window._reactContextMenuWrapper = {
        globalMenus: [], // Array of IDs of menus that are currently global
        lastTriggerDataMap: {}, // Map of event IDs to their last 'context-menu' events
        intentTimeout: null, // Holds the debounce timeout for context menu show intents
        intentWinner: null, // Holds the deepest menu intent at the moment debounce is triggered
    };

    document.addEventListener('contextmenu', globalContextMenuListener);
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

    dispatchWindowEvent(EventName.DoShowContextMenu, winner);
};

/**
 * Called by 'ContextMenuWrapper' instances when they receive a show request. This method is responsible for resolving
 * which context menu should actually be shown.
 *
 * Chooses the context menu associated with the bottom-most DOM node in the tree.
 *
 * @param {object} data
 * @param {string} [data.internalId]
 * @param {string} [data.externalId]
 * @param {*} data.eventDetails       The object that triggered the context menu event.
 * @param {*} [data.data]             Data associated with the trigger.
 */
export function registerShowIntent(data) {
    const store = window._reactContextMenuWrapper;

    // We know that whoever submitted the show intent is ready to show the context menu. Whether they win or not,
    // we can prevent the default behaviour of the event.
    if (data.eventDetails.preventDefault) data.eventDetails.preventDefault();

    if (store.intentWinner) {
        const ourDetails = data.eventDetails;
        if (ourDetails.triggerType === TriggerType.Global) {
            // Either the existing trigger is also global (which means it will be identical to us) or it is local,
            // in which case we would lose. Either way, we can just return.
            return;
        }

        const ourSource = ourDetails.triggerSource;
        const otherSource = store.intentWinner.eventDetails.triggerSource;

        // If we have high precedence than our opponent, we win the intent.
        if (ourSource.contains(otherSource)) {
            return;
        }
        // TODO: Handle the weird case when none of the sources contain the other.
    }

    store.intentWinner = data;
    clearTimeout(store.intentTimeout);
    store.intentTimeout = setTimeout(notifyIntentWinner, 5);
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

export function hideAllContextMenus() {
    dispatchWindowEvent(EventName.HideAllContextMenus);
}

/**
 * @param {object} data
 * @param {string} data.id      External ID of the context menu
 * @param {object} data.data    Data associated with the event
 * @param {Event} [data.event]  ContextMenu event that triggered the logic
 */
export const showContextMenu = (data) => {
    const eventDetails = {
        triggerType: TriggerType.Manual,
        preventDefault: () => event.preventDefault(),
        triggerSource: event.currentTarget,
        triggerTarget: event.target,
        x: event.clientX,
        y: event.clientY,
    };
    dispatchWindowEvent(EventName.TryShowContextMenu, {eventDetails, externalId: data.id, data: data.data});
};

/**
 * Prepares an object with handlers for different events
 * @param {string} externalId
 * @param {*} [data]
 */
export const prepareContextMenuHandlers = (externalId, data = null) => {
    return {
        onContextMenu: event => {
            const eventDetails = {
                triggerType: TriggerType.Local,
                preventDefault: () => event.preventDefault(),
                triggerSource: event.currentTarget,
                triggerTarget: event.target,
                x: event.clientX,
                y: event.clientY,
            };
            dispatchWindowEvent(EventName.TryShowContextMenu, {eventDetails, externalId, data});
        },
    };
};

function globalContextMenuListener(event) {
    const showIntent = {
        internalId: null,
        externalId: null,
        eventDetails: {
            triggerType: TriggerType.Global,
            preventDefault: () => event.preventDefault(),
            triggerSource: event.currentTarget,
            triggerTarget: event.target,
            x: event.clientX,
            y: event.clientY,
        },
        data: null, // TODO: Add a way to pass global data? Probably not, people can just use state for that.
    };
    registerShowIntent(showIntent);
}
