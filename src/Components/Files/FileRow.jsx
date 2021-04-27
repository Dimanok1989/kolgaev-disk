import * as Icon from './FileIcons'

function FileRow(props) {

    const file = props.file;
    const icon = Icon[file.icon] ?? Icon.file;

    if (file.empty) {
        return <div className="files-list-row files-list-row-empty">
            <div className="file-list-empty"></div>
        </div>
    }

    const name = file.name + (file.is_dir === 0 ? `.${file.ext}` : ``);

    return <div className="files-list-row" title={name}>
        <img src={icon} />
        <div className="clamped-text">{name}</div>
    </div>

}

export default FileRow;