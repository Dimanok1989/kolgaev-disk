import React from 'react';
import UploadModal from './UploadModal';

import axios from './../../Utils/axios';
import echoerror from './../../Utils/echoerror';

// import { Button } from 'react-bootstrap';
// import FontAwesomeIcon from './../../Utils/FontAwesomeIcon';

class UploadFile extends React.Component {

    constructor(props) {

        super(props);

        this.state = {

            files: [], // Список файлов для загузки
            uploaded: [], // Список загруженных файлов

            fileCurrent: -1, // Текущий файл в процессе загрузки
            progressfile: 0, // Процесс загрузки одного файла
            path: false, // Рабочий каталог

            chunk: 4242880, // Размер одной загружаемой части файла
            offset: 0, // Текущая позиция чтения файла
            folder: null, // Идентификатор текущей папки
            user: null, // Идентификатор текущего файла

            allsize: 0, // Общий объем загружаемых файлов
            uploadedsize: 0, // Общий объем загруженных файлов
            progress: 0, // Общий прогресс загрузки

            openModal: false, // Идентификатор открытия модального окна

        }

    }

    componentDidUpdate = () => {

        // Отслеживание изменений значения идентификатора пользователя
        if (this.state.folder !== this.props.folder)
            this.setState({ folder: this.props.folder });

        if (this.state.user !== this.props.userId)
            this.setState({ user: this.props.userId });

    }

    /**
     * Метод сбора информации о файлах и начала загрузки
     * @param {object} e event 
     */
    startUploadFiles = async e => {

        this.setState({
            openModal: true,
            progressfile: 0,
            progress: 0,
        });

        let files = Array.from(e.target.files), // Файлы из формы
            filesData = [], // Файлы на загрузку
            allsize = 0; // Общий размер всех файлов

        let count = 0;
        files.forEach(file => {

            allsize += file.size; // Общий размер всех файлов

            filesData.push({
                id: count, // Порядковый номер в массиве
                name: file.name, // Имя файла
                lastModified: file.lastModified, // Время последнего изменения файла
                lastModifiedDate: file.lastModifiedDate, // Время последнего изменения файла
                size: file.size, // Размер файла
                uploaded: 0, // Размер загруженной части
                progress: 0, // Поцент загрузки файла
                status: 0, // Статус загрузки файла
                error: null, // Ошибка загрузки файла
                folder: this.props.folder, // Каталог, где лежит файл
                user: this.props.userId, // Идентификатор пользователя
            });

            count++;

        });

        this.state.files = filesData; // Файлы на загрузку
        this.state.allsize = allsize; // Общий размер всех файлов
        this.state.uploadedsize = 0; // Общий размер уже загруженных файлов

        // Поочередная загрузка всех файлов
        for (let id in files)
            await this.uploadFile(files[id], id);

        // Обнуление формы с файлом
        document.getElementById('input-upload-files').value = '';

        let updateFiles = this.state.files;

        this.setState({
            fileCurrent: -1,
            files: updateFiles,
        });

    }

    /**
     * Загрузка файла на сервер
     * @param {object} file объект файлов
     */
    uploadFile = async (file, id) => {

        this.state.offset = 0;
        this.state.progressfile = 0;
        this.state.files[id].status = 2; // Начало загрузки

        let formdata = {
            name: file.name, // Имя файла
            size: file.size, // Размер файла
            type: file.type, // Тип файла
            user: this.state.files[id].user, // Идентификатор пользователя
            cd: this.state.files[id].folder, // Директория загрузки
            index: id, // Идентификатор файла в списке файлов
            hash: false, // Идентификатор созданного файла
        }

        let response = {}; // Объект ответа загрузки части файла
        // let chunk = 0; // Размер загружаемой части

        while (this.state.offset < formdata.size) {

            // chunk = this.state.chunk; // Размер загружаемой части

            // Определение последней части файла
            if (this.state.offset + this.state.chunk >= formdata.size) {

                formdata.endchunk = true;

                // let size = this.state.chunk * Math.floor(formdata.size / this.state.chunk);
                // chunk = this.state.chunk - (formdata.size - size);

            }

            // Получение части файла
            formdata.chunk = await this.getChunkFile(file, id);

            // Рабочий каталог, на случай смены дня
            if (this.state.path)
                formdata.path = this.state.path;

            if (formdata.chunk === false)
                return;

            // Загрузка части файла
            response = await this.uploadChunk(formdata);

            formdata.hash = response.hash; // Имя файла

            this.state.offset += this.state.chunk;

        }

        this.state.fileCurrent = -1; // Обнуление идентификтора текущей загрузки файла
        this.state.path = false; // Сброс пути до файла на сервере

    }

