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

export const ContextMenuEvent = {
    Show: 'show',
    Hide: 'hide',
};

export const InternalEvent = {
    TryShowContextMenu: '__rcmw-try-show',
    DoShowContextMenu: '__rcmw-do-show',
    HideAllContextMenus: '__rcmw-hide-all',
};

export const TriggerType = {
    Manual: 'manual', // When context menu is requested programmatically
    Native: 'native', // When context menu is requested via an input event
};

export const TriggerContext = {
    Local: 'local', // When requested via a local listener
    Global: 'global', // When requested via a global listener
    Cancel: 'cancel', // When a cancel event is requested
};

export function getPropertySize(node, property) {
    try {
        const value = window.getComputedStyle(node).getPropertyValue(property);
        return +value.replace(/[^\d.]+/g, '');
    } catch (error) {
        // Bad property, object, doesn't matter.
        return 0;
    }
}

export const extractEventDetails = event => {
    let coordsObject = event;
    if (event.targetTouches) coordsObject = event.targetTouches[0];
    return {
        preventDefault: event.cancelable ? () => event.preventDefault() : null,
        triggerSource: event.currentTarget,
        triggerTarget: event.target,
        x: coordsObject.clientX,
        y: coordsObject.clientY,
    };
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

        globalTouchTimeout: null, // Touch event timeout for global context menus
        touchTimeoutMap: {}, // Map of touch event timeouts for different IDs

        globalContextMenuEventListeners: [], // Array of global listeners defined by the user
        contextMenuEventListenersMap: {}, // Map of ID listeners defined by the user

        holdToShowInterval: 400, // Long press duration in milliseconds
    };

    const globalHandlers = prepareContextMenuHandlers();

    document.addEventListener('contextmenu', globalHandlers.onContextMenu);
    document.addEventListener('touchstart', globalHandlers.onTouchStart);
    document.addEventListener('touchend', globalHandlers.onTouchEnd);
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

    if (winner.eventDetails.triggerContext === TriggerContext.Cancel) {
        // Current show intent is a cancel command, do nothing.
        return;
    }

    dispatchWindowEvent(InternalEvent.DoShowContextMenu, winner);
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
        const otherDetails = store.intentWinner.eventDetails;

        if (otherDetails.triggerContext === TriggerContext.Cancel) {
            // Do nothing because cancel commands always take precedence.
        } else if (ourDetails.triggerType === TriggerType.Manual) {
            // Do nothing because manual events always take precedence
            // (unless the previous event is a manual cancel command.
        } else if (ourDetails.triggerContext === TriggerContext.Global) {
            // Either the existing trigger is also global (which means it will be identical to us) or it is local,
            // in which case we would lose. Either way, we can just return.
            return;
        } else {
            const ourSource = ourDetails.triggerSource;
            const otherSource = otherDetails.triggerSource;

            if (!ourSource || !otherSource) {
                // If we got here, it means that we were triggered by a native event that didn't have proper targets
                // specified. The only thing we can do is just give up and assume the current intent lost.
                return;
            }

            // If we have higher precedence than our opponent, we win the intent.
            if (ourSource.contains(otherSource)) {
                return;
            }
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

/**
 * @param {object} data
 * @param {string} [data.externalId]
 * @param {string} data.eventName
 * @param {*} data.data
 * @param {object} data.publicProps
 */
export function emitContextMenuEvent(data) {
    const store = window._reactContextMenuWrapper;
    const id = data.externalId;

    let listenerArray;
    if (id) {
        const map = store.contextMenuEventListenersMap;
        if (!map[id]) map[id] = [];
        listenerArray = map[id];
    } else {
        listenerArray = store.globalContextMenuEventListeners;
    }

    for (const listener of listenerArray) {
        listener(data.eventName, data.data, data.publicProps);
    }
}

/**
 * When both parameters are provided, registers a listener for a specific context menu ID. If the first argument is
 * null, registers a global context menu listener.
 *
 * @param {string} [id]
 * @param {function} listener
 */
export const addContextMenuEventListener = (id, listener) => {
    if (!listener) warn('Tried to register a context menu state listener but no listener object was provided.');
    const store = window._reactContextMenuWrapper;

    let listenerArray;
    if (id) {
        const map = store.contextMenuEventListenersMap;
        if (!map[id]) map[id] = [];
        listenerArray = map[id];
    } else {
        listenerArray = store.globalContextMenuEventListeners;
    }

    if (listenerArray.indexOf(listener) !== -1) {
        warn(`Tried to add the same event listener to \'${id}\' twice.`);
    } else {
        listenerArray.push(listener);
    }
};

/**
 * When both parameters are provided, removes a listener from a specific context menu ID. If the first argument is
 * null, removes a global context menu listener.
 *
 * @param {string} [id]
 * @param {function} listener
 */
export const removeContextMenuEventListener = (id, listener) => {
    if (!listener) warn('Tried to register a context menu state listener but no listener object was provided.');
    const store = window._reactContextMenuWrapper;

    let listenerArray;
    if (id) {
        const map = store.contextMenuEventListenersMap;
        if (!map[id]) map[id] = [];
        listenerArray = map[id];
    } else {
        listenerArray = store.globalContextMenuEventListeners;
    }

    let index = listenerArray.indexOf(listener);
    if (index > -1) {
        listenerArray.splice(index, 1);
    }
};

/**
 * @param {object} data
 * @param {string} [data.id]    External ID of the context menu
 * @param {object} [data.data]  Data associated with the event
 * @param {*} [data.event]      ContextMenu event that triggered the logic
 * @param {number} [data.x]     x-coordinate to show the menu at
 * @param {number} [data.y]     y-coordinate to show the menu at
 */
export const showContextMenu = (data = {}) => {
    let eventDetails = {
        triggerType: TriggerType.Manual,
        triggerContext: data.id ? TriggerContext.Local : TriggerContext.Global,
        x: 0,
        y: 0,
    };
    if (data.event) {
        eventDetails = {
            ...eventDetails,
            ...extractEventDetails(data.event),
        };
    }
    if (data.x) eventDetails.x = data.x;
    if (data.y) eventDetails.y = data.y;
    dispatchWindowEvent(InternalEvent.TryShowContextMenu, {eventDetails, externalId: data.id, data: data.data});
};

export function hideAllContextMenus() {
    dispatchWindowEvent(InternalEvent.HideAllContextMenus);
}

export const cancelOtherContextMenus = () => {
    const eventDetails = {
        triggerType: TriggerType.Manual,
        triggerContext: TriggerContext.Cancel,
    };
    registerShowIntent({eventDetails});
};

/**
 * Prepares an object with handlers for different events
 * @param {number} params
 * @param {string} [params.id]
 * @param {*} [params.data]
 */
export function prepareContextMenuHandlers(params = {}) {
    const store = window._reactContextMenuWrapper;
    const holdToShowInterval = store.holdToShowInterval;
    const {id, data} = params;
    const triggerContext = id ? TriggerContext.Local : TriggerContext.Global;

    let handled = false;

    const touchCancel = (event = null) => {
        if (event && handled) event.preventDefault();
        let oldTimeout;
        if (id) oldTimeout = store.touchTimeoutMap[id];
        else oldTimeout = store.globalTouchTimeout;
        clearTimeout(oldTimeout);
    };

    return {
        onContextMenu: event => {
            const eventDetails = {
                triggerType: TriggerType.Native,
                triggerContext,
                ...extractEventDetails(event),
            };
            dispatchWindowEvent(InternalEvent.TryShowContextMenu, {eventDetails, externalId: id, data});
        },

        onTouchStart: event => {
            event.persist();
            touchCancel();

            const newTimeout = setTimeout(() => {
                handled = true;
                const eventDetails = {
                    triggerType: TriggerType.Native,
                    triggerContext,
                    ...extractEventDetails(event),
                };
                dispatchWindowEvent(InternalEvent.TryShowContextMenu, {eventDetails, externalId: id, data});
            }, holdToShowInterval);
            if (id) store.touchTimeoutMap[id] = newTimeout;
            else store.globalTouchTimeout = newTimeout;
        },

        onTouchEnd: touchCancel,
    };
}
