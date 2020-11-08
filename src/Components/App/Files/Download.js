import React from 'react';

import axios from './../../../Utils/axios';

import { Toast, ProgressBar } from 'react-bootstrap';
import FontAwesomeIcon from './../../../Utils/FontAwesomeIcon';

class Download extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            id: null, // Идентификатор файла
            show: false, // Идентификатор отображения окна
            files: [], // Массив, загружаемых файлов
        }

    }

    componentDidUpdate = (prevProps) => {

        if (prevProps.id !== this.props.id) {

            this.setState({ id: this.props.id });

            if (this.props.id !== null) {

                this.download(this.props.id, this.props.dir);
                this.setState({ show: true });

            }

        }

    }

    /**
     * Метод проверки файла
     * 
     * @param {number} id идентификатор файла
     */
    startDownload = id => {

        let formdata = new FormData();
        formdata.append('id', id);

        axios.post('disk/startDownload', formdata).then(({ data }) => {

        }).catch(error => {

        }).then(() => {

        });

    }

    download = (id, dir) => {

        let formdata = new FormData();
        formdata.append('id', id);

        let filename = document.querySelector(`#file-row-block-${id} .file-row-name`).textContent,
            files = this.state.files;

        if (dir)
            filename += ".zip";

        files.push({ id, filename });
        this.setState({ files });

        let params = /*dir ? {} :*/ {

            responseType: 'blob',

            onDownloadProgress: progressEvent => {

                console.log('dwn', progressEvent);

                let progress = parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100));

                let bar = document.querySelector(`#download-file-${id} .progress-bar`);
                bar.style.width = `${progress}%`;

            },

            onUploadProgress: function (progressEvent) {
                console.log('upload', progressEvent);
            },

        };

        axios.post('disk/download', formdata, params).then(({ data }) => {

            if (typeof data.tree == "object")
                return this.createArhive(data);

            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');

            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();

            let files = this.state.files;
            for (let key in files) {

                let file = files[key];

                if (file.id === id)
                    delete (files[key]);

            }

            this.setState({ files });


        }).catch(error => {

        }).then(() => {
            this.props.downloaded(null);
        });

    }

    createArhive = async data => {

        let files = [];
        data.tree.forEach(file => {
            if (file.is_dir === 0) {
                file.zipname = data.name;
                files.push(file);
            }
        });

        console.log(data);

        for (let key in files)
            await this.addFileToZip(files[key]);

    }

    addFileToZip = async (file, offset = 0) => {

        let formdata = new FormData();

        for (let key in file)
            formdata.append(key, file[key]);

        if (offset > 0)
            formdata.append('offset', offset);

        let done = true,
            readed = 0;

        await axios.post('disk/addFileToZip', formdata).then(({ data }) => {

            done = data.done;
            readed = data.readed;

        });

        if (!done)
            await this.addFileToZip(file, readed);

    }

    render() {

        let files = this.state.files.map(file => (
            <Toast key={file.id}>
                <Toast.Header closeButton={false}>
                    <FontAwesomeIcon icon={["fas", "download"]} className="mr-2 uploading-file-icon" />
                    <strong className="mr-auto">Загрузка</strong>
                </Toast.Header>
                <Toast.Body className="position-relative">
                    <div>{file.filename}</div>
                    <ProgressBar id={`download-file-${file.id}`} now={file.progress} className="progress-download-file" />
                </Toast.Body>
            </Toast>
        ));

        return <div className="toasts-downloads">{files}</div>

    }

}

export default Download;