    /**
     * Метод загрузки куска файла
     * @param {object} formdata объект данных загружаемого файла 
     */
    uploadChunk = async formdata => {

        let hash = false, // Данные загруженной части
            id = Number(formdata.index), // Порядковый идентификатор файла
            files = this.state.files;

        this.state.fileCurrent = id; // Установка выбранного файла
        files[id].status = 1; // Сатус процесса загрузки файла

        await axios.post('disk/uploadFile', formdata, {

            onUploadProgress: (progressEvent) => {

                // Общий размер загруженного файла с частью части
                let uploadedsize = this.state.uploadedsize + progressEvent.loaded,
                    uploadedfile = this.state.files[id].uploaded + progressEvent.loaded;

                if (this.state.uploadedsize + this.state.chunk < uploadedsize)
                    uploadedsize = this.state.uploadedsize + this.state.chunk;

                if (this.state.files[id].uploaded + this.state.chunk < uploadedfile)
                    uploadedfile = this.state.files[id].uploaded + this.state.chunk;

                // Общий процент
                let progress = parseInt(Math.round((uploadedsize * 100) / this.state.allsize));

                // Процент загрузки файла
                let progressfile = parseInt(Math.round((uploadedfile * 100) / this.state.files[id].size));

                progress = progress > 100 ? 100 : progress;
                progressfile = progressfile > 100 ? 100 : progressfile;

                this.setState({ progressfile, progress });

            },

        }).then(({ data }) => {

            // Данные завершения загрузки
            hash = data;

            // Путь до файла на сервере, требуется для правильной склейки файла в момент
            // смены даты, в противном случае файл разделится по каталогам дат
            this.state.path = this.state.path ? this.state.path : data.path;

            let chunk = data.size - files[id].uploaded, // Загруженная часть
                uploadedsize = this.state.uploadedsize;

            this.setState({ uploadedsize: uploadedsize + chunk }); // Общий размер загруженных файлов

            // Размер всех загруженных частей файла
            files[id].uploaded = data.size;

            // Общий процент
            let progress = parseInt(Math.round((this.state.uploadedsize * 100) / this.state.allsize));

            // Процент загрузки файла
            let progressfile = parseInt(Math.round((files[id].uploaded * 100) / files[id].size));

            this.setState({ progressfile, progress });

            // Загрузка одно файла завершена
            if (data.file) {

                files[id].progress = 100; // Процент загружки файла
                files[id].status = 3; // Загрузка завершена

                // Добавление данных файла в общий список файлов
                let uploaded = this.state.uploaded;
                uploaded.push(data.file);

                this.setState({ uploaded });

                this.props.pushFileList(data.file);

            }

        }).catch(error => {

            files[id].status = 4; // Ошибка загрузки файла
            files[id].error = echoerror(error); // Тескт ошибки

        });

        this.setState({ files });

        return hash;

    }

    getChunkFile = async (file, id) => {

        return new Promise((resolve, reject) => {

            var reader = new FileReader();

            // Вывод ошибки чтения файла
            reader.onerror = event => {

                let files = this.state.files;

                files[id].status = 4;
                files[id].progress = 100;
                files[id].error = `Ошибка чтения файла в Вашем браузере (${event.target.error.name})`;

                this.setState({ files });

                reader.abort();
                console.error("Failed to read file!\n" + reader.error);

                resolve(false);

            }

            reader.onloadend = (evt) => {

                let base64 = String(reader.result),
                    len = base64.indexOf(',');

                base64 = len > 0 ? base64.substring(len + 1) : base64;

                resolve(base64);

            };

            let blob = file.slice(this.state.offset, this.state.offset + this.state.chunk);
            reader.readAsDataURL(blob);

        });

    }

    /**
     * Открытие окна выбора файлов
     */
    openInput = () => {

        let elem = document.getElementById('input-upload-files');

        elem.click();
        elem.blur();

    }

    setCloseModal = () => {

        this.setState({ openModal: false });

    }

    render() {

        // let button = <button className="btn btn-warning rounded-circle" type="button" title="Добавить файл" onClick={this.openInput}>
        //     <FontAwesomeIcon icon={["fas", "paperclip"]} title="Выбрать файл" />
        // </button>

        // button = <Button variant="outline-dark" onClick={this.openInput}>
        //     <FontAwesomeIcon icon={["fas", "upload"]} title="Загрузить файл" />
        // </Button>

        return (
            <div className="position-fixed add-new-file">

                <UploadModal
                    progress={this.state.progress}
                    fileCurrent={this.state.fileCurrent}
                    progressfile={this.state.progressfile}
                    files={this.state.files}
                    openModal={this.state.openModal}
                    setCloseModal={this.setCloseModal}
                />

                <input type="file" id="input-upload-files" className="d-none" onChange={this.startUploadFiles} multiple />

            </div>
        )

    }

}

export default UploadFile;