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
            newFolder: null,
            search: null,
            online: [],
        }

    }

    componentDidMount = () => {

        // Преобрвазоание поикового запроса из ссылки в объект
        const query = new URLSearchParams(this.props.location.search);

        // Установка выбранного пользователя
        this.setState({
            select: Number(query.get('user')) || null,
            folder: Number(query.get('folder')) || null
        });

        window.Echo.join('App.Disk')
            .here(users => {
                let online = this.state.online;
                users.forEach(user => online.push(user.id));
                this.setState({ online });
            })
            .joining(user => {
                let online = this.state.online;
                online.push(user.id);
                this.setState({ online });
            })
            .leaving(user => {
                
                let online = this.state.online,
                    indexOf = online.indexOf(user.id);

                if (indexOf >= 0) {
                    online.splice(indexOf, 1);
                    this.setState({ online });
                }
                
            })
            .listen('DiskOnline', (data) => console.log(data))

    }

    /**
     * Обновление свойств в компоненте
     */
    componentDidUpdate = () => {

        // Преобрвазоание поикового запроса из ссылки в объект
        const query = new URLSearchParams(this.props.location.search);
        let select = Number(query.get('user')) || null, // Идентификатор выбранного пользователя
            folder = Number(query.get('folder')) || null; // Идентификатор открытого каталога

        // Установка выбранного пользователя, если отличается от предыдущих данных
        if (select !== this.state.select)
            this.setState({ select });

        if (folder !== this.state.folder)
            this.setState({ folder });

    }

    /**
     * Передача идентификатор выбранного пользователя
     * 
     * @param {number} user 
     */
    setUserId = user => {

        // window.history.pushState({ user }, `Файлы ${user}`, `?user=${user}`);

        this.setState({
            select: user,
            folder: null
        });

    }

    /**
     * Установка идентификатора открытого каталога
     * 
     * @param {number|null} folder Идентификатор каталога
     */
    setFolderId = folder => this.setState({ folder });

    /**
     * Добавление только что загруженного файла в список всех файлов
     * 
     * @param {object} file объект данных нового файла 
     */
    pushFileList = file => this.setState({ newFile: file });

    /**
     * Создание нового каталога
     * 
     * @param {object} dir Объект нового каталога 
     */
    pushNewFolder = dir => this.setState({ newFolder: dir });

    render() {

        let addFiles = null;

        if (Number(window.user.id) === Number(this.state.select))
            addFiles = <UploadFile userId={this.state.select} folder={this.state.folder} pushFileList={this.pushFileList} />;

        return (
            <div className="p-2 mx-auto mt-3 d-flex justify-content-between content-files position-relative">

                <Users user={this.state.select} setUserId={this.setUserId} pushNewFolder={this.pushNewFolder} online={this.state.online} />

                <Files user={this.state.select} setFolderId={this.setFolderId} newFile={this.state.newFile} folder={this.state.folder} newFolder={this.state.newFolder} />

                {addFiles}

            </div>
        )

    }

}

export default Content;
