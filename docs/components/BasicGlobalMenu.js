import React, { useCallback, useEffect, useState } from 'react';
import { ContextMenuWrapper } from 'react-context-menu-wrapper';

const MyContextMenu = React.memo(() => {
    const [seconds, setSeconds] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => setSeconds(s => s + 0.5), 500);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="context-menu">
            <p>
                This is a <strong>global</strong> menu.
                <div style={{ height: 10 }} />
                Open for {seconds.toFixed(1)} {seconds === 1 ? 'second' : 'seconds'}.
                <div style={{ height: 10 }} />
                Use Ctrl+Right Click to bring up browser's native menu.
            </p>
            <button>Dummy button #1</button>
            <button>Dummy button #2</button>
        </div>
    );
});

const GlobalMenuExamplePage = React.memo(() => {
    const [globalMenuEnabled, setGlobalMenuEnabled] = useState(true);
    const onClick = useCallback(() => setGlobalMenuEnabled(!globalMenuEnabled), [globalMenuEnabled]);

    const currentMenuType = globalMenuEnabled ? 'custom' : "Browser's default";
    const currentMenuTypeStyle = { color: globalMenuEnabled ? 'red' : 'green' };
    const action = globalMenuEnabled ? 'Disable' : 'Enable';

    return (
        <React.Fragment>
            <p className="text">
                Currently using <span style={currentMenuTypeStyle}>{currentMenuType}</span> global context menu.
            </p>
            <button className="button" onClick={onClick}>
                {action} custom global context menu
            </button>

            {globalMenuEnabled && (
                <ContextMenuWrapper global={true}>
                    <MyContextMenu />
                </ContextMenuWrapper>
            )}
        </React.Fragment>
    );
});

export default GlobalMenuExamplePage;
