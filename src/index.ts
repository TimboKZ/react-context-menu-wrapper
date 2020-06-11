/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import { initWindowState } from './globalState';

initWindowState();

export { ContextMenuWrapper, ContextMenuWrapperProps } from './ContextMenuWrapper';
export { ContextMenuEvent } from './handlers';
export { useContextMenuEvent, useContextMenuTrigger } from './hooks';
