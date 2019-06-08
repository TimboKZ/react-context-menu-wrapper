/**
 * @author v1ndic4te
 * @copyright 2018
 * @licence GPL-3.0
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {
    warn,
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
    determineContextMenuPlacement,
    isFirefox
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
        hideOnEscape: PropTypes.bool,
        hideOnScroll: PropTypes.bool, // TODO: Fix scroll on internal components - right now the menu won't hide.
        hideOnWindowResize: PropTypes.bool,
    };

    static defaultProps = {
        id: null,
        onShow: null,
        onHide: null,

        hideOnEscape: true,
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

        /*
         Whether to ignore right click events:
         Firefox has a bug where it dispatches a click event when a contextmenu
         event is dispatched. It's been open for 17 years!
         https://bugzilla.mozilla.org/show_bug.cgi?id=184051
         Hence, on Firefox, the context menu would immediately close on releasing
         the right mouse button.
         However, we may want to close previous context menus when right-clicking
         somewhere outside of some context menu.

         Fix: Ignore all events from right clicks in Firefox caused by opening
         new ContextMenuWrapper instances until the right mouse button is released.
         This has to be achieved with a timeout because multiple right mouse click
         events are being dispatched.
         Note that simply preventing closure of context menus in the case of
         right click events does not work because we might right-click
         and open a native context menu. In that case, we would want 'our'
         ContextMenuWrapper component to be closed.
         TODO(cuontheinternet): Get rid of timeout/What events are actually happening
        */
        this.ignoreRightClick = false;

        // Props that toggle simple event listeners
        this.toggleProps = [
            // Property, Target, Event, Handler
            [null, window, InternalEvent.HideAllContextMenus, this.hide],
            [null, window, InternalEvent.TryShowContextMenu, this.handleShowRequest],
            ['hideOnEscape', document, 'keydown', this.handleKeydown],
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

        // Firefox workaround, see constructor
        if (isFirefox) document.addEventListener('mouseup', this.handleMouseup);

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

        // ...otherwise process this event as if it was meant for us (but we're not sure yet, there may be other
        // handlers that have precedence over us.
        const showIntent = {
            internalId: this.internalId,
            externalId: ourExternalId,
            eventDetails,
            data: detail.data,
        };
        registerShowIntent(showIntent);
    };

    handleMouseup = () => {
        if (this.state.visible) {
            // Hack for Firefox, see comment in constructor
            setTimeout(() => this.ignoreRightClick = false, 1);
        }
    }

    /**
     * Clicking might imply that we should close the context menu.
     */
    handleClick = (event) => {
        const isRightClick = event.button === 2;
        if (isFirefox && this.ignoreRightClick && isRightClick) return;

        if (!this.state.visible) return;

        const node = this.nodeRef.current;
        const wasOutside = event.target !== node && !node.contains(event.target);

        if (wasOutside && this.props.hideOnOutsideClick) this.hide();
        else if (this.props.hideOnSelfClick) {
            if (event.touches) setTimeout(() => this.hide(), 200);
            else this.hide();
        }
    };

    handleKeydown = (event) => {
        // Hide on escape
        if (event.keyCode === 27) this.hide();
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

        this.ignoreRightClick = true;

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

