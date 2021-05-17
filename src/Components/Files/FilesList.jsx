import React from 'react';
import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import { setOpenFolder, setShowPhoto, setRenameFileId, showDeleteFile, setDownloadArchive } from './../../store/files/actions';

import FileRow from './FileRow';
import ShowPhoto from './../Photos/ShowPhoto';

/**
 * Вывод списка файлов выбранного пользователя и выбранного каталога
 * 
 * @param {object} props 
 * @return {object}
 */
function FilesList(props) {

    const { files, setDownloadArchive, createArchiveProcess } = props;

    const clickFile = file => {

        if (file.is_dir === 1) {
            props.setOpenFolder(file.id);
            props.history.push(`?folder=${file.id}`);
        }
        else if (file.thumb_litle) {
            props.setShowPhoto(file.id);
        }

    }

    // Добавление пустышек для выравнивания сетки файлов
    let filesList = [];
    for (let i = 0; i < 7; i++) {
        filesList.push({
            id: i + "empty",
            empty: true,
        });
    }

    const list = files.map(file => <FileRow
        key={file.id}
        file={file}
        clickFile={clickFile}
        user={props.user.id}
        userId={props.userId}
        setRenameFileId={props.setRenameFileId}
        showDeleteFile={props.showDeleteFile}
        createArchiveProcess={createArchiveProcess}
        downloadArchive={setDownloadArchive}
    />);
    const empties = filesList.map(file => <FileRow key={file.id} file={file} />);

    return <div className="files-list">

        {list}
        {empties}

        <ShowPhoto />

    </div>

}

const mapStateToProps = state => ({
    files: state.files.filesList,
    user: state.main.user,
    userId: state.users.selectedUser,
    createArchiveProcess: state.files.createArchiveProcess,
});

const mapDispatchToProps = {
    setOpenFolder, setShowPhoto, setRenameFileId, showDeleteFile, setDownloadArchive
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FilesList));