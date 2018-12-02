/**
 * @author v1ndic4te
 * @copyright 2018
 * @licence GPL-3.0
 */

const React = require('react');
import {showContextMenu, hideAllContextMenus} from '../../src';

const style = {backgroundColor: '#a3eee3', color: '#007d6a'};
const boxes = [
    // 1) Box name, 2) Context menu ID
    ['local', 'my-custom-id'],
    ['global', null],
    ['shared', 'my-shared-example'],
    ['nested', 'Geralt'],
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
                <div className="my-box" style={style} onClick={event => this.handleBoxClick(id, event)}>
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
