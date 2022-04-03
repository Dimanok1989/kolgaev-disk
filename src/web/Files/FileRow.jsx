import React from "react";
import { Icon, Image } from "semantic-ui-react";
import { useActions } from "../../hooks/useActions";
import icons from "../../Icons";

const FileRow = props => {

    const { row } = props;
    const { setShowImage } = useActions();
    const push = props.history.push;
    const className = ["file-row"];

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
            onClick={() => {
                if (row.is_image) return setShowImage(row.link);
            }}
        />
    } else {
        icon = <Image src={icons[row.icon] || icons.file} />
    }

    if (row.is_dir)
        className.push("cursor-pointer");

    const click = React.useCallback(() => {

        if (row.is_dir) {
            return push(`/${row.link}`);
        }

    }, [row]);

    return <div
        className={className.join(' ')}
        onClick={click}
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