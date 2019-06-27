/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @licence MIT
 */

import {windowExists, initWindowState} from './util';

if (!windowExists()) throw new Error('\'window\' is not available! Are we running in the browser?');
initWindowState();

export {default as ContextMenuWrapper} from './ContextMenuWrapper';
export {
    ContextMenuEvent,
    prepareContextMenuHandlers,
    addContextMenuEventListener,
    removeContextMenuEventListener,
    showContextMenu,
    hideAllContextMenus,
    cancelOtherContextMenus,
} from './util';
