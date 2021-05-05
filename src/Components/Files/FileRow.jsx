import * as Icon from './FileIcons'

function FileRow(props) {

    const file = props.file;

    const icon = file.thumb_litle
        ? file.thumb_litle
        : Icon[file.icon] ?? Icon.file;

    if (file.empty) {
        return <div className="files-list-row files-list-row-empty">
            <div className="file-list-empty"></div>
        </div>
    }

    const name = file.name + (file.is_dir === 0 ? `.${file.ext}` : ``);

    return <div className="files-list-row" title={name} onClick={() => props.clickFile(file)}>
        <div className="d-flex justify-content-center align-items-center file-row-icon">
            <img src={icon} alt={`file_${file.id}`} />
        </div>
        <div className="file-name-text">{name}</div>
    </div>

}

export default FileRow;