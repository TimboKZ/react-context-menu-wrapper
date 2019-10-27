import React, { useCallback, useRef, useState } from 'react';
import { ContextMenuWrapper, useContextMenuEvent, useContextMenuHandlers } from 'react-context-menu-wrapper';

const MyContextMenu = ({ toggleSelection }) => {
    const menuEvent = useContextMenuEvent();
    if (!menuEvent) return null;

    const name = menuEvent.data;
    const onClick = useCallback(() => (name ? toggleSelection(name) : null), [name, toggleSelection]);
    return (
        <div className="context-menu">
            <p>You chose {name ? name : 'no one'}.</p>
            <button onClick={onClick}>Toggle state</button>
        </div>
    );
};

const Box = ({ name, selected, menuId }) => {
    const boxRef = useRef();
    useContextMenuHandlers(boxRef, { id: menuId, data: name });

    const text = selected ? `-[ ${name} ]-` : name;
    let className = 'box';
    if (selected) className += ' box-active';

    return (
        <div ref={boxRef} className={className}>
            <span>{text}</span>
        </div>
    );
};

const SharedMenu = () => {
    const [selection, setSelection] = useState({});
    const toggleSelection = useCallback(
        name => {
            setSelection({ ...selection, [name]: !selection[name] });
        },
        [selection]
    );

    const menuId = 'my-context-menu';
    const names = ['Geralt', 'Yennefer', 'Ciri', 'Triss', 'Dandelion'];
    return (
        <div>
            <div className="box-container">
                {names.map(name => (
                    <Box key={name} name={name} selected={selection[name]} menuId={menuId} />
                ))}
            </div>
            <ContextMenuWrapper id={menuId}>
                <MyContextMenu toggleSelection={toggleSelection} />
            </ContextMenuWrapper>
        </div>
    );
};

export default SharedMenu;
