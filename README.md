# React Context Menu Wrapper

[![react-context-menu-wrapper version][npm-version]][npm]
[![react-context-menu-wrapper downloads][npm-downloads]][npm]

This component provides a simple wrapper for your context menu content. It will handle the right click (or long 
press on mobile) event and menu positioning, but the rest is up to you.

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

> Please [create an issue](https://github.com/v1ndic4te/react-context-menu-wrapper/issues/new) if you find a bug or
> want to suggest a new feature.

# Usage examples

[Click here to view demos with example code.](https://v1ndic4te.github.io/react-context-menu-wrapper/)

# Installation

Install the main package:
```bash
npm install --save react-context-menu-wrapper
```

# The gist

Here's an example of a simple context menu. It doesn't showcase many features, but it should give you a basic 
idea of how this component works. This particular context menu doesn't have any buttons - don't worry, it's pretty easy 
to add them. Take a look at [demos and examples](https://v1ndic4te.github.io/react-context-menu-wrapper/) to find out
 more.

![Gif of the context menu library in action.](https://v1ndic4te.github.io/react-context-menu-wrapper/context-menu-boxes.gif)

(The context menu in the gif is triggered using a right click and dismissed using a left click.)

```jsx
// Import our packages, the usual way.
import React, {Component} from 'react';
import {ContextMenuWrapper, prepareContextMenuHandlers} from 'react-context-menu-wrapper';

// Define some styles - remember that `react-context-menu-wrapper` does not provide any styling out-of-the-box.
const contextMenuStyle = {backgroundColor: '#eec185', padding: '10px', boxShadow: '0 3px 5px rgba(0, 0, 0, 0.5)'};
const blueBoxStyle = {backgroundColor: '#3e48f9', color: '#fff', padding: '40px'};
const redBoxStyle = {backgroundColor: '#aa2d35', color: '#fff', padding: '40px'};

class ComponentWithAContextMenu extends Component {
    constructor(props) {
        super(props);

        // Set initial phase to same dummy value.
        this.state = {phrase: 'Nothing.'};

        // Create "triggers" for our context menu. Each "trigger" has some unique data associated with it.
        this.redBoxHandlers = prepareContextMenuHandlers('my-context-menu', 'Hello from Lavagirl!');
        this.blueBoxHandlers = prepareContextMenuHandlers('my-context-menu', 'Hello from Sharkboy!');
    }

    // Define our logic for when the context menu is shown
    handleContextMenuShow = data => {
        // 'data' variable contains the phrase we initialised our handlers with.
        this.setState({phrase: data});
    };

    render() {
        return (
            <div style={{fontSize: '1.4rem'}}>
                {/* Render the boxes that will trigger the context menu */}
                <div {...this.blueBoxHandlers} style={blueBoxStyle}>Blue box</div>
                <div {...this.redBoxHandlers} style={redBoxStyle}>Red box</div>

                {/*
                Include the component for the context menu itself. Note that this component doesn't have to be on
                the same level as triggers. In fact, the context menu can even come from a different React tree!
                */}
                <ContextMenuWrapper id="my-context-menu" onShow={this.handleContextMenuShow}>
                    <div style={contextMenuStyle}>
                        <div>The box says: <strong>{this.state.phrase}</strong></div>
                    </div>
                </ContextMenuWrapper>
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

| Name                 | Type                    | Default value | Description                                                                                                                                                                                    |
|----------------------|-------------------------|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `id`                 | String                  | *None*        | A user-defined string that is used to reference this context menu component in helper functions. For example: `file-entry-menu`.                                                               |
| `global`             | Boolean                 | `false`       | Determines whether the context menu can be opened by right clicking (or long pressing on mobile) anywhere on the page. Note that a context menu can have an ID and be global at the same time. |
| `onShow`             | *ContextMenuCallback* | *None*        | A callback that is called right before this context menu is shown. See below for more details.                                                                                                 |
| `onHide`             | *ContextMenuCallback* | *None*        | A callback that is called immediately after this context menu is hidden. See below for more details.                                                                                           |
| `hideOnScroll`       | Boolean                 | `true`        | Determines whether the menu should disappear when *document* (top level node) is scrolled.                                                                                                     |
| `hideOnWindowResize` | Boolean                 | `true`        | Determines whether the menu should disappear when the window is resized.                                                                                                                       |
| `hideOnSelfClick`    | Boolean                 | `true`        | Determines whether the context menu should disappear after something inside it was clicked.                                                                                                    |
| `hideOnOutsideClick` | Boolean                 | `true`        | Determines whether the context menu should disappear after the user has clicked anything outside of it.                                                                                        |

`ContextMenuCallback` is a function of type `(data, publicProps) => void`. `data` is the value that was passed to the
 handlers of the context menu, if any (see `prepareContextMenuHandlers(...)` below). `publicProps` is an object 
 containing the values of the properties listed above.

# Helper functions
```
// Coming.
```


[build-badge]: https://img.shields.io/travis/v1ndic4te/react-context-menu-wrapper/master.png?style=flat-square
[build]: https://travis-ci.org/v1ndic4te/react-context-menu-wrapper

[npm-downloads]: https://img.shields.io/npm/dt/react-context-menu-wrapper.png?style=flat
[npm-version]: https://img.shields.io/npm/v/react-context-menu-wrapper.png?style=flat
[npm]: https://www.npmjs.org/package/react-context-menu-wrapper

[coveralls-badge]: https://img.shields.io/coveralls/v1ndic4te/react-context-menu-wrapper/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/v1ndic4te/react-context-menu-wrapper
