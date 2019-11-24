import React, { useRef } from 'react';
import { ContextMenuWrapper, useContextMenuHandlers } from 'react-context-menu-wrapper';

const menuId = 'my-component-local-menu';

const MyContextMenuTrigger = React.memo(() => {
    const bannerRef = useRef();
    useContextMenuHandlers(bannerRef, { id: menuId });

    return (
        <div ref={bannerRef} className="banner">
            Right click or long-press this box
        </div>
    );
});

const LocalMenuExample = React.memo(() => {
    return (
        <React.Fragment>
            <MyContextMenuTrigger />

            <ContextMenuWrapper id={menuId}>
                <div className="context-menu" style={{ backgroundColor: '#d6fffc' }}>
                    <p>
                        This is a <strong>local</strong> menu!
                    </p>
                    <button>Dummy button #1</button>
                    <button>Dummy button #2</button>
                </div>
            </ContextMenuWrapper>
        </React.Fragment>
    );
});

export default LocalMenuExample;
