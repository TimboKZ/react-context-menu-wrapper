import React, { useCallback,  useState } from 'react';
import { ContextMenuWrapper, useContextMenuEvent, useContextMenuTrigger } from 'react-context-menu-wrapper';

const MyContextMenu = React.memo(({ selection, toggleSelection }) => {
    const menuEvent = useContextMenuEvent();
    if (!menuEvent) return null;

    const name = menuEvent.data;
    const onClick = useCallback(() => (name ? toggleSelection(name) : null), [name, toggleSelection]);
    const style = { backgroundColor: selection[name] ? '#d6fffc' : '#ffe4e4' };
    return (
        <div className="context-menu" style={style}>
            <p>You chose {name ? name : 'no one'}.</p>
            <button onClick={onClick}>Toggle state</button>
        </div>
    );
});

const Box = React.memo(({ name, selected, menuId }) => {
    const boxRef = useContextMenuTrigger( { menuId: menuId, data: name });

    const text = selected ? `-[ ${name} ]-` : name;
    let className = 'box';
    if (selected) className += ' box-active';

    return (
        <div ref={boxRef} className={className}>
            <span>{text}</span>
        </div>
    );
});

const SharedMenuExample = React.memo(() => {
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
            <ContextMenuWrapper id={menuId} hideOnSelfClick={false}>
                <MyContextMenu selection={selection} toggleSelection={toggleSelection} />
            </ContextMenuWrapper>
        </div>
    );
});

export default SharedMenuExample;
