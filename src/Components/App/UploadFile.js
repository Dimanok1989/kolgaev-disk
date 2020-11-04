import React from 'react';
import UploadModal from './UploadModal';

import axios from './../../Utils/axios';
import echoerror from './../../Utils/echoerror';

import FontAwesomeIcon from './../../Utils/FontAwesomeIcon';

class UploadFile extends React.Component {

    constructor(props) {

        super(props);

        this.state = {

            files: [], // Список файлов для загузки
            uploaded: [], // Список загруженных файлов

            fileCurrent: -1, // Текущий файл в процессе загрузки
            progressfile: 0, // Процесс загрузки одного файла
            path: false, // Рабочий каталог

            chunk: 5242880, // Размер одной загружаемой части файла
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
        if (this.state.folder != this.props.folder)
            this.state.folder = this.props.folder;

        if (this.state.user != this.props.userId)
            this.state.user = this.props.userId;

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

        let response = {}, // Объект ответа загрузки части файла
            chunk = 0; // Размер загружаемой части

        while (this.state.offset < formdata.size) {

            chunk = this.state.chunk; // Размер загружаемой части

            // Определение последней части файла
            if (this.state.offset + this.state.chunk >= formdata.size) {

                formdata.endchunk = true;

                let size = this.state.chunk * Math.floor(formdata.size / this.state.chunk);
                chunk = this.state.chunk - (formdata.size - size);

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
            id = Number(formdata.index); // Порядковый идентификатор файла

        this.state.fileCurrent = id; // Установка выбранного файла
        this.state.files[id].status = 1; // Сатус процесса загрузки файла

        await axios.post('disk/uploadFile', formdata, {

            // Прогресс загрузки файла
            onUploadProgress: (itemUpload) => {

                console.log(itemUpload)

                // let progress

                // this.fileProgress += ((itemUpload.loaded / itemUpload.total) * 100) / (formdata.size / this.chunk);
                // this.fileProgress = this.fileProgress > 100 ? 100 : this.fileProgress;
                // this.filesUploadList[index].progress = this.fileProgress;

                // this.progress = ((this.filesUploaded.length * 100) + this.fileProgress) / this.filesUploadList.length;

                // this.progress = this.progress > 100 ? 100 : this.progress;

            }

        }).then(({ data }) => {

            // Данные завершения загрузки
            hash = data;

            // Путь до файла на сервере, требуется для правильной склейки файла в момент
            // смены даты, в противном случае файл разделится по каталогам дат
            this.state.path = this.state.path ? this.state.path : data.path;

            let chunk = data.size - this.state.files[id].uploaded; // Загруженная часть          
            this.state.uploadedsize += chunk; // Общий размер загруженных файлов

            // Размер всех загруженных частей файла
            this.state.files[id].uploaded = data.size;

            // Общий процент
            let progress = (this.state.uploadedsize * 100) / this.state.allsize;

            // Процент загрузки файла
            let progressfile = (this.state.files[id].uploaded * 100) / this.state.files[id].size;

            this.setState({ progressfile, progress });

            // Загрузка одно файла завершена
            if (data.file) {

                this.state.files[id].progress = 100; // Процент загружки файла
                this.state.files[id].status = 3; // Загрузка завершена

                // Добавление данных файла в общий список файлов
                this.state.uploaded.push(data.file);
                this.props.pushFileList(data.file);

            }

        }).catch(error => {

            this.state.files[id].status = 4; // Ошибка загрузки файла
            this.state.files[id].error = echoerror(error); // Тескт ошибки

        });

        return hash;

    }

    getChunkFile = async (file, id) => {

        return new Promise((resolve, reject) => {

            var reader = new FileReader();

            // Вывод ошибки чтения файла
            reader.onerror = event => {

                this.state.files[id].status = 4;
                this.state.files[id].progress = 100;
                this.state.files[id].error = `Ошибка чтения файла в Вашем браузере (${event.target.error.name})`;

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

        let button = this.state.user ? <button className="btn btn-warning rounded-circle" type="button" title="Добавить файл" onClick={this.openInput}>
            <FontAwesomeIcon icon={["fas", "paperclip"]} title="Выбрать файл" />
        </button> : null;

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

                {button}

            </div>
        )

    }

}

export default UploadFile;