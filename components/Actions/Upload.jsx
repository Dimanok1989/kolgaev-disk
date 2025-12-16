// import { useUpload } from "@/contexts/uploadContext";
// import { useApp } from "@/hooks/useApp";
import { useCallback, useEffect, useRef, useState } from "react";
// import { Icon } from "semantic-ui-react";
import UploadProcess from "../Uploads/UploadProcess";
import { Icon } from "semantic-ui-react";

const Upload = () => {

    const uploadRef = useRef(null);
    // const upload = useUpload();
    // const { files, setToUploads } = upload
    const [files, setFiles] = useState([]);

    const onChange = useCallback(data => {
        setFiles(data.target.files);
    }, [files]);

    useEffect(() => {
        if (files.length === 0 && uploadRef.current) {
            uploadRef.current.value = "";
        }
    }, [files]);

    return <>

        {files.length > 0 && <UploadProcess
            files={files}
            setFiles={setFiles}
        />}

        <input
            type="file"
            ref={uploadRef}
            multiple
            className="hidden"
            onChange={onChange}
        />

        <Icon
            name="upload"
            size="large"
            fitted
            link={files.length === 0}
            title="Загрузить файлы"
            onClick={() => (files.length === 0 && uploadRef?.current) && uploadRef.current.click()}
            disabled={files.length > 0}
        />

        {/* <span
            className={`pi pi-upload text-2xl mb-1 opacity-80 ${files.length === 0 ? `hover:opacity-100 cursor-pointer` : ``}`}
            title="Загрузить файлы"
            onClick={() => (files.length === 0 && uploadRef?.current) && uploadRef.current.click()}
        /> */}

        {/* <Icon
            name="upload"
            size="large"
            fitted
            link={files.length === 0}
            onClick={() => uploadRef?.current && uploadRef.current.click()}
            title="Загрузить файлы"
            disabled={files.length > 0}
        /> */}

    </>
}

export default Upload;