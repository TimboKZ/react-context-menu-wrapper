If you want to produce the examples from this page locally, you will need to add the CSS shown below to your page.

Remember that `react-context-menu-wrapper` does not provide any styles out of the box. It was meant to be used with CSS
frameworks like [Bulma](https://bulma.io/) or [Bootstrap](https://getbootstrap.com/). You can also define your own styles.

```css
.context-menu {
    box-shadow: inset rgba(0, 0, 0, 0.2) 0 0 0 1px, rgba(0, 0, 0, 0.4) 0 3px 3px;
    background-color: #e1e1f9;
    width: 200px;

    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.context-menu *:first-child {
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
}

.context-menu *:last-child {
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
}

.context-menu p {
    text-align: center;
    padding: 10px;
    color: #666;
    margin: 0;
}

.context-menu button {
    border-top: solid 1px rgba(0, 0, 0, 0.2) !important;
    background-color: transparent;
    padding: 10px;
    width: 100%;
}

.context-menu button, .button {
    font-size: inherit;
    cursor: pointer;
    color: #2f2f2f;
    border: none;
}

.context-menu button:hover, .button:hover {
    box-shadow: inset rgba(0, 0, 0, 0.05) 2000px 2000px;
}

.context-menu button:active, .button:active {
    box-shadow: inset rgba(0, 0, 0, 0.1) 2000px 2000px;
}

.button {
    background-color: #00c4a7;
    padding: 10px 20px;
    color: #fff;
}
```