import React from 'react';
import { ContextMenuWrapper, useContextMenuTrigger } from 'react-context-menu-wrapper';

const menuId = 'my-component-local-menu';

const LocalMenuExample = React.memo(() => {
    const bannerRef = useContextMenuTrigger({ menuId: menuId });

    return (
        <React.Fragment>
            <div ref={bannerRef} className="banner">
                Right click or long-press this box
            </div>

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
