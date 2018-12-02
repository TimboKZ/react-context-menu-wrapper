/**
 * @author v1ndic4te
 * @copyright 2018
 * @licence GPL-3.0
 */

export function windowExists() {
    return typeof window !== 'undefined';
}

export function prepareDataStorage() {
    if (window._reactContextMenuWrapperData) return;

    window._reactContextMenuWrapperData = {};
}

/**
 * @param node
 * @param property
 */
export function getPropertySize(node, property) {
    const value = window.getComputedStyle(node).getPropertyValue(property);
    return +value.replace(/[^\d.]+/g, '');
}

/**
 *
 * @param {string} id
 * @param {Event} event
 */
export function showContextMenu(id, event = null) {
    if (event) event.preventDefault();

}

export function hideAllContextMenus() {

}

/**
 * Prepares an object with handlers for different events
 * @param id
 */
export const prepareContextMenuTriggers = id => {

};
