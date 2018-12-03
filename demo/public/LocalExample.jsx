const React = require('react');
import {ContextMenuWrapper, prepareContextMenuHandlers} from 'react-context-menu-wrapper';

const style = {backgroundColor: '#a3eee3', color: '#007d6a'};

export const LocalExample = () => {
    // Create handlers that will trigger our context menu
    const handlers = prepareContextMenuHandlers('my-custom-id');

    return (
        <div>
            {/* Assign handlers to a component */}
            <div className="my-context-box no-select" style={style} {...handlers}>
                Right click or long-tap on this box
            </div>

            {/* Create a context menu */}
            <ContextMenuWrapper id="my-custom-id">
                <div className="my-dropdown">
                    <div className="my-item my-text">
                        This is a <strong>local</strong> context menu. It is styled using <em>custom CSS</em>.
                    </div>
                    <hr className="my-separator"/>
                    <a href="#" className="my-item my-button" onClick={window.changePageColour}>
                        Change page background
                    </a>
                </div>
            </ContextMenuWrapper>
        </div>
    );
};

