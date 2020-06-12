import React from 'react';
import { ContextMenuWrapper, useContextMenuEvent, useContextMenuTrigger } from 'react-context-menu-wrapper';

// Define the context menu component
const MyContextMenu = React.memo(() => {
    // Context menu event tells us how this menu called.
    // It also contains user-defined `data` field.
    const menuEvent = useContextMenuEvent();

    // `menuEvent` can be null when `MyContextMenu` is placed outside `ContextMenuWrapper`.
    // `menuEvent.data` can be null when context menu is brought up programmatically
    // or when the trigger does not define a `data` field.
    if (!menuEvent || !menuEvent.data) return null;

    // Render the component with using the provided data
    return (
        <div className="context-menu">
            <p>This menu belongs to {menuEvent.data.name}!</p>
        </div>
    );
});

// Define component with menu triggers
const QuickDemo = React.memo(() => {
    const menuId = 'my-witcher-menu';

    // Create React refs for the component that will serve as our triggers.
    const geraltRef = useContextMenuTrigger({ menuId: menuId, data: { name: 'Geralt' } });
    const yenneferRef = useContextMenuTrigger({ menuId: menuId, data: { name: 'Yennefer' } });

    return (
        <div>
            {/* Attach refs to the trigger components. */}
            <div className="box-container">
                <div className="box" ref={geraltRef}>
                    Geralt
                </div>
                <div className="box" ref={yenneferRef}>
                    Yennefer
                </div>
            </div>

            {/* We place `MyContextMenu` inside `ContextMenuWrapper */}
            <ContextMenuWrapper id={menuId}>
                <MyContextMenu />
            </ContextMenuWrapper>
        </div>
    );
});

export default QuickDemo;
