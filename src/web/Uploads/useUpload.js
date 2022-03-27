import React from "react";
import moment from "moment";
import { axios } from "../../system";

/** @var {number} Размер части файла для загрузки */
const CHUNK_SIZE = 5 * 1024 * 1024;

const useUpload = (props = {}) => {

    const { uploaded } = props;

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

    const uploadFile = React.useCallback(async (file) => {

        let chunk, response;

        file.id = null;
        file.uploadSize = 0;
        file.chunkSize = 0;

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
        }

        if (typeof uploaded == "function") {
            uploaded();
        }

    }, []);

    return {
        uploadFile
    }

}

export default useUpload;