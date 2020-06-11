Add [`react-context-menu-wrapper`](https://www.npmjs.com/package/react-context-menu-wrapper) to your NPM project:
```bash
npm install --save react-context-menu-wrapper
```

Then import it as usual:
```js
import {ContextMenuWrapper, useContextMenuTrigger} from 'react-context-menu-wrapper';
```

> **Before we start:** On mobile, the long press gesture can accidentally start the text selection process. To prevent
> this, you can copy the CSS snippet shown below into your stylesheet and add `.no-select` class to your context menu
> and relevant trigger components. For best user experience, make sure you only add this class on mobile devices and 
> that affected components are relatively small (e.g. don't add `.no-select` to the root component of your page).
```css
.no-select {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
```