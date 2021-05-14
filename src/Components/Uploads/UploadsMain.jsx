import React from 'react';
import axios from './../../system/axios';

import { connect } from 'react-redux';
import { setOpenUploadModal } from './../../store/uploads/actions';

import { Button, Input, Modal, Message } from 'semantic-ui-react';

export const openInput = () => {

    const elem = document.getElementById('input-upload-files');
    elem.click();
    elem.blur();

}

function UploadsMain(props) {

    const config = {
        chunk: 4242880, // Размер одной загружаемой части файла
    }

    const uploaded = {
        progress: 0, // Общий процесс
        progressfile: 0, // Процесс загрузки файла
        size: 0, // Общий размер
        upload: 0, // Загруженный размер
        offset: 0, // Текущая позиция чтения файла
        path: false, // Путь до файла на сервере
    }

    const { show, setOpenUploadModal, userId, folder } = props;

    const [files, setFiles] = React.useState([]);
    const [filesData, setFilesData] = React.useState([]);
    const [size, setSize] = React.useState([]);

    /**
     * Чтение файлов
     * @param {object} e Форма выбора файлов 
     */
    const readFiles = e => {

        let files = Array.from(e.target.files);

        if (!files.length)
            return null;

        uploaded.progress = 0; // Общий процесс
        uploaded.progressfile = 0; // Процесс загрузки файла
        uploaded.size = 0; // Общий размер
        uploaded.upload = 0; // Загруженный размер
        uploaded.offset = 0; // Текущая позиция чтения файла
        uploaded.path = false; // Путь до файла на сервере

        let data = [],
            size = 0; // Общий размер всех файлов

        files.forEach((file, i) => {

            size += file.size; // Общий размер всех файлов

            data.push({
                key: i,
                name: file.name,
                lastModified: file.lastModified, // Время последнего изменения файла
                lastModifiedDate: file.lastModifiedDate, // Время последнего изменения файла
                size: file.size, // Размер файла
                type: file.type, // MIME-тип файла
                uploaded: 0, // Размер загруженной части
                progress: 0, // Поцент загрузки файла
                status: 0, // Статус загрузки файла
                error: null, // Ошибка загрузки файла
                folder: folder, // Каталог, где лежит файл
                user: userId, // Идентификатор пользователя
            });

        });

        uploaded.size = size;

        setSize(size);
        setFiles(files); // Массив файлов
        setFilesData(data); // Массив файлов для вывода
        setOpenUploadModal(true); // Открытие модального окна

    }

    /**
     * Выполнение загрузки файла
     * @param {number} key Порядковый номер элемента файла 
     * @param {object} file Загружаемый файл
     */
    const uploadFile = async (key, file) => {

        uploaded.offset = 0;
        uploaded.progressfile = 0;

        filesData[key].status = 2;
        await setFilesData(filesData);

        let formdata = {
            name: file.name,
            size: file.size,
            type: file.type,
            user: userId,
            cd: folder,
            index: key,
            hash: false,
        }

        while (uploaded.offset < formdata.size) {

            // Определение последней части файла
            if (uploaded.offset + config.chunk >= formdata.size) {
                formdata.endchunk = true;
            }

            // Получение части файла
            formdata.chunk = await getChunkFile(key, file);

            if (formdata.chunk === false)
                return;

            // Рабочий каталог, на случай смены дня
            if (uploaded.path)
                formdata.path = uploaded.path;

            // Загрузка части файла
            let response = await uploadChunk(formdata);
            formdata.hash = response.hash;

            uploaded.offset = uploaded.offset + config.chunk;

        }

        uploaded.path = false;

    }

    /**
     * Получение части файла для отправки на сервер
     * @param {*} key Порядковый номер элемента файла 
     * @param {*} file Загружаемый файл
     * @return {string}
     */
    const getChunkFile = async (key, file) => {

        return new Promise((resolve, reject) => {

            var reader = new FileReader();

            // Вывод ошибки чтения файла
            reader.onerror = event => {

                filesData[key].status = 4;
                filesData[key].progress = 100;
                filesData[key].error = `Ошибка чтения файла в Вашем браузере (${event.target.error.name})`;

                setFilesData(filesData);

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

            let blob = file.slice(uploaded.offset, uploaded.offset + config.chunk);
            reader.readAsDataURL(blob);

        });

    }

    /**
     * Метод загрузки куска файла
     * @param {object} formdata объект данных загружаемого файла 
     */
    const uploadChunk = async formdata => {

        let hash = false, // Данные загруженной части
            key = Number(formdata.index); // Порядковый идентификатор файла

        filesData[key].status = 1;
        await setFilesData(filesData);

        await axios.post('disk/uploadFile', formdata, {

            onUploadProgress: async (progressEvent) => {

                // Общий процент
                let uploadedsize = uploaded.upload + progressEvent.loaded;

                if (uploaded.upload + config.chunk < uploadedsize)
                    uploadedsize = uploaded.upload + config.chunk;

                let progress = parseInt(Math.round((uploadedsize * 100) / size));
                progress = progress > 100 ? 100 : progress;

                if (progress < uploaded.progress)
                    progress = uploaded.progress;

                // Процент загрузки файла
                let uploadedfile = filesData[key].uploaded + progressEvent.loaded;

                if (filesData[key].uploaded + config.chunk < uploadedfile)
                    uploadedfile = filesData[key].uploaded + config.chunk;

                let progressfile = parseInt(Math.round((uploadedfile * 100) / filesData[key].size));
                progressfile = progressfile > 100 ? 100 : progressfile;

                if (progressfile < uploaded.progressfile)
                    progressfile = uploaded.progressfile;

                uploaded.progress = progress;
                uploaded.progressfile = progressfile;

            },

        }).then(async ({ data }) => {

            // Данные завершения загрузки
            hash = data;

            // Путь до файла на сервере, требуется для правильной склейки файла в момент
            // смены даты, в противном случае файл разделится по каталогам дат
            uploaded.path = uploaded.path || data.path;

            let chunk = data.size - filesData[key].uploaded, // Загруженная часть
                upload = uploaded.upload;

            uploaded.upload = upload + chunk;

            // Размер всех загруженных частей файла
            filesData[key].uploaded = data.size;

            // Общий процент
            let progress = parseInt(Math.round((uploaded.upload * 100) / size));

            if (progress < uploaded.progress)
                progress = uploaded.progress;

            // Процент загрузки файла
            let progressfile = parseInt(Math.round((filesData[key].uploaded * 100) / filesData[key].size));

            if (progressfile < uploaded.progressfile)
                progressfile = uploaded.progressfile;

            uploaded.progress = progress;
            uploaded.progressfile = progressfile;
            uploaded.operationId = data.operation_id || null;

            // Загрузка одно файла завершена
            if (data.file) {

                filesData[key].progress = 100; // Процент загружки файла
                filesData[key].status = 3; // Загрузка завершена

                // Добавление данных файла в общий список файлов
                // let uploaded = this.state.uploaded;
                // uploaded.push(data.file);

                // this.setState({ uploaded });

                // this.props.pushFileList(data.file);

            }

        }).catch(error => {

            filesData[key].status = 4; // Ошибка загрузки файла
            filesData[key].error = axios.getError(error); // Тескт ошибки

        });

        await setFilesData(filesData);

        return hash;

    }

    React.useEffect(() => {

        if (files.length) {

            const uploadAllFiles = async () => {
                for (let key in files)
                    await uploadFile(key, files[key]);
            }

            uploadAllFiles();

        }

        return () => {
            const elem = document.getElementById('input-upload-files');
            elem.value = "";
        }

    }, [files]);

    React.useEffect(() => {

        console.log(filesData);

    }, [filesData])

    return <>

        <input type="file" id="input-upload-files" className="d-none" onChange={e => readFiles(e)} multiple />

        <Modal
            closeOnEscape={false}
            closeOnDimmerClick={false}
            open={show}
            onClose={() => setOpenUploadModal(false)}
        >
            <Modal.Header>Delete Your Account</Modal.Header>
            <Modal.Content>
                <p>Are you sure you want to delete your account</p>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => setOpenUploadModal(false)} negative>
                    No
      </Button>
                <Button onClick={() => setOpenUploadModal(false)} positive>
                    Yes
      </Button>
            </Modal.Actions>
        </Modal>

    </>

}

const mapStateToProps = state => ({
    show: state.uploads.show,
    userId: state.users.selectedUser,
    folder: state.files.openFolder,
});

const mapDispatchToProps = {
    setOpenUploadModal
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadsMain);