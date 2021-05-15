import React from 'react';
import axios from './../../system/axios';

import { connect } from 'react-redux';
import { setOpenUploadModal, setUploadProcess } from './../../store/uploads/actions';
import { setFilesList } from './../../store/files/actions';

import './uploads.css';
import { Progress } from 'semantic-ui-react';
import * as Icon from './../Files/FileIcons'

export const openInput = () => {

    const elem = document.getElementById('input-upload-files');
    elem.click();
    elem.blur();

}

function UploadsMain(props) {

    const config = {
        chunk: 4242880, // Размер одной загружаемой части файла
    }

    const complete = {
        size: 0,
        uploaded: 0,
        progress_main: 0,
        progress_file: 0,
        offset_file: 0,
        step_file: 0,
        operation_id: null,
        path: false,
    }

    const { show, setOpenUploadModal, userId, folder, setUploadProcess, setFilesList, filesList } = props;

    const [files, setFiles] = React.useState([]);
    const [filesData, setFilesData] = React.useState([]);
    const [size, setSize] = React.useState(0);
    const [fileStep, setFileStep] = React.useState(null);

    const setProgress = progress => {

        const percent = document.getElementById('upload-progress-main') || null;

        if (percent)
            percent.textContent = `${progress}%`;

        const progressBar = document.getElementById('upload-progress-bar') || null;

        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

    }

    const setProgressfile = progress => {

        const percent = document.getElementById('upload-progress-file') || null;

        if (percent)
            percent.textContent = `${progress}%`;

        const progressBar = document.getElementById('progress-file') || null;

        if (progressBar) {
            progressBar.dataset.percent = progress;
            progressBar.querySelector('.bar').style.width = `${progress}%`;
        }

    }

    const setStep = step => {

        const elem = document.getElementById('upload-step') || null;

        if (elem)
            elem.textContent = step;

    }

    /**
     * Чтение файлов
     * @param {object} e Форма выбора файлов 
     */
    const readFiles = async e => {

        let files = Array.from(e.target.files);

        if (!files.length)
            return null;

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

        setSize(size);

        complete.uploaded = 0;
        complete.progress_main = 0;
        complete.progress_file = 0;
        complete.offset_file = 0;
        complete.step_file = 0;
        complete.operation_id = null;
        complete.path = false;

        setOpenUploadModal(true); // Открытие модального окна
        setUploadProcess(true);

        setFiles(files); // Массив файлов
        setFilesData(data); // Массив файлов для вывода

    }

    /**
     * Выполнение загрузки файла
     * @param {number} key Порядковый номер элемента файла 
     * @param {object} file Загружаемый файл
     */
    const uploadFile = async (key, file) => {

        complete.offset_file = 0;
        complete.progress_file = 0;
        complete.step_file++;
        await setStep(complete.step_file);

        let files = [...filesData];
        await setFileStep(filesData[key]);

        files[key].status = 2;
        await setFilesData(files);

        let formdata = {
            name: file.name,
            size: file.size,
            type: file.type,
            user: files[key].user,
            cd: files[key].folder,
            index: key,
            hash: false,
        }

        while (complete.offset_file < formdata.size) {

            // Определение последней части файла
            if (complete.offset_file + config.chunk >= formdata.size) {
                formdata.endchunk = true;
            }

            // Получение части файла
            formdata.chunk = await getChunkFile(key, file);

            if (formdata.chunk === false)
                return;

            // Рабочий каталог, на случай смены дня
            if (complete.path)
                formdata.path = complete.path;

            // Загрузка части файла
            let response = await uploadChunk(formdata);
            formdata.hash = response.hash;

            complete.offset_file += config.chunk;

        }

        complete.path = false;

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

                let files = [...filesData];

                files[key].status = 4;
                files[key].progress = 100;
                files[key].error = `Ошибка чтения файла в Вашем браузере (${event.target.error.name})`;

                setFilesData(files);

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

            let blob = file.slice(complete.offset_file, complete.offset_file + config.chunk);
            reader.readAsDataURL(blob);

        });

    }

    /**
     * Метод загрузки куска файла
     * @param {object} formdata объект данных загружаемого файла 
     */
    const uploadChunk = async formdata => {

        let hash = false, // Данные загруженной части
            key = Number(formdata.index), // Порядковый идентификатор файла
            files = [...filesData];

        files[key].status = 1;
        await setFilesData(files);

        await axios.post('disk/uploadFile', formdata, {

            onUploadProgress: (progressEvent) => {

                // Общий процент
                let uploadedsize = complete.uploaded + progressEvent.loaded;

                if (complete.uploaded + config.chunk < uploadedsize)
                    uploadedsize = complete.uploaded + config.chunk;

                let progress_main = parseInt(Math.round((uploadedsize * 100) / size));
                progress_main = progress_main > 100 ? 100 : progress_main;

                if (progress_main < complete.progress_main)
                    progress_main = complete.progress_main;

                complete.progress_main = progress_main;
                setProgress(progress_main);

                // Процент загрузки файла
                let uploadedfile = files[key].uploaded + progressEvent.loaded;

                if (files[key].uploaded + config.chunk < uploadedfile)
                    uploadedfile = files[key].uploaded + config.chunk;

                let progress_file = parseInt(Math.round((uploadedfile * 100) / files[key].size));
                progress_file = progress_file > 100 ? 100 : progress_file;

                if (progress_file < progress_file)
                    progress_file = progress_file;

                complete.progress_file = progress_file;
                setProgressfile(progress_file);

            },

        }).then(async ({ data }) => {

            // Данные завершения загрузки
            hash = data;

            let chunk = data.size - files[key].uploaded; // Загруженная часть

            complete.uploaded += chunk;

            // Размер всех загруженных частей файла
            files[key].uploaded = data.size;

            // Общий процент
            let progress_main = parseInt(Math.round((complete.uploaded * 100) / size));

            if (progress_main < complete.progress_main)
                progress_main = complete.progress_main;

            complete.progress_main = progress_main;
            await setProgress(complete.progress_main);

            // Процент загрузки файла
            let progress_file = parseInt(Math.round((files[key].uploaded * 100) / files[key].size));

            if (progress_file < complete.progress_file)
                progress_file = complete.progress_file;

            complete.progress_file = progress_file;
            await setProgressfile(complete.progress_file);

            // Путь до файла на сервере, требуется для правильной склейки файла в момент
            // смены даты, в противном случае файл разделится по каталогам дат
            complete.path = complete.path || data.path;

            complete.operation_id = data.operation_id || null;

            // Загрузка одно файла завершена
            if (data.file && Number(folder) === Number(data.file.in_dir)) {

                files[key].progress = 100; // Процент загружки файла
                files[key].status = 3; // Загрузка завершена

                // let availableFiles = [];
                // filesList.forEach(file => availableFiles.push(file));
                // availableFiles.push(data.file);

                // setFilesList(availableFiles);

            }

        }).catch(error => {

            files[key].status = 4; // Ошибка загрузки файла
            files[key].error = axios.getError(error); // Тескт ошибки

        });

        await setFilesData(files);

        return hash;

    }

    React.useEffect(() => {

        if (files.length) {

            const uploadAllFiles = async () => {

                for (let key in files)
                    await uploadFile(key, files[key]);

                setFiles([]); // Массив файлов
                setFilesData([]); // Массив файлов для вывода
                setOpenUploadModal(false); // Открытие модального окна
                setUploadProcess(false);

            }

            uploadAllFiles();

        }

        return () => {

            const elem = document.getElementById('input-upload-files');

            if (elem) 
                elem.value = "";

        }

    }, [files]);

    return <>

        <input type="file" id="input-upload-files" className="d-none" onChange={e => readFiles(e)} multiple />

        {show
            ? <div className="upload-file-process">
                <div className="upload-file-process-header">
                    <div className="upload-progress-bar" id="upload-progress-bar"></div>
                    <span>Загрзка файлов: <b id="upload-step">0</b>/<b>{files.length}</b></span>
                    <b id="upload-progress-main">0%</b>
                </div>
                {files.length > 1 && typeof fileStep == "object"
                    ? <div className="upload-step-file" id="upload-step-file">

                        <div className="d-flex align-items-center">

                            <img src={Icon[fileStep?.icon] ?? Icon.file} alt="Icon" className="icon-upload"/>

                            <div className="ml-2 upload-file-info">

                                <div className="upload-file-name">{fileStep?.name || null}</div>
                                
                                <div className="d-flex align-items-center upload-file-progress-info">
                                    <div className="mr-2 flex-grow-1">
                                        <Progress percent={0} size="tiny" active color="green" id="progress-file" className="mb-0" />
                                    </div>
                                    <div id="upload-progress-file">{fileStep?.progress || 0}%</div>
                                </div>

                            </div>

                        </div>

                    </div>
                    : null
                }
            </div>
            : null
        }

    </>

}

const mapStateToProps = state => ({
    show: state.uploads.show,
    userId: state.users.selectedUser,
    folder: state.files.openFolder,
    filesList: state.files.filesList,
});

const mapDispatchToProps = {
    setOpenUploadModal, setUploadProcess, setFilesList
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadsMain);