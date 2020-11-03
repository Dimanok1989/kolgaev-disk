import React from 'react';

import Users from './Users';
import Files from './Files';
import UploadFile from './UploadFile';

import FontAwesomeIcon from './../../Utils/FontAwesomeIcon';

class Content extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            select: null,
            folder: null,
            newFile: null,
        }

    }

    componentDidMount = () => {

        const query = new URLSearchParams(window.location.search);

        this.setState({
            select: query.get('user') || null,
        });

    }

    /**
     * Передача идентификатор выбранного пользователя
     * @param {number} user 
     */
    setUserId = user => {

        window.history.pushState({ user }, `Файлы ${user}`, `?user=${user}`);

        this.setState({
            select: user,
        });

    }

    setFolderId = folder => {

        this.setState({
            folder,
        });

    }

    /**
     * Добавление только что загруженного файла в список всех файлов
     * @param {object} file объект данных нового файла 
     */
    pushFileList = file => {

        this.setState({ newFile: file });

    }

    render() {

        if (!this.props.isLogin)
            return null;

        let addFiles = null;

        addFiles = <UploadFile userId={this.state.select} folder={this.state.folder} pushFileList={this.pushFileList} />;

        return (
            <div className="p-2 mx-auto d-flex justify-content-between content-files">
                <Users user={this.state.select} setUserId={this.setUserId} />
                <Files user={this.state.select} setFolderId={this.setFolderId} newFile={this.state.newFile} />
                {addFiles}
            </div>
        )

    }

}

export default Content;
