import React, {Component} from 'react';
import {render} from 'react-dom';

import {ContextMenuWrapper} from '../../src';

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

render(<GlobalExample/>, document.querySelector('#global-example'));
