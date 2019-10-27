import React, { useCallback, useState } from 'react';
import { ContextMenuWrapper } from 'react-context-menu-wrapper';

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
                    <div className="context-menu">
                        <p>I am a global context menu!</p>
                    </div>
                </ContextMenuWrapper>
            )}
        </React.Fragment>
    );
};

export default GlobalMenuExample;
