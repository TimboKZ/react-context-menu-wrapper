/**
 * @author v1ndic4te
 * @copyright 2018
 * @licence GPL-3.0
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {
    warn,
    isMobileDevice,
    InternalEvent,
    TriggerContext,
    ContextMenuEvent,
    generateInternalId,
    registerGlobalContextMenu,
    removeGlobalContextMenu,
    registerShowIntent,
    setLastTriggerData,
    getLastTriggerData,
    emitContextMenuEvent,
    getPropertySize,
    hideAllContextMenus,
    determineContextMenuPlacement,
} from './util';

export default class ContextMenuWrapper extends Component {

    static propTypes = {
        id: PropTypes.string,
        onShow: PropTypes.func,
        onHide: PropTypes.func,

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
        onHide: null,

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

        // Generate internal ID and relevant intent handling function
        this.internalId = generateInternalId();

        // Reference to our own <div>
        this.nodeRef = React.createRef();

        // Props that toggle simple event listeners
        this.toggleProps = [
            // Property, Target, Event, Handler
            [null, window, InternalEvent.HideAllContextMenus, this.hide],
            [null, window, InternalEvent.TryShowContextMenu, this.handleShowRequest],
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
        if (!oldValue) {
            if (mounted) window.addEventListener(InternalEvent.DoShowContextMenu, this.handleShowCommand);
            else window.removeEventListener(InternalEvent.DoShowContextMenu, this.handleShowCommand);
        }

        const isGlobal = this.props.global;
        if (oldValue !== null && isGlobal === oldValue) return;
        if (isGlobal && !mounted) removeGlobalContextMenu(this.internalId);
        else if (isGlobal) registerGlobalContextMenu(this.internalId);
    }

    componentDidMount() {
        // Listeners for outside/inside clicks
        document.addEventListener('click', this.handleClick);
        document.addEventListener('touchstart', this.handleClick);

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
        // Listeners for outside/inside clicks
        document.removeEventListener('click', this.handleClick);
        document.removeEventListener('touchstart', this.handleClick);


        // Remove toggleable handlers
        for (const toggleProp of this.toggleProps) {
            const [name, target, event, handler] = toggleProp;
            if (!name || this.props[name]) target.removeEventListener(event, handler);
        }

        this.updateGlobalRegistration(false);
    }

    handleShowCommand = (event) => {
        const showIntent = event.detail;

        if (
            // Does not match our ID
            !(showIntent.internalId && showIntent.internalId === this.internalId)
            // AND doesn't trigger us globally
            && !(this.props.global && showIntent.eventDetails.triggerContext === TriggerContext.Global)
        ) return;

        setLastTriggerData(this.internalId, showIntent.data);
        this.show(showIntent);
    };

    handleShowRequest = (event) => {
        const detail = event.detail;
        const ourExternalId = this.props.id;
        const requestExternalId = detail.externalId;
        const eventDetails = detail.eventDetails;

        if (
            // Does not match our ID
            !(ourExternalId && ourExternalId === requestExternalId)
            // AND doesn't trigger us globally
            && !(this.props.global && eventDetails.triggerContext === TriggerContext.Global)
        ) return;

        // ...otherwise process this event as-if it was meant for us (but we're not sure yet, there may be other
        // handlers that have precedence over us.
        const showIntent = {
            internalId: this.internalId,
            externalId: ourExternalId,
            eventDetails,
            data: detail.data,
        };
        registerShowIntent(showIntent);
    };

    handleClick = (event) => {
        if (!this.state.visible) return;

        const node = this.nodeRef.current;
        const wasOutside = event.target !== node && !node.contains(event.target);

        if (wasOutside && this.props.hideOnOutsideClick) this.hide();
        else if (this.props.hideOnSelfClick) {
            if (event.touches) setTimeout(() => this.hide(), 200);
            else this.hide();
        }
    };

    /**
     * @returns {object}
     */
    getPublicProps() {
        const publicPropNames = Object.keys(ContextMenuWrapper.propTypes);
        const publicProps = {};
        for (const propName of publicPropNames) {
            publicProps[propName] = this.props[propName];
        }
        return publicProps;
    }

    show = showIntent => {
        const eventDetails = showIntent.eventDetails;
        const data = getLastTriggerData(this.internalId);
        const publicProps = this.getPublicProps();

        if (this.props.onShow) this.props.onShow(data, publicProps);
        emitContextMenuEvent({
            externalId: this.props.id,
            eventName: ContextMenuEvent.Show,
            data,
            publicProps,
        });
        hideAllContextMenus();

        this.setState({visible: true});

        const {x, y} = determineContextMenuPlacement({
            clickX: eventDetails.x,
            clickY: eventDetails.y,
            domNode: this.nodeRef.current,
        });

        this.setState({
            visible: true,
            style: {
                ...this.state.style,
                left: x,
                top: y,
            },
        });
    };

    hide = () => {
        if (this.state.visible) {
            const data = getLastTriggerData(this.internalId);
            const publicProps = this.getPublicProps();

            this.setState({visible: false});
            if (this.props.onHide) this.props.onHide(data, publicProps);
            emitContextMenuEvent({
                externalId: this.props.id,
                eventName: ContextMenuEvent.Hide,
                data,
                publicProps,
            });
        }
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

