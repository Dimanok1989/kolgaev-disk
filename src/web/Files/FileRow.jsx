import React from "react";
import { Icon } from "semantic-ui-react";
import { useActions } from "../../hooks/useActions";
import useFileIcon from "./useFileIcon";

const FileRow = props => {

    const push = props.history.push;
    const inFolder = props?.match?.params[0] || null;
    const className = ["file-row position-relative"];

    const { row, selected } = props;
    const { showMenu, setShowMenu } = props;
    const { setShowImage } = useActions();

    const { icon, type } = useFileIcon(row);

    if (row.is_dir || row.is_image)
        className.push("cursor-pointer");

    if (selected)
        className.push("selected-file-row");

    const onClick = React.useCallback(() => {

        if (row.is_dir) return push(`${inFolder ? `/${inFolder}` : ""}/${row.link}`);
        else if (row.is_image) return setShowImage(row.link);

    }, [row]);

    const onContextMenu = React.useCallback(e => {

        e.preventDefault();

        if (row.deleted_at) return;

        const data = {
            id: row.id,
            file: row,
            pageX: e.clientX,
            pageY: e.clientY,
        }

        setShowMenu(data)

    }, [row]);

    return <div
        className={className.join(' ')}
        onClick={onClick}
        onContextMenu={onContextMenu}
        id={`file-row-${row.id}`}
        style={{ opacity: row.deleted_at ? "0.5" : "1" }}
    >

        <div className="file-row-icon">

            {icon}

            {row.is_video && type === "video" && <div className="file-icon-action">
                <span className="play-bg">
                    <span>
                        <Icon name="play" fitted link />
                    </span>
                </span>
            </div>}

        </div>

        <div className="file-row-name" title={row.name}>
            <span style={{ textDecoration: row.deleted_at ? "line-through" : "none" }}>{row.name}</span>
        </div>

    </div>

}

export default FileRow;