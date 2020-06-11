Let's start with a quick demonstration of how the library works. We define a simple `MyContextMenu` component that will
hold our context menu. We then create a container component called `QuickDemo` that will hold `MyContextMenu` and two
"triggers".

A trigger is a component that you can right-click to bring up the context menu. We specify a `data` field for each
trigger. This can be anything you want - a number, a string or an object.

The resultant code looks as follows:

```jsx { "filePath": "../components/QuickDemoNoComments.js" }
```

Right click (or long-press on mobile) each of the boxes below to see our context menu in action. If you click "View 
Code", you can see the version of the code above with comments clarifying what each line does.

```js { "componentPath": "../components/QuickDemo.js" }
```
