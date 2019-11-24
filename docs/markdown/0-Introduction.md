This library provides a simple wrapper for your context menus. It handles user interaction on desktop and mobile
devices, and guarantees correct context menu positioning.

In an effort to stay unopinionated, this library does not provide any styling or additional components. It is up to you
define your own styles and logic for the menu. This is useful when your CSS framework already provides dropdown menu
styling (e.g. [Bulma](https://bulma.io/), [Bootstrap](https://getbootstrap.com/)) or when you need to implement some
non-trivial logic for your context menu (e.g. [Ogma context menus](https://github.com/TimboKZ/Ogma) with tagging
support).

**Features:**
* Supports global and component-local context menus.
* Supports long-press for mobile devices.
* Lets you trigger context menus programmatically.  
* Lets you define context menu precedence.
* Correctly displays context menus on nested components.
* Correctly displays context menus near the borders of the window.
* **Uses hooks!**
* **Does not provide out-of-the-box styling.**
