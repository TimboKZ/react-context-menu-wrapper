const React = require('react');
import {ContextMenuWrapper} from 'react-context-menu-wrapper';

export class GlobalExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {enabled: true};
    }

    handleChange = event => this.setState({enabled: event.target.checked});

    renderContextMenu() {
        if (!this.state.enabled) return;
        return (
            <ContextMenuWrapper global={true}>
                <div className="dropdown is-active">
                    <div className="dropdown-menu">
                        <div className="dropdown-content" style={{backgroundColor: '#e2f2fd'}}>
                            <div className="dropdown-item">
                                This is a <strong>global</strong> context menu. It is styled using classes from
                                the <a href="https://bulma.io/documentation/components/dropdown/"
                                       target="_blank">Bulma CSS framework.</a>
                            </div>
                            <hr className="dropdown-divider"/>
                            <a href="#" className="dropdown-item" onClick={window.changePageColour}>
                                Change page background
                            </a>
                        </div>
                    </div>
                </div>
            </ContextMenuWrapper>
        );
    }

    render() {
        const enabled = this.state.enabled;
        return <div>
            {this.renderContextMenu()}
            <div className="field">
                <input id="global-switch" type="checkbox" className="switch is-large is-info"
                       checked={enabled || ''} onChange={this.handleChange}/>
                <label htmlFor="global-switch">
                    Flip this switch to {enabled ? 'disable' : 'enable'} global context menu.
                </label>
            </div>
        </div>;
    }
};
