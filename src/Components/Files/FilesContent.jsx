import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from './../../system/axios';

import { connect } from 'react-redux';
import { setFilesList, setLoadingFiles } from './../../store/files/actions';
import { selectUser } from './../../store/users/actions';

import { Loader } from 'semantic-ui-react';

import FilesList from './FilesList';

function FilesContent(props) {

    const { setFilesList, selectedUser, setLoadingFiles } = props;
    const selected = props?.match?.params?.id || null;
    
    const [loading, setLoading] = React.useState(false);

    if (selected && !selectedUser)
        props.selectUser(selected);

    React.useEffect(() => {

        if (selectedUser) {

            setLoadingFiles(true);
            setLoading(true);
            setFilesList([]);

            axios.post('disk/getUserFiles', { id: selectedUser}).then(({ data }) => {

                let files = [];

                data.dirs.forEach(dir => files.push(dir));
                data.files.forEach(file => files.push(file));

                // Добавление пустышек для выравнивания сетки файлов
                for (let i = 0; i < 7; i++) {
                    files.push({
                        id: i + "empty",
                        empty: true,
                    });
                }

                setFilesList(files);

            }).catch(error => {

            }).then(() => {
                setLoadingFiles(false);
                setLoading(false);
            });

        }

    }, [selectedUser, setFilesList, setLoadingFiles]);

    return <div className="files-content mx-1">
        <FilesList />
        {loading ? <Loader active inline="centered" /> : null}
    </div>

}

const mapStateToProps = state => ({
    selectedUser: state.users.selectedUser,
});

const mapDispatchToProps = {
    setFilesList, selectUser, setLoadingFiles
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FilesContent));