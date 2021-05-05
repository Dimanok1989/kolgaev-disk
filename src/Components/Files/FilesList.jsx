import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { setOpenFolder } from './../../store/files/actions';

import FileRow from './FileRow';

function FilesList(props) {

    const clickFile = file => {

        if (file.is_dir === 1) {
            props.setOpenFolder(file.id);
            props.history.push(file.id > 0 ? `?folder=${file.id}` : ``);
        }
        else if (file.thumb_litle) {
            console.log("openPhoto");
        }

    }

    const { files } = props;

    const list = files.map(file => <FileRow key={file.id} file={file} clickFile={clickFile} />);

    return <div className="files-list">{list}</div>

}

const mapStateToProps = state => ({
    files: state.files.filesList,
});

const mapDispatchToProps = {
    setOpenFolder
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FilesList));