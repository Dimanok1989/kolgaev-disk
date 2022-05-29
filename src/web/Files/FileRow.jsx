import React from "react";
import { Icon, Image } from "semantic-ui-react";
import { useActions } from "../../hooks/useActions";
import icons from "../../Icons";

const FileRow = props => {

    const push = props.history.push;
    const inFolder = props?.match?.params[0] || null;
    const className = ["file-row position-relative"];

    const { row, selected } = props;
    const { showMenu, setShowMenu } = props;
    const { setShowImage } = useActions();

    let icon = null,
        type = null;

    if (row.thumb_litle_url) {

        type = row.is_video ? "video" : null;

        icon = <Image
            src={row.thumb_litle_url}
            style={{
                maxWidth: 74,
                maxHeight: 74
            }}
            rounded
        />
    } else {
        icon = <Image src={icons[row.icon] || icons.file} />
    }

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

        const data = {
            id: row.id,
            file: row,
            pageX: e.pageX,
            pageY: e.pageY,
        }

        setShowMenu(data)

    }, [row]);

    return <div
        className={className.join(' ')}
        onClick={onClick}
        onContextMenu={onContextMenu}
        id={`file-row-${row.id}`}
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
            <span>{row.name}</span>
        </div>

    </div>

}

export default FileRow;