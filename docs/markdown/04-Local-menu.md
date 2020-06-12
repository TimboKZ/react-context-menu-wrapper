Unlike global context menus, local menus don't replace your Browser's default context menu. Instead, local menus
are attached to specific components.

Local menus require a menu ID. For our purposes, let's use `best-menu`. Creating a local menu then involves 2 steps:

**#1**: Specify `menuId` for `ContextMenuWrapper`:
```jsx
<ContextMenuWrapper menuId="best-menu">
    {/* ... my menu component ... */}
</ContextMenuWrapper>
```

**#2**: Create a React ref using the `useContextMenuTrigger` hook, specifying the same `menuId`, and attach said ref to
your trigger component:
```jsx
const MyTriggerComponent = () => {
    const ref = useContextMenuTrigger({ menuId: 'best-menu' });

    return <p ref={ref}>Right click me!</p>;
};
```

**That's it!** The code snippet below shows a complete example of how local menus are defined.

```jsx
import React from 'react';
import { ContextMenuWrapper, useContextMenuTrigger } from 'react-context-menu-wrapper';

export const LocalMenuExample = () => {
    const menuId = 'my-component-local-menu';

    // This hook attaches relevant DOM event listeners to `bannerRef`.
    const bannerRef = useContextMenuTrigger({ id: menuId });

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
