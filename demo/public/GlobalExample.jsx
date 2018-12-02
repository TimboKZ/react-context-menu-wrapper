/**
 * @author v1ndic4te
 * @copyright 2018
 * @licence GPL-3.0
 */

const React = require('react');
import {ContextMenuWrapper} from 'react-context-menu-wrapper';

export const GlobalExample = () => (
    <ContextMenuWrapper global={true}>
        <div className="my-dropdown">
            <div className="my-item my-text">This is a global context menu.</div>
            <hr className="my-separator"/>
            <a href="#" className="my-item my-button" onClick={window.changePageColour}>Change page background</a>
        </div>
    </ContextMenuWrapper>
);
