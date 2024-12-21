import { UPLOAD_CHUNK_SIZE, useUpload, getChunkFile } from "@/contexts/uploadContext";
import { useApp } from "@/hooks/useApp";
import useAxios from "@/hooks/useAxios";
import { getError } from "@/hooks/useFetch";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Icon, Modal, Progress } from "semantic-ui-react";
// import { ProgressBar } from 'primereact/progressbar';

const UploadProcess = props => {

    const { axios } = useAxios();
    const { folder } = useParams();
    const { files, setFiles } = props;
    const { prependFile } = useApp();
    const { process, setProcess } = useUpload({
        percent: 0,
    });

    useEffect(() => {

        if (files.length > 0) {

            async function upload(filelist) {

                let files = Array.from(filelist);

                const upload = { items: [], item: {} }
                upload.size = files.reduce((s, f) => s + f.size, 0);
                upload.uploaded = 0;

                for (let i in files) {

                    upload.count = +i + 1;
                    upload.key = i;

                    const file = files[i];
                    const item = {
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        status: "upload",
                        chunkOffset: 0,
                        uploaded: 0,
                    }

                    upload.items[i] = item;
                    upload.item = item;
                    setProcess(upload);

                    while ((item.uploaded < item.size || item.status !== "done") && item.status !== "error") {

                        const params = {
                            ...item,
                            folderId: folder || false
                        };

                        if (item?.status !== "uploaded") {
                            params.chunk = await getChunkFile(i, file, item, setProcess);
                        }

                        if (item?.status === "uploaded") {
                            params.toSave = true;
                        }

                        await axios.post('disk/upload', params)
                            .then(({ data }) => {

                                item.path = data.path || null;
                                item.uploaded = data.uploaded || 0;
                                item.fileName = data?.fileName;
                                item.chunkOffset = item.chunkOffset + UPLOAD_CHUNK_SIZE;
                                item.status = data.status;

                                if (item.size > 0) {
                                    let percent = (item.uploaded * 100) / item.size;
                                    item.percent = percent > 100 ? 100 : Number(percent.toFixed(0));
                                }

                                if (
                                    item.uploaded >= item.size
                                    || item.status === "uploaded"
                                    || item.status === "done"
                                ) {
                                    item.percent = 100;
                                }

                                if (data.resource) {
                                    prependFile(data.resource);
                                }
                            })
                            .catch(e => {
                                item.status = "error";
                                upload.isError = getError(e);
                            });

                        upload.items[i] = item;
                        upload.item = item;
                        upload.uploaded = upload.items.reduce((s, f) => s + f.uploaded, 0);

                        if (upload.size > 0) {
                            let percent = (upload.uploaded * 100) / upload.size;
                            upload.percent = percent > 100 ? 100 : Number(percent.toFixed(0));
                        }

                        setProcess(upload);
                    }
                }

                upload.percent = 100;
                setProcess(upload);

                if (!upload.isError) {
                    setTimeout(() => {
                        setFiles([]);
                        setProcess({});
                    }, 1000);
                }
            }

            upload(files);
        }
    }, [files]);

    return <Modal
        open={files.length > 0}
        header={`Загрузка файлов ${process?.count || 0}/${files.length}`}
        centered={false}
        closeIcon={() => process.isError ? <Icon name="close" fitted link onClick={() => setFiles([])} /> : false}
        content={<div className="content">

            <div className="mb-6">
                <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-gray-700 dark:text-white">Выполнено</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-white">{process?.percent || 0}%</span>
                </div>
                <Progress
                    percent={process?.percent || 0}
                    active={!process?.isError && (process?.percent || 0) < 100}
                    color="blue"
                    success={(process?.percent || 0) >= 100}
                    error={Boolean(process.isError)}
                    size="small"
                />
            </div>

            {(process.items || []).map((item, key) => {

                return <div key={key} className={Number(key) === Number(process.key) ? 'block' : 'hidden'}>
                    <div className="flex justify-between mb-1">
                        <span className="text-base font-medium text-gray-700 dark:text-white">{item?.name}</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-white">{item?.percent || 0}%</span>
                    </div>
                    <Progress
                        percent={item?.percent || 0}
                        active={!process?.isError && (process?.percent || 0) < 100}
                        color="green"
                        size='small'
                    />
                </div>
            })}

            {process.isError && <div className="text-red-600 mt-3">
                <b>Ошибка:</b> {process.isError}
            </div>}

        </div>}
    />
}

export default UploadProcess;