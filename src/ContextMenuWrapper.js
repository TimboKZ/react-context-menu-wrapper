/**
 * @author v1ndic4te
 * @copyright 2018
 * @licence GPL-3.0
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {
    warn,
    EventNames,
    generateInternalId,
    registerGlobalContextMenu,
    removeGlobalContextMenu,
    setLastTriggerData,
    getLastTriggerData,
    getPropertySize,
    hideAllContextMenus,
} from './util';

export default class ContextMenuWrapper extends Component {

    static propTypes = {
        id: PropTypes.string,
        onShow: PropTypes.func,

        hideOnSelfClick: PropTypes.bool,
        hideOnOutsideClick: PropTypes.bool,

        // Props that toggle simple event listeners
        global: PropTypes.bool,
        hideOnScroll: PropTypes.bool, // TODO: Fix scroll on internal components - right now the menu won't hide.
        hideOnWindowResize: PropTypes.bool,
    };

    static defaultProps = {
        id: null,
        onShow: null,

        hideOnSelfClick: true,
        hideOnOutsideClick: true,

        // Props that toggle simple event listeners
        global: false,
        hideOnScroll: true,
        hideOnWindowResize: true,
    };


    constructor(props) {
        super(props);
        this.state = {
            node: null,
            visible: false,
            style: {},
        };
        this.internalId = generateInternalId();

        // Reference to our own <div>
        this.nodeRef = React.createRef();

        // Props that toggle simple event listeners
        this.toggleProps = [
            // Property, Target, Event, Handler
            [null, window, EventNames.HideAllContextMenus, this.hide],
            ['id', window, EventNames.ShowContextMenu, this.handleContextMenu],
            ['global', document, 'contextmenu', this.handleContextMenu],
            ['hideOnScroll', document, 'scroll', this.hide],
            ['hideOnWindowResize', window, 'resize', this.hide],
        ];

        // Warn users about bad props
        if (!this.props.id && !this.props.global) {
            warn('A \'ContextMenuWrapper\' component you created is not global and does not have an ' +
                '\'id\' specified. As such, nothing can trigger it and it will never be displayed.');
        }
    }

    updateGlobalRegistration(mounted, oldValue = null) {
        const isGlobal = this.props.global;
        if (oldValue !== null && isGlobal === oldValue) return;

        if (isGlobal && !mounted) removeGlobalContextMenu(this.internalId);
        else if (isGlobal) registerGlobalContextMenu(this.internalId);
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClick);

        // Setup toggleable handlers
        for (const toggleProp of this.toggleProps) {
            const [name, target, event, handler] = toggleProp;
            if (!name || this.props[name]) target.addEventListener(event, handler);
        }

        this.updateGlobalRegistration(true);
    }

    componentDidUpdate(prevProps, prevState) {
        // Update toggleable handlers
        for (const toggleProp of this.toggleProps) {
            const [name, target, event, handler] = toggleProp;
            if (name && this.props[name] !== prevProps[name]) {
                if (this.props[name]) target.addEventListener(event, handler);
                else target.removeEventListener(event, handler);
            }
        }

        this.updateGlobalRegistration(true, this.props.global);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClick);

        // Remove toggleable handlers
        for (const toggleProp of this.toggleProps) {
            const [name, target, event, handler] = toggleProp;
            if (!name || this.props[name]) target.removeEventListener(event, handler);
        }

        this.updateGlobalRegistration(false);
    }

    handleContextMenu = (event) => {
        if (event.detail && event.detail.externalId) {
            // Was triggered by a remote event.
            const ourId = this.props.id;
            const requestId = event.detail.externalId;
            const realEvent = event.detail.event;

            // Do nothing if ID does not match ours
            if (!ourId || ourId !== requestId) return;

            const data = event.detail.data;
            setLastTriggerData(this.internalId, data);
            this.show(realEvent);
        } else {
            // Was triggered by a handler we setup.
            setLastTriggerData(this.internalId, null);
            this.show(event);
        }
    };

    handleClick = (event) => {
        if (!this.state.visible) return;

        const node = this.nodeRef.current;
        const wasOutside = event.target !== node && !node.contains(event.target);

        if (wasOutside && this.props.hideOnOutsideClick) this.hide();
        else if (this.props.hideOnSelfClick) return this.hide();
    };

    show = event => {
        event.preventDefault();
        const clickX = event.clientX;
        const clickY = event.clientY;
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;

        let rootW = 100;
        let rootH = 50;
        const domNode = this.nodeRef.current;
        if (domNode) {
            rootW = getPropertySize(domNode, 'width');
            rootH = getPropertySize(domNode, 'height');
        }

        const right = (screenW - clickX) > rootW;
        const left = !right;
        const top = (screenH - clickY) > rootH;
        const bottom = !top;

        const style = {};
        if (right) style.left = `${clickX + 5}px`;
        if (left) style.left = `${clickX - rootW - 5}px`;
        if (top) style.top = `${clickY + 5}px`;
        if (bottom) style.top = `${clickY - rootH - 5}px`;

        hideAllContextMenus();
        if (this.props.onShow) this.props.onShow(getLastTriggerData(this.internalId));
        this.setState({
            visible: true,
            style: {
                ...this.state.style,
                ...style,
            },
        });
    };

    hide = () => {
        if (this.state.visible) this.setState({visible: false});
    };

    render() {
        const style = {
            zIndex: '999',
            position: 'fixed',
            ...this.state.style,
            display: this.state.visible ? 'block' : 'none',
        };

        return (
            <div style={style} ref={this.nodeRef}>
                {this.props.children}
            </div>
        );
    }
}

