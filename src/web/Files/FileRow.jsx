import React from "react";
import { Image } from "semantic-ui-react";
import icons from "../../Icons";

const FileRow = props => {

    const { row } = props;
    const push = props.history.push;
    const className = ["file-row"];

    let icon = icons[row.icon] || icons.file;

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

            {icon && <Image src={icon} />}

        </div>

        <div className="file-row-name" title={row.name}>
            <span>{row.name}</span>
        </div>

    </div>

}

export default FileRow;