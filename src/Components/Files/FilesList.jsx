import React from 'react';
import { connect } from 'react-redux';

import FileRow from './FileRow';

function FilesList(props) {

    const { files } = props;

    const list = files.map(file => <FileRow key={file.id} file={file} />);

    return <div className="files-list">{list}</div>
    
}

const mapStateToProps = state => ({
    files: state.files.filesList,
});

export default connect(mapStateToProps)(FilesList);