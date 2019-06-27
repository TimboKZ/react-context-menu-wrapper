/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @licence MIT
 */

import React from 'react';
import {ContextMenuWrapper, prepareContextMenuHandlers} from '../../src';

const boxes = [
    ['Geralt', {backgroundColor: '#ffcccc', color: '#4c1422'}],
    ['Yennefer', {backgroundColor: '#e2f2fd', color: '#0d3552'}],
    ['Ciri', {backgroundColor: '#a7f2e7', color: '#00634f'}],
];

const MyContextMenu = (props) => {
    const {name, backgroundColor} = props;
    return (
        <div className="dropdown is-active">
            <div className="dropdown-menu">
                <div className="dropdown-content" style={{backgroundColor}}>
                    <div className="dropdown-item">
                        This menu belongs to <strong>{name || 'no one'}</strong>!
                    </div>
                </div>
            </div>
        </div>
    );
};

export class NestedExample extends React.Component {
    renderBox(boxAcc) {
        if (boxAcc.length === 0) return;

        const box = boxAcc.shift();
        const name = box[0];
        const style = box[1];
        const handlers = prepareContextMenuHandlers({
            id: 'nested-menu',
            data: {name, backgroundColor: style.backgroundColor},
        });
        return <div className="my-box-nested" style={style} {...handlers}>
            <span>{name}</span>
            {this.renderBox(boxAcc)}

        </div>;
    }

    render() {
        return <div>
            <ContextMenuWrapper id={'nested-menu'} render={data => <MyContextMenu {...data}/>}/>
            {this.renderBox(boxes.slice(0))}
        </div>;
    }
}
