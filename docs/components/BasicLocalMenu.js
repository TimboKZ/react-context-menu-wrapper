import React, { useRef } from 'react';
import { ContextMenuWrapper, useContextMenuHandlers } from 'react-context-menu-wrapper';

const LocalMenuExample = () => {
    const menuId = 'my-component-local-menu';
    const bannerRef = useRef();

    // This hook attaches relevant DOM event listeners to `bannerRef`.
    useContextMenuHandlers(bannerRef, { id: menuId });

    return (
        <React.Fragment>
            <div ref={bannerRef} className="banner">
                Right click or long-press this box
            </div>

            <ContextMenuWrapper id={menuId}>
                <div className="context-menu">
                    <p>I am component-local context menu!</p>
                </div>
            </ContextMenuWrapper>
        </React.Fragment>
    );
};

export default LocalMenuExample;
