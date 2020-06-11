It is possible to define a single context menu component that will behave differently depending on what trigger 
activated it. This is done using context menu events. 

A **context menu event** contains some information about the HTML input event that triggered the context menu, as well
as the user-defined trigger data. The formal type of a context menu event is:

```js { "filePath": "./src/handlers.ts", "typeName": "ContextMenuEvent" }
```

Data can be anything you want - a number, a string or an object. You can attach a `data` field to triggers by passing
it to the `useContextMenuTrigger` hook:
```js
const geraltRef = useContextMenuTrigger({menuId: 'best-menu', data: {name: 'Geralt'}});
const yenneferRef = useContextMenuTrigger({menuId: 'best-menu', data: {name: 'Yennefer'}});
```

You can then access this data inside a context menu using the `useContextMenuEvent` hook:
```js
const MyContextMenu = React.memo(() => {
    const menuEvent = useContextMenuEvent();
    if (!menuEvent) return null;

    return <p>The name is {menuEvent.data.name}.</p>;
});
```

Example below shows such a context menu in action. Click "View Code" to see the implementation.

```js { "componentPath": "../components/SharedMenu.js" }
```
