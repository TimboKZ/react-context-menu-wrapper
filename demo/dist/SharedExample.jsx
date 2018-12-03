const React = require('react');
import {ContextMenuWrapper, prepareContextMenuHandlers} from 'react-context-menu-wrapper';

const style = {backgroundColor: '#ffb7c6', color: '#6c1426'};
const boxNames = ['Geralt', 'Yennefer', 'Ciri', 'Triss', 'Dandelion'];

export class SharedExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            owner: 'no one',
            selected: {},
        };
    }

    toggleCurrentOwnerState = event => {
        event.preventDefault();
        const selected = this.state.selected;
        this.setState({
            selected: {
                ...selected,
                [this.state.owner]: !selected[this.state.owner],
            },
        });
    };

    handleContextMenuShow = data => {
        this.setState({owner: data ? data : 'no one'});
    };

    renderBoxes() {
        const comps = new Array(boxNames.length);
        for (let i = 0; i < boxNames.length; i++) {
            const name = boxNames[i];
            const selected = this.state.selected[name];
            const handlers = prepareContextMenuHandlers({id: 'my-shared-example', data: name});
            comps[i] = <div key={name} className="column">
                <div className="my-box" style={style} {...handlers}>{selected ? `-[ ${name} ]-` : name}</div>
            </div>;
        }
        return comps;
    }

    render() {
        return (
            <div>
                <div className="columns">
                    {this.renderBoxes()}
                </div>

                <ContextMenuWrapper id="my-shared-example" onShow={this.handleContextMenuShow}>
                    <div className="dropdown is-active">
                        <div className="dropdown-menu">
                            <div className="dropdown-content" style={{backgroundColor: '#ffe5ea'}}>
                                <div className="dropdown-item">
                                    This menu belongs to <strong>{this.state.owner}</strong>!
                                </div>
                                <hr className="dropdown-divider"/>
                                <a href="#" className="dropdown-item" onClick={this.toggleCurrentOwnerState}>
                                    Toggle {this.state.owner}'s state
                                </a>
                            </div>
                        </div>
                    </div>
                </ContextMenuWrapper>
            </div>
        );
    }
}
