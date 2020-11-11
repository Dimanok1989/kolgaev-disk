import React from 'react';

import axios from './../../Utils/axios';
import echoerror from './../../Utils/echoerror';

import { Spinner, ProgressBar } from 'react-bootstrap';
import Icons from './../../Utils/Icons';

/**
 * Компонент вывода страницы скачивания файла
 */
class Dowbload extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            loading: true,
            error: null,
            file: {},
            progress: 0,
            download: 0,
            downloaded: false,
        }

    }

    componentWillUnmount = () => {

    }

    componentDidMount = () => {

        this.startDownload(this.props.match.params.id || null);

    }

    /**
     * Метод проверки файла
     * 
     * @param {number} id идентификатор файла
     */
    startDownload = id => {

        if (this.state.downloaded === true)
            return null;

        let formdata = new FormData();
        formdata.append('id', id);

        axios.post('disk/startDownload', formdata).then(({ data }) => {

            if (data.is_dir === 1)
                data.variant = "warning";

            this.setState({ file: data });
            this.download(formdata);

        }).catch(error => {

            this.setState({ error: echoerror(error) });

        }).then(() => {

            this.setState({ loading: false });

        });

    }

    /**
     * Метод скачивания файла
     * 
     * @param {object} formdata идентификатор файла
     */
    download = formdata => {

        let file = this.state.file,
            progress = this.state.progress;

        axios.post('disk/download', formdata, {

            responseType: 'blob',

            onDownloadProgress: progressEvent => {

                progress = parseInt(Math.round((progressEvent.loaded / file.size) * 100));

                this.setState({
                    progress,
                    download: progressEvent.loaded
                });

            },

        }).then(({ data }) => {

            setTimeout(() => {
                document.getElementById('progress-bar-download').style.backgroundColor = "#28a745";
            }, 700);

            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');

            link.href = url;
            link.setAttribute('download', file.name);
            document.body.appendChild(link);
            link.click();
            link.remove();

        }).catch(error => {

            file.variant = "danger";
            file.error = echoerror(error);

            this.setState({ file });

        }).then(() => {
            setTimeout(() => {
                this.setState({ downloaded: true });
            }, 700);
        });

    }

    formatSize = size => {

        let metrics = ['байт', 'Кб', 'Мб', 'Гб', 'Тб'],
            metric = 0;

        while (Math.round(size / 1024) > 0) {
            metric++;
            size = size / 1024;
        }

        return size.toFixed(2) + (metrics[metric] ? ` ${metrics[metric]}` : ``);

    }

    render = () => {

        if (this.state.loading)
            return <div className="text-center my-5">
                <Spinner animation="border" variant="dark" />
            </div>

        if (this.state.error)
            return <div className="text-center text-danger my-5 font-weight-bold">{this.state.error}</div>

        const file = this.state.file;

        let info = file.is_dir === 1 ? <div className="mt-3 mx-auto alert-for-arhive"><small>Внимание! Происходит формирование архива. К сожалению файлы большого объёма могут не запаковаться, если это произошло, то скачайте эти файлы по отдельность. Также из-за этого архив может быть поврежден, чтобы его открыть, воспользутесь приложением <b>7-zip</b></small></div> : null;

        let error = file.error ? <div className="text-center text-danger mt-2"><strong>Ошибка</strong> {file.error}</div> : null;

        let download = file.is_dir === 1 ? this.formatSize(this.state.download) + " / " : '';

        return <div className="text-center mt-5 mb-3 mx-auto" id="download-file-block">

            <img src={Icons[file.icon] || Icons.file} width="90" className="mb-2" alt={file.icon} />

            <div className="font-weight-bold">{file.name}</div>
            <div className="mb-4">{download}{file.sizeformat}</div>

            <ProgressBar variant={file.variant || "primary"} now={this.state.progress} className="progress-download" id="progress-bar-download" striped={!this.state.downloaded} animated={!this.state.downloaded} />

            {info}
            {error}

        </div>

    }

}

export default Dowbload;