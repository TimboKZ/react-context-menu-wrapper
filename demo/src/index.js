import React from 'react';
import {render} from 'react-dom';

// Setup a function to change the background colour of the page
const body = document.querySelector('body');
let currentPageColour = -1;
const pageColours = ['#16a085', '#2980b9', '#8e44ad', '#2c3e50'];
window.changePageColour = event => {
    if (event) event.preventDefault();
    currentPageColour = (currentPageColour + 1) % pageColours.length;
    body.style.backgroundColor = pageColours[currentPageColour];
};

import {GlobalExample} from './GlobalExample';
render(<GlobalExample/>, document.querySelector('#global-example-react'));
import {LocalExample} from './LocalExample';
render(<LocalExample/>, document.querySelector('#local-example-react'));
import {SharedExample} from './SharedExample';
render(<SharedExample/>, document.querySelector('#shared-example-react'));
import {NestedExample} from './NestedExample';
render(<NestedExample/>, document.querySelector('#nested-example-react'));
