import React from 'react';
import {ContextMenuWrapper, useContextMenuEvent, useContextMenuTrigger} from 'react-context-menu-wrapper';

const MyContextMenu = React.memo(() => {
    const menuEvent = useContextMenuEvent();
    if (!menuEvent || !menuEvent.data) return null;

    return (
        <div className="context-menu">
            <p>This menu belongs to {menuEvent.data.name}!</p>
        </div>
    );
});

const QuickDemo = React.memo(() => {
    const menuId = 'my-witcher-menu';
    const geraltRef = useContextMenuTrigger({menuId: menuId, data: {name: 'Geralt'}});
    const yenneferRef = useContextMenuTrigger({menuId: menuId, data: {name: 'Yennefer'}});

    return (
        <div>
            <div className="box-container">
                <div className="box" ref={geraltRef}>Geralt</div>
                <div className="box" ref={yenneferRef}>Yennefer</div>
            </div>

            <ContextMenuWrapper id={menuId}>
                <MyContextMenu/>
            </ContextMenuWrapper>
        </div>
    );
});

export default QuickDemo;
