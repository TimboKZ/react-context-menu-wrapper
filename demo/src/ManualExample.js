/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @licence MIT
 */

import React from 'react';
import {
    ContextMenuEvent,
    addContextMenuEventListener,
    removeContextMenuEventListener,
    showContextMenu,
    hideAllContextMenus,
    cancelOtherContextMenus,
} from '../../src';

const boxes = [
    // 1) Box name, 2) Context menu ID
    ['local', 'my-custom-id'],
    ['global', null],
    ['shared', 'my-shared-example'],
    ['nested', 'nested-menu'],
];

export class ManualExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: {},
        };
        for (const box of boxes) {
            const name = box[0];
            this.state.text[name] = `Open ${name}`;
        }

        this.hideTimeout = null;
    }

    componentDidMount() {
        // Setup listeners for each context menu ID
        for (const box of boxes) {
            const id = box[1];
            addContextMenuEventListener(id, this.handleContextMenuEvent);
        }
    }

    componentWillUnmount() {
        // Remove listeners
        for (const box of boxes) {
            const id = box[1];
            removeContextMenuEventListener(id, this.handleContextMenuEvent);
        }
    }

    handleContextMenuEvent = (eventName, data, publicProps) => {
        // Figure out what word to use
        let word;
        if (eventName === ContextMenuEvent.Show) word = 'Showing';
        else if (eventName === ContextMenuEvent.Hide) word = 'Open';
        else word = 'Open'; // For forward-compatibility, in case we add new states in the future

        // Figure out the name of the box from the ID
        const id = publicProps.id;
        let name;
        for (const box of boxes) {
            if (box[1] === id) {
                name = box[0];
                break;
            }
        }

        // Update the text on the box
        this.setState({
            text: {
                ...this.state.text,
                [name]: `${word} ${name}`,
            },
        });
    };

    handleBoxClick(id, event) {
        showContextMenu({id, event});

        clearTimeout(this.hideTimeout);
        this.hideTimeout = setTimeout(hideAllContextMenus, 1000 * 2);
    }

    renderBoxes() {
        const comps = new Array(boxes.length);
        for (let i = 0; i < boxes.length; i++) {
            const box = boxes[i];
            const name = box[0];
            const id = box[1];
            comps[i] = <div key={name} className="column">
                <div className="button is-primary is-large is-fullwidth"
                     onClick={event => this.handleBoxClick(id, event)}
                     onContextMenu={cancelOtherContextMenus}>
                    {this.state.text[name]}
                </div>
            </div>;
        }
        return comps;
    }

    render() {
        return (<div className="columns">{this.renderBoxes()}</div>);
    }
}
