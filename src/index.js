/**
 * @author v1ndic4te <vndc4t0r@gmail.com>
 * @copyright 2018
 * @licence GPL-3.0
 */

import {windowExists, prepareDataStorage} from './util';

if (!windowExists()) throw new Error('\'window\' is not available! Are we running in the browser?');
prepareDataStorage();

export {default as ContextMenuWrapper} from './ContextMenuWrapper';
export {showContextMenu, hideAllContextMenus} from './util';
