import React from 'react';

import Users from './Users';
import Files from './Files/Files';
import UploadFile from './UploadFile';

// import FontAwesomeIcon from './../../Utils/FontAwesomeIcon';

class Content extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            select: null,
            folder: null,
            newFile: null,
            search: null,
        }

    }

    componentDidMount = () => {

        // Преобрвазоание поикового запроса из ссылки в объект
        const query = new URLSearchParams(this.props.location.search);

        // Установка выбранного пользователя
        this.setState({ select: Number(query.get('user')) || null });

    }

    /**
     * Обновление свойств в компоненте
     * 
     * @param {object} prevProps 
     */
    componentDidUpdate = prevProps => {

        // Преобрвазоание поикового запроса из ссылки в объект
        const query = new URLSearchParams(this.props.location.search);
        let select =  Number(query.get('user')) || null, // Идентификатор выбранного пользователя
            folder = Number(query.get('folder')) || null; // Идентификатор открытого каталога

        // Установка выбранного пользователя, если отличается от предыдущих данных
        if (select !== this.state.select)
            this.setState({ select });

        if (folder !== this.state.folder)
            this.setState({ folder });

    }

    /**
     * Передача идентификатор выбранного пользователя
     * @param {number} user 
     */
    setUserId = user => {

        // window.history.pushState({ user }, `Файлы ${user}`, `?user=${user}`);

        this.setState({ select: user });

    }

    setFolderId = folder => {

        this.setState({ folder });

    }

    /**
     * Добавление только что загруженного файла в список всех файлов
     * 
     * @param {object} file объект данных нового файла 
     */
    pushFileList = file => {

        this.setState({ newFile: file });

    }

    render() {

        let addFiles = null;

        if (Number(localStorage.getItem('user')) === this.state.select)
            addFiles = <UploadFile userId={this.state.select} folder={this.state.folder} pushFileList={this.pushFileList} />;

        return (
            <div className="p-2 mx-auto mt-3 d-flex justify-content-between content-files position-relative">
                <Users user={this.state.select} setUserId={this.setUserId} />
                <Files user={this.state.select} setFolderId={this.setFolderId} newFile={this.state.newFile} folder={this.state.folder} />
                {addFiles}
            </div>
        )

    }

    componentWillUnmount = () => {

        this.setState({
            select: null,
            folder: null,
            newFile: null,
            search: null,
        });

    }

}

export default Content;
