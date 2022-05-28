import React from "react";
import { Dropdown } from "semantic-ui-react";

const FileRowContextMenu = props => {

    const { pageX, pageY, setShowMenu } = props;
    const dropdown = React.useRef();

    const hide = React.useCallback(() => setShowMenu(false));

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

        setTimeout(() => document.addEventListener('click', hide), 50);

        return () => {
            document.removeEventListener('click', hide);
        }

    }, [pageX, pageY]);

    const options = [
        { text: props.id, value: 1, onClick: () => hide() },
        { text: 'Choice 2', value: 2, onClick: () => hide() },
    ];

    return <Dropdown
        open={true}
        header={"Меню"}
        options={options.map((row, i) => ({ ...row, key: i }))}
        value={null}
        icon={false}
        ref={dropdown}
        className="position-fixed"
        style={{ zIndex: "1" }}
    />

}

export default FileRowContextMenu;