/**
 * @author v1ndic4te <vndc4t0r@gmail.com>
 * @copyright 2018
 * @licence GPL-3.0
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
