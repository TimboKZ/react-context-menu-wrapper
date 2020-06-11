A quick demo first: **Right click anywhere on this page to bring up a custom global context menu.** On mobile devices,
long-press gesture should bring up the menu too.

Defining a global context menu is very straightforward - you need to create a `<ContextMenuWrapper>` component and set
its `global` property to `true`. For example:
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

Your custom global menu will replace your browser's default context menu. If you want to enable the default context menu
again, just unmount the `<ContextMenuWrapper>` component.

**Remember** that `react-context-menu-wrapper` does not provide any styling out of the box, so you will need to define
your own styles. If you're interested, the styles used for this demo are shown at the bottom of the page.

```js { "componentPath": "../components/BasicGlobalMenu.js" }
```
