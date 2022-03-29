import React from "react";
import moment from "moment";
import { axios } from "../../system";
import UploadProgress from "./UploadPrgress";

/** @var {number} Размер части файла для загрузки */
const CHUNK_SIZE = 5 * 1024 * 1024;

const useUpload = (props = {}) => {

    const { uploaded, files } = props;

    const [size, setSize] = React.useState(0);
    const [upload, setUpload] = React.useState({});

    React.useEffect(() => {
        if (typeof files == "object" && files.length > 0) {

            let size = 0;

            files.forEach((file) => {
                size += file.size;
            });

            setSize(size);
        }
    }, [files]);

    const getChunk = React.useCallback(async (file) => {

        return new Promise(resolve => {

            console.log(file);
            const reader = new FileReader();

            reader.onerror = () => {

                reader.abort();
                console.error("Ошибка чтения файла: " + reader.error);

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

        setUpload(p => {
            let prev = { ...p }
            prev[step] = file;
            return prev;
        });

        while (file.uploadSize < file.size) {

            chunk = await getChunk(file);

            response = await uploadChunk({
                id: file.id,
                name: file.name,
                size: file.size,
                type: file.type,
                date: moment(file.lastModified).format("YYYY-MM-DD HH:mm:ss"),
                chunk,
            });

            if (!response?.file) {
                break;
            }

            file.chunkSize += CHUNK_SIZE;
            file.uploadSize = response.size;
            file.id = response.file.id;

            setUpload(p => {

                let prev = { ...p };
                let uploadSize = 0;
                prev[step].uploadSize = response.size;

                for (let i in prev) {
                    uploadSize += prev[i].uploadSize;
                }

                return prev;
            });
        }

        if (typeof uploaded == "function") {
            uploaded();
        }

    }, []);

    return {
        uploadFile,
        UploadProgress: () => <UploadProgress
            files={files}
            size={size}
            upload={upload}
        />
    }

}

export default useUpload;