/**
 * @author v1ndic4te
 * @copyright 2018
 * @licence GPL-3.0
 */

const React = require('react');
import {ContextMenuWrapper, prepareContextMenuHandlers} from '../../src';

const boxes = [
    ['Geralt', {backgroundColor: '#ffb7c6', color: '#6c1426'}],
    ['Yennefer', {}],
    ['Ciri', {}],
];

export class NestedExample extends React.Component {
    renderBox(boxAcc) {
        if (boxAcc.length === 0) return;

        const box = boxAcc.shift();
        const name = box[0];
        const style = box[1];
        const handlers = prepareContextMenuHandlers(name);
        return <div className="my-box-nested" style={style} {...handlers}>
            <span>{name}</span>
            {this.renderBox(boxAcc)}

            <ContextMenuWrapper id={name}>
                <div className="dropdown is-active">
                    <div className="dropdown-menu">
                        <div className="dropdown-content" style={{backgroundColor: '#ffe5ea'}}>
                            <div className="dropdown-item">
                                This menu belongs to <strong>{name}</strong>!
                            </div>
                        </div>
                    </div>
                </div>
            </ContextMenuWrapper>
        </div>;
    }

    render() {
        return this.renderBox(boxes.slice(0));
    }
}
