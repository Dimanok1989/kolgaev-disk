const FileRow = props => {

    const { row } = props;
    const className = ["file-row"];

    return <div className={className.join(' ')}>

        <div className="file-row-icon">

        </div>

        <div className="file-row-name" title={row.name}>
            <span>{row.name}</span>
        </div>

    </div>

}

export default FileRow;