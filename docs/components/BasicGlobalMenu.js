import React, { useCallback, useEffect, useState } from 'react';
import { ContextMenuWrapper } from 'react-context-menu-wrapper';

const MyContextMenu = () => {
    const [seconds, setSeconds] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => setSeconds(s => s + 1), 1000);
        return () => clearInterval(timer);
    });

    return (
        <div className="context-menu">
            <p>
                I am a custom <strong>global</strong> context menu!
            </p>
            <p>
                Open for {seconds} {seconds === 1 ? 'second' : 'seconds'}.
            </p>
        </div>
    );
};

const GlobalMenuExample = () => {
    const [globalMenuEnabled, setGlobalMenuEnabled] = useState(true);
    const onClick = useCallback(() => setGlobalMenuEnabled(!globalMenuEnabled), [globalMenuEnabled]);

    const status = globalMenuEnabled ? 'ENABLED' : 'DISABLED';
    const action = globalMenuEnabled ? 'Disable' : 'Enable';

    return (
        <React.Fragment>
            <p className="text">Custom global context menu status: {status}</p>
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
};

export default GlobalMenuExample;
