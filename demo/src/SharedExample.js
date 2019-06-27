/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @licence MIT
 */

import React from 'react';
import {ContextMenuWrapper, prepareContextMenuHandlers} from '../../src';

const baseStyle = {backgroundColor: '#ffb7c6', color: '#6c1426'};
const selectedStyle = {backgroundColor: '#a3eee3', color: '#007d6a'};
const boxNames = ['Geralt', 'Yennefer', 'Ciri', 'Triss', 'Dandelion'];

const MyContextMenu = (props) => {
    const name = props.name || 'no one';
    const selected = props.selected;
    const onClick = (event) => {
        event.preventDefault();
        if (props.name) props.toggleState(props.name);
    };

    const backgroundColor = selected ? '#e1fff5' : '#ffe5ea';
    return (
        <div className="dropdown is-active">
            <div className="dropdown-menu">
                <div className="dropdown-content" style={{backgroundColor}}>
                    <div className="dropdown-item">
                        This menu belongs to <strong>{name}</strong>!
                    </div>
                    <hr className="dropdown-divider"/>
                    <a href="#" className="dropdown-item" onClick={onClick}>
                        Toggle {name}'s state
                    </a>
                </div>
            </div>
        </div>
    );
};

export class SharedExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selection: {},
        };
    }

    toggleBoxState = name => {
        const {selection} = this.state;
        this.setState({
            selection: {
                ...selection,
                [name]: !selection[name],
            },
        });
    };

    renderBoxes() {
        const {selection} = this.state;
        const comps = new Array(boxNames.length);
        for (let i = 0; i < boxNames.length; i++) {
            const name = boxNames[i];
            const selected = selection[name];
            const style = selected ? selectedStyle : baseStyle;
            const handlers = prepareContextMenuHandlers({id: 'my-shared-example', data: name});
            comps[i] = <div key={name} className="column">
                <div className="my-box" style={style} {...handlers}>{selected ? `-[ ${name} ]-` : name}</div>
            </div>;
        }
        return comps;
    }

    render() {
        const {selection} = this.state;

        const renderMenu = name => {
            return <MyContextMenu name={name} selected={selection[name]} toggleState={this.toggleBoxState}/>;
        };
        return (
            <div>
                <ContextMenuWrapper id="my-shared-example" onShow={this.handleContextMenuShow} render={renderMenu}/>
                <div className="columns">{this.renderBoxes()}</div>
            </div>
        );
    }
}
