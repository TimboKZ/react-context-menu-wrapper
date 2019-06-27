# React Context Menu Wrapper

[![react-context-menu-wrapper version][npm-version]][npm]
[![react-context-menu-wrapper downloads][npm-downloads]][npm]

This component provides a simple wrapper for your context menu content. It will handle the right click event (or long 
press on mobile) and menu positioning, but the rest is up to you.

![Gif of the context menu library in action.](https://timbokz.github.io/react-context-menu-wrapper/context-menu-shared.gif)

Unlike other React context menu packages, this one does not provide any styling or pre-made components - you'll 
have to style the context menu yourself. This is useful when your CSS framework provides dropdown styling - consider 
dropdowns [from Bootstrap](https://getbootstrap.com/docs/4.1/components/dropdowns/) or
[from Bulma](https://bulma.io/documentation/components/dropdown/).

**Features:**
* Supports global and component-local context menus.
* Supports long-press for mobile devices.
* Lets you trigger context menus programmatically.  
* Lets you define context menu precedence.
* Correctly displays context menus on nested components.
* Correctly displays context menus near the borders of the window.
* **Does not provide out-of-the-box styling.**

> Please [create an issue](https://github.com/TimboKZ/react-context-menu-wrapper/issues/new) if you find a bug or
> want to suggest a new feature.

# Important changes

Version 2.* uses different logic to handle visibility of the context menu. In version 1, whenever context menu was
invisible, CSS style `display: none;` would be applied to it, but React components inside the `<ContextMenuWrapper>`
would remained **mounted**.

In version 2, when the menu is hidden, all children of `<ContextMenuWrapper>` are unmounted. When the context menu is
shown, the children are mounted anew.

# Usage examples

[Click here to view demos with example code.](https://timbokz.github.io/react-context-menu-wrapper/)

# Installation

Install the main package:
```bash
npm install --save react-context-menu-wrapper
```

# The gist

Here's an example of a simple context menu. It doesn't showcase many features, but it should give you a basic idea of
how this component works. This particular context menu doesn't have any buttons - don't worry, it's pretty easy to add
them. Take a look at [demos and examples](https://timbokz.github.io/react-context-menu-wrapper/) to find out more.

![Gif of the context menu library in action.](https://timbokz.github.io/react-context-menu-wrapper/context-menu-boxes.gif)

(The context menu in the gif is triggered using a right click and dismissed using a left click.)

```jsx
// Import our packages, the usual way.
import React from 'react';
import {ContextMenuWrapper, prepareContextMenuHandlers} from 'react-context-menu-wrapper';
 
// Define some styles - remember that `react-context-menu-wrapper` does not provide any styling out-of-the-box.
const contextMenuStyle = {backgroundColor: '#eec185', padding: '10px', boxShadow: '0 3px 5px rgba(0, 0, 0, 0.5)'};
const styles = [
  {backgroundColor: '#3e48f9', color: '#fff', padding: '40px'},
  {backgroundColor: '#aa2d35', color: '#fff', padding: '40px'},
];

const MyContextMenu = (props) => {
  const {phrase} = props;
  return (
    <div style={contextMenuStyle}>
      <div>The box says: <strong>{phrase}</strong></div>
    </div>
  );
};

export default class ComponentWithAContextMenu extends React.Component {
    constructor(props) {
        super(props);
 
        // Create "triggers" for our context menu. Each "trigger" has some unique data associated with it.
        const redData = {index: 0, phrase: 'Hello from Lavagirl!'};
        const blueData = {index: 1, phrase: 'Hello from Sharkboy!'};
        this.redBoxHandlers = prepareContextMenuHandlers({id: 'my-context-menu', data: redData});
        this.blueBoxHandlers = prepareContextMenuHandlers({id: 'my-context-menu', data: blueData});
    }
 
    // Define the logic for when the context menu is shown
    handleContextMenuShow = (data, publicProps) => {
        // 'data' variable contains the phrase we initialised our handlers with.
        console.log(`Current menu's phrase: ${data.phrase}`);
        
        // We also have access to the 'publicProps' variable, but we're not going to use it. This variable
        // contains the properties of the context menu. For example, we could find out:
        //   - The ID of the menu (via 'publicProps.id')
        //   - Whether the menu is global (via 'publicProps.global')
    };
 
    render() {
        return (
            <div style={{fontSize: '1.4rem'}}>
                {/* Render the boxes that will trigger the context menu */}
                <div {...this.blueBoxHandlers} style={styles[0]}>Blue box</div>
                <div {...this.redBoxHandlers} style={styles[1]}>Red box</div>
 
                {/*
                Include the component for the context menu itself. Note that this component doesn't have to be on
                the same level as triggers. In fact, the context menu can even come from a different React tree!
                */}
                <ContextMenuWrapper id="my-context-menu"
                                 onShow={this.handleContextMenuShow}
                                 render={data => <MyContextMenu phrase={data.phrase}/>}/>
            </div>
        );
    }
}
```

# `ContextMenuWrapper` component

`ContextMenuWrapper` is the component that handles showing and hiding your context menu content on various events, 
which are triggered either programmatically or through user input. This is the only React component provided by the 
library, the rest of the functionality is provided as helper functions.

Example usage:
```jsx
import {ContextMenuWrapper} from 'react-context-menu-wrapper';

const MyComponent = () => (
    <ContextMenuWrapper global={true}
                        onShow={() => console.log('Context menu shown!')}
                        onHidden={() => console.log('Context menu shown!')}>
        <div style={{backgroundColor: 'black', color: 'white'}}>This is a context menu.</div>
    </ContextMenuWrapper>
);
```

Properties supported by `ContextMenuWrapper`:

| Name | Type | Default value | Description |
|----------------------|-------------------------|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `id` | String | *None* | A user-defined string that is used to reference this context menu component in helper functions. For example: `file-entry-menu`. |
| `global` | Boolean | `false` | Determines whether the context menu can be opened by right clicking (or long pressing on mobile) anywhere on the page. Note that a context menu can have an ID and be global at the same time. |
| `onShow` | *Context Menu Callback* | *None* | A callback that is called right before this context menu is shown. (see below for *Context Menu Callback* description) |
| `onHide` | *Context Menu Callback* | *None* | A callback that is called immediately after this context menu is hidden. (see below for  *Context Menu Callback* description) |
| `render` | *Render Function* | *None* | A function that should return the contents of the context menu when called, which happens when the menu is mounted (i.e. becomes visible). If `render` prop is specified, the React components it returns will be rendered before the children of `ReactContextMenuWrapper`. (see below for  *Render Function* description) |
| `hideOnEscape` | Boolean | `true` | Determines whether the menu should disappear when the Escape key is pressed. |
| `hideOnScroll` | Boolean | `true` | Determines whether the menu should disappear when *document* (top level node) is scrolled. |
| `hideOnWindowResize` | Boolean | `true` | Determines whether the menu should disappear when the window is resized. |
| `hideOnSelfClick` | Boolean | `true` | Determines whether the context menu should disappear after something inside it was clicked. |
| `hideOnOutsideClick` | Boolean | `true` | Determines whether the context menu should disappear after the user has clicked anything outside of it. |

**Render Function** is a function of type `(data) => React.Component`. `data` is the value that was passed to
the handlers of the context menu, if any (see `prepareContextMenuHandlers(...)` below).

**Context Menu Callback** is a function of type `(data, publicProps) => void`. `data` is the value that was passed to
the handlers of the context menu, if any (see `prepareContextMenuHandlers(...)` below). `publicProps` is an object
containing the values of the properties listed above.

# Helper functions

All of the helper functions and enums can be imported from the main package, e.g.:
```jsx
import {ContextMenuEvent, addContextMenuEventListener} from 'react-context-menu-wrapper';

// Do something with the `prepareContextMenuHandlers(...)` and the others
```

### `prepareContextMenuHandlers(params)`

Generates event handlers that can be attached to a trigger component (e.g. image thumbnail). Once attached, these 
handlers will only show the relevant context menu when the component is clicked. Argument types:
- `params`: object with keys:
    - `id`: string. The ID of the context menu the handlers will trigger.
    - `data`: any value. `data` can be anything that you want to attach to the trigger. This can be a number, a string,
    an object, or anything else. The supplied `data` value will be sent to event listeners and callbacks (see below).

The returned object contains various event handlers and looks similar to this:
```javascript
const handlers = {
    onContextMenu: /* some handler */,
    onTouchStart: /* some handler */,
    onTouchEnd: /* some handler */,
}
```
Thanks to this structure, the handlers can be attached to other components using an object spread:
```jsx
<div {...handlers}>Right click me!</div>
```

### `addContextMenuEventListener(id, listener)`

Registers a listener for context menu events such as `hide` and `show`. Note that this listener doesn't give you any 
control over these events, it just notifies you that they took place. Argument types:
- `id`: string or `null`. When a string is provided, your listener will be attached to the context menu ID that you 
have specified. If `null` is provided, your listener will be attached to global context menus.
- `listener`: function of type `(eventName, data, publicProps) => void`. This function is similar to
`ContextMenuCallback`, except there's an extra argument called `eventName`. `eventName` is a value from the 
`ContextMenuEvent` enum (see below). `data` is the value that was passed to the handlers of the context menu, if any
 (see `prepareContextMenuHandlers(...)` above). `publicProps` is an object containing the values of the properties 
 listed in the table in the first section.
 
Note that a single listener function can listen to multiple IDs, but if you'll try to attach a single listener to the
 same ID twice, the second call will be ignored and a warning will be printed to the console.

### `removeContextMenuEventListener(id, listener)`

Removes a listener that was previously added. The arguments are identical to the function above.
 
If the listener you try to remove doesn't exist or was never registered, the operation will just silently succeed. 
Note that you have provide the *exact* same `listener` function that was used to add the listener.

### `ContextMenuEvent` enum

This enum defines the names of the events that the context menu can emit. Available names are `Show` and `Hide`. 
Example usage:
```javascript
const handleContextMenuEvent = (eventName, data, publicProps) => {
    if (eventName === ContextMenuEvent.Show) {
        doActionX(data, publicProps);
    } else if (eventName === ContextMenuEvent.Hide) {
        doActionY(data, publicProps);
    } else {
        // For forward-compatibility, in case we add new states in the future
        doActionFallback(data, publicProps);
    }
};
```

### `showContextMenu(data)`

Used when you want to trigger a context menu programmatically. Argument types:
- `data`: object with keys:
    - `id`: string (optional). When a string is provided, triggers the context menu ID you have specified. Otherwise, a 
    global context menu is triggered.
    - `data`: any value (optional). Supplied `data` value will be passed to event listeners and callbacks.
    - `event`: input event (optional). An instance of `click` or `contextmenu` event. You can pass it in if you don't
     want to specify `x` and `y` coordinates manually.
    - `x`: number (optional). The `x` pixel coordinate at which the context menu will be shown.
    - `y`: number (optional). The `y` pixel coordinate at which the context menu will be shown.

Note that if both `event` and `x, y` are specified, the latter will be used.

### `hideAllContextMenus()`

Hides all visible context menus.

### `cancelOtherContextMenus()`

Cancel the `show` event on all menus that were about to be displayed when the function was invoked. This function is 
meant to be used to prevent context menus from appearing when a specific component is clicked. For example, imagine 
you have a global context menu that appears if you right click any element on the page. You also have a button 
component `MyButton` and you want to make sure no context menu appears when you right click this button. You would 
achieve this as follows:
```jsx
<MyButton onContextMenu={cancelOtherContextMenus}>Button with no context menu.</MyButton>
```

### Notes
* Calling `prepareContextMenuHandlers(...)` is a relatively expensive operation, so try to minimize the number of times
  you create new handlers. For example, if the menu ID and handler data never change, consider creating a static
  variable that will hold all context menu handlers. This variable can then be passed to all relevant elements.
* Whenever it says `null`, you don't actually have to provide `null` as the value. As long as the value you provide is
  falsy, it will be ignored.

[build-badge]: https://img.shields.io/travis/v1ndic4te/react-context-menu-wrapper/master.png?style=flat-square
[build]: https://travis-ci.org/v1ndic4te/react-context-menu-wrapper

[npm-downloads]: https://img.shields.io/npm/dt/react-context-menu-wrapper.png?style=flat
[npm-version]: https://img.shields.io/npm/v/react-context-menu-wrapper.png?style=flat
[npm]: https://www.npmjs.org/package/react-context-menu-wrapper

[coveralls-badge]: https://img.shields.io/coveralls/v1ndic4te/react-context-menu-wrapper/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/v1ndic4te/react-context-menu-wrapper
