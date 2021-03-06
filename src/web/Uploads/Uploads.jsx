import React from "react";
import { axios } from "../../system";
import { useSelector } from "react-redux";
import moment from "moment";
import { formatSize } from "../Files";
import { withRouter } from "react-router-dom";

/** @var {number} Размер части файла для загрузки */
const CHUNK_SIZE = 5 * 1024 * 1024;

const Uploads = props => {

    const { uploads } = useSelector(store => store.folder);
    const folder = props.match?.params[0];

    const [files, setFiles] = React.useState([]);
    const [step, setStep] = React.useState(null);

    const [size, setSize] = React.useState(0);
    const [uploadSize, setUploadSize] = React.useState(0);
    const [uploaded, setUploaded] = React.useState({});
    const [percent, setPercent] = React.useState(0);
    const [errors, setErrors] = React.useState({});

    const getChunk = React.useCallback(async (file, step = null) => {

        return new Promise(resolve => {

            const reader = new FileReader();

            reader.onerror = () => {

                reader.abort();
                // console.error("Ошибка чтения файла: " + reader.error);
                setErrors(prev => ({ ...prev, [step]: "Ошибка чтения файла: " + reader.error }));

                resolve(false);
            }

            reader.onloadend = () => {

                let base64 = String(reader.result),
                    len = base64.indexOf(',');

                base64 = len > 0 ? base64.substring(len + 1) : base64;

                resolve(base64);
            };

            reader.readAsDataURL(file.slice(file.chunkSize, file.chunkSize + CHUNK_SIZE));
        });

    }, []);

    const uploadChunk = React.useCallback(async (file) => {

        let response;

        await axios.put('disk/upload', file).then(({ data }) => {
            response = data;
        });

        return response;

    }, []);

    const uploadFile = React.useCallback(async (file, step = null) => {

        let chunk, response;

        file.id = null;
        file.uploadSize = 0;
        file.chunkSize = 0;

        setUploaded(prev => ({ ...prev, [step]: 0 }));

        while (file.uploadSize < file.size) {

            chunk = await getChunk(file, step);

            response = await uploadChunk({
                id: file.id,
                name: file.name,
                size: file.size,
                type: file.type,
                date: moment(file.lastModified).format("YYYY-MM-DD HH:mm:ss"),
                chunk,
                dir: file.dir,
            });

            if (!response?.file) {
                setErrors(prev => ({ ...prev, [step]: true }));
                break;
            }

            file.chunkSize += CHUNK_SIZE;
            file.uploadSize = response.size;
            file.id = response.file.id;

            setUploaded(prev => ({ ...prev, [step]: response.size }));
        }

        setStep(step => step + 1);
    }, []);

    React.useEffect(() => {

        if (typeof uploads == "object") {

            setFiles(prev => {

                let list = [...prev];

                Array.from(uploads).forEach(row => {
                    row.dir = folder;
                    list.push(row);
                });

                return list;
            });
        }
    }, [uploads]);

    React.useEffect(() => {

        let size = 0;

        if (files.length > 0 && step === null) {
            setStep(0);
        }

        files.forEach(file => {
            size += file.size;
        });

        setSize(size);
    }, [files]);

    React.useEffect(async () => {

        if (step !== null && typeof files[step] != "undefined") {
            await uploadFile(files[step], step);
        } else if (step !== null && typeof files[step] == "undefined") {
            setStep(null);
            setFiles([]);
            setUploaded({});
            setPercent(0);
        }
    }, [step]);

    React.useEffect(() => {

        if (size > 0) {

            let uploadSize = 0;

            for (let i in uploaded) {
                uploadSize += uploaded[i];
            }

            setPercent(Number((uploadSize * 100 / size).toFixed(3)));
            setUploadSize(uploadSize);
        }
    }, [uploaded, size]);

    return <>

        {files && files.length > 0 && <div className="upload-progress-content">

            <div className="upload-progress">
                <div className="upload-progress-bar" style={{
                    width: `${percent}%`,
                    transition: (percent > 0 && percent < 100) ? ".6s" : 0,
                }} />
            </div>

            <div className="d-flex align-items-center px-1 mt-1">
                <div className="flex-grow-1">
                    <small><b>{Object.keys(uploaded).length}</b>/<b>{files.length}</b></small>
                </div>
                <div>
                    <small>{(uploadSize > 0 ? formatSize(uploadSize) : 0)}</small>
                    <small>{' / '}</small>
                    <small>{(size > 0 ? formatSize(size) : 0)}</small>
                </div>
            </div>

        </div>}

    </>

}

export default withRouter(Uploads);