import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { setOpenFolder } from './../../store/files/actions';

import FileRow from './FileRow';

/**
 * Вывод списка файлов выбранного пользователя и выбранного каталога
 * 
 * @param {object} props 
 * @return {object}
 */
function FilesList(props) {

    const { files } = props;

    const clickFile = file => {

        if (file.is_dir === 1) {
            props.setOpenFolder(file.id);
            props.history.push(file.id > 0 ? `?folder=${file.id}` : ``);
        }
        else if (file.thumb_litle) {
            console.log("openPhoto");
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


    const list = files.map(file => <FileRow key={file.id} file={file} clickFile={clickFile} />);
    const empties = filesList.map(file => <FileRow key={file.id} file={file} clickFile={clickFile} />);

    return <div className="files-list">
        {list}
        {empties}
    </div>

}

const mapStateToProps = state => ({
    files: state.files.filesList,
});

const mapDispatchToProps = {
    setOpenFolder
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FilesList));