import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from './../../system/axios';

import { connect } from 'react-redux';
import { setFilesList, setLoadingFiles, setOpenFolder, setBreadCrumbs } from './../../store/files/actions';

import { Loader } from 'semantic-ui-react';

import './files.css';
import FilesList from './FilesList';
import BreadCrumbs from './BreadCrumbs';

/**
 * Инициализация параметров
 * 
 * @param {object} props 
 * @return {object}
 */
function Files(props) {

    const userId = props.selectedUser;

    const [files, setFiles] = React.useState([]);
    const { setFilesList, setBreadCrumbs } = props;

    const [page, setPage] = React.useState(1);
    const [loading, setLoading] = React.useState(false);
    const [process, setProcess] = React.useState(false);
    const [endFiles, setEndFiles] = React.useState(false);

    const { openFolder, setOpenFolder } = props;
    const [openedFolder, setOpenedFolder] = React.useState(null);

    const query = new URLSearchParams(props.location.search);
    const openFolderUri = Number(query.get('folder')) || null;
    const [openFolderUriChecked, setOpenFolderUriChecked] = React.useState(null);


    React.useEffect(() => {
        setOpenFolder(openFolderUri);
    }, [openFolderUri, setOpenFolder, userId]);


    React.useEffect(() => {

        if (!openFolderUriChecked) {
            setOpenFolder(openFolderUri);
            setOpenFolderUriChecked(openFolderUri);
        }

        setOpenedFolder(openFolder);
        setEndFiles(false);
        setPage(1);
        setFilesList([]);

    }, [openFolder, userId, setOpenFolder, setFilesList]);


    React.useEffect(() => {

        setFilesList(files);

    }, [files, setFilesList]);


    React.useEffect(() => {

        if ((userId && !loading) || process) {

            let pageNum = page;

            if (openedFolder !== openFolder) {
                setPage(1);
                pageNum = 1;
            }            

            setLoading(true);
            setProcess(false);

            axios.post('disk/getUserFiles', {
                id: userId,
                folder: openFolder,
                page: pageNum,
            }).then(({ data }) => {

                let filesList = [];

                data.dirs.forEach(dir => filesList.push(dir));
                data.files.forEach(file => filesList.push(file));

                setFiles(pageNum === 1 ? filesList : [...files, ...filesList]);
                setPage(prevState => prevState + 1);
                setBreadCrumbs(data.paths);

                if (data.next > data.last) {
                    setEndFiles(true);
                }

            }).catch(error => {

            }).finally(() => {
                setLoading(false);
            });

        }

    }, [process, userId, openFolder, setFilesList, setBreadCrumbs]);


    React.useEffect(() => {

        const scrollHandler = e => {

            let scrollHeight = e.target.documentElement.scrollHeight,
                scrollTop = e.target.documentElement.scrollTop,
                innerHeight = window.innerHeight;
    
            let scroll = scrollHeight - (scrollTop + innerHeight);
    
            if (scroll < 100 && !endFiles && !loading) {
                setProcess(true);
            }
    
        }

        document.addEventListener('scroll', scrollHandler);

        return () => document.removeEventListener('scroll', scrollHandler);

    }, [endFiles, loading]);


    const empty = loading
        ? null
        : <div className="empty-files-list">Файлов еще нет</div>

    const filesList = props.files.length
        ? <FilesList />
        : empty

    return <div className="files-content mx-1">
        <BreadCrumbs loading={loading} />
        {filesList}
        {loading ? <Loader active inline="centered" /> : null}
    </div>

}

const mapStateToProps = state => ({
    selectedUser: state.users.selectedUser,
    openFolder: state.files.openFolder,
    files: state.files.filesList,
});

const mapDispatchToProps = {
    setFilesList, setLoadingFiles, setOpenFolder, setBreadCrumbs
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Files));