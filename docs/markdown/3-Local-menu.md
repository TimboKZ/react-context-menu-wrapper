Local menus 

Unlike global context menus, local menus do **not** replace your Browser's default context menu. Instead, local menus
are attached to specific components. For example, you + 

```jsx
import React, { useRef } from 'react';
import { ContextMenuWrapper, useContextMenuHandlers } from 'react-context-menu-wrapper';

export const LocalMenuExample = () => {
    const menuId = 'my-component-local-menu';
    const bannerRef = useRef();

    // This hook attaches relevant DOM event listeners to `bannerRef`.
    useContextMenuHandlers(bannerRef, { id: menuId });

    return (
        <React.Fragment>
            {/* We attach `bannerRef` to the component that will trigger the context menu: */}
            <div ref={bannerRef} className="banner">Right click or long-press this box</div>

            <ContextMenuWrapper id={menuId}>
                <div className="context-menu">
                    <p>I am component-local context menu!</p>
                </div>
            </ContextMenuWrapper>
        </React.Fragment>
    );
};
```

```js { "componentPath": "../components/BasicLocalMenu.js" }
```
