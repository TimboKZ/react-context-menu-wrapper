This section talks about context menus that always display the same content.

### Creating a global menu

To make a context menu global, simply set the `global` prop to `true`. The simplest global menu could look like this:
```jsx
import React from 'react';
import { ContextMenuWrapper } from 'react-context-menu-wrapper';

export const GlobalMenuExample = () => {
    return (
        <ContextMenuWrapper global={true}>
            <div className="context-menu">
                <p>I am a global context menu!</p>
            </div>
        </ContextMenuWrapper>
    );
};
```

This component will automatically replace the default context menu of your browser. Try right-clicking (or
long-pressing on mobile) anywhere on the page to bring it up.

To disable the custom global menu and bring back the default one, simply unmount the `<ContextMenuWrapper>` component.
The example below does exactly that - after you click the green button, you'll be able to use the default context menu.

```js { "componentPath": "../components/BasicGlobalMenu.js" }
```

### Creating a component-local menu

Attaching a custom context menu to a specific component is slightly more involved. You'll need to give 
`<ContextMenuWrapper>` and ID, and also attach a React `ref` to the component you want to use as a trigger.

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
            // We attach `bannerRef` to the component that will trigger the context menu: 
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
