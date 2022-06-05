import React from "react";
import { Dropdown } from "semantic-ui-react";

const FileRowContextMenu = props => {

    const { file, pageX, pageY, setShowMenu, setSelect } = props;
    const dropdown = React.useRef();
    const [open, setOpen] = React.useState(false);

    const hide = React.useCallback(() => setShowMenu(false));

    const select = React.useCallback(data => {
        setSelect(data);
        hide();
    }, []);

    React.useEffect(() => {

        const menu = dropdown.current.ref.current.querySelector('div.menu');

        let correctX = 0,
            correctY = 0;

        if (menu) {

            const offsetWidth = document.getElementById('root').offsetWidth;

            if (offsetWidth < (pageX + menu.offsetWidth)) {
                correctX = (menu.offsetWidth + pageX) - offsetWidth + 2;
            }
        }

        dropdown.current.ref.current.style.top = (pageY - correctY) + "px";
        dropdown.current.ref.current.style.left = (pageX - correctX) + "px";
        setOpen(true);

        setTimeout(() => {
            document.addEventListener('click', hide);
            document.addEventListener('scroll', hide);
        }, 50);

        return () => {
            document.removeEventListener('click', hide);
            document.removeEventListener('scroll', hide);
        }

    }, [pageX, pageY]);

    return <Dropdown
        open={open}
        value={null}
        icon={false}
        ref={dropdown}
        className="position-fixed"
        style={{ zIndex: "1" }}
    >
        <Dropdown.Menu style={{ borderRadius: "0.5rem" }}>
            <Dropdown.Item
                icon="download"
                content="Скачать"
                onClick={() => hide()}
            />
            <Dropdown.Item
                icon="pencil"
                content="Переименовать"
                onClick={() => select({ ...file, context: "rename" })}
            />
            <Dropdown.Divider className="my-0" />
            <Dropdown.Item
                icon="trash"
                content="Удалить"
                onClick={() => hide()}
            />
        </Dropdown.Menu>
    </Dropdown>

}

export default FileRowContextMenu;