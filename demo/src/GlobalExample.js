/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @licence MIT
 */

import React from 'react';
import {ContextMenuWrapper} from '../../src';

const MyContextMenu = (props) => {
    const onClick = props.changePageColour;
    return (
        <div className="dropdown is-active">
            <div className="dropdown-menu">
                <div className="dropdown-content" style={{backgroundColor: '#e2f2fd'}}>
                    <div className="dropdown-item">
                        This is a <strong>global</strong> context menu. It is styled using classes from
                        the <a href="https://bulma.io/documentation/components/dropdown/"
                               target="_blank">Bulma CSS framework.</a>
                    </div>
                    <hr className="dropdown-divider"/>
                    <a href="#" className="dropdown-item" onClick={onClick}>
                        Change page background
                    </a>
                </div>
            </div>
        </div>
    );
};

export class GlobalExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {enabled: true};
    }

    handleChange = event => this.setState({enabled: event.target.checked});

    render() {
        const {enabled} = this.state;

        return <div>
            {/* Create a context menu */}
            {enabled &&
            <ContextMenuWrapper global={true}>
                <MyContextMenu changePageColour={window.changePageColour}/>
            </ContextMenuWrapper>
            }

            <div className="field">
                <input id="global-switch" type="checkbox" className="switch is-large is-info"
                       checked={enabled || ''} onChange={this.handleChange}/>
                <label htmlFor="global-switch">
                    Flip this switch to {enabled ? 'disable' : 'enable'} the global context menu.
                </label>
            </div>
        </div>;
    }
}
