import React from "react";
import { Modal } from "semantic-ui-react";
import { axios } from "../../system";
import useFileIcon from "./useFileIcon";
import { useActions } from "../../hooks/useActions";
import { useSelector } from "react-redux";

const DeleteFile = props => {

    const { show, data, close } = props;
    const { icon } = useFileIcon(data);
    const { files } = useSelector(store => store.folder);
    const { setFiles } = useActions();
    const [del, setDel] = React.useState(false);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {

        return () => {
            setDel(false);
            setError(null);
        }

    }, [show]);

    React.useEffect(() => {

        if (del === false) return;

        axios.delete('disk/file/delete', {
            params: { id: data.id },
        }).then(({ data }) => {
            files.forEach((file, i) => {
                if (file.id === data.id) {
                    files[i].deleted_at = true;
                }
            });
            setFiles(files);
            close();
        }).catch(e => {
            setError(axios.getError(e));
        }).then(() => {
            setDel(false);
        });

    }, [del]);

    return <Modal
        open={show}
        content={<div className="content py-2">
            <div className="d-flex justify-content-center mb-3">{icon}</div>
            <div>Вы действительно желаете удалить {data?.is_dir ? "каталог" : "файл"}?</div>
            <div><b>{data.name}</b></div>
            {error && <div className="mt-2 text-danger">
                <b>Ошибка</b>{' '}
                {error}
            </div>}
        </div>}
        basic
        centered={false}
        className="text-center delete-file-modal"
        actions={[
            {
                key: "no",
                content: "Нет",
                color: "green",
                onClick: () => close(),
                disabled: del,
            },
            { 
                key: "yes",
                content: "Да",
                color: "red",
                icon: "trash",
                onClick: () => setDel(true),
                disabled: del,
                loading: del,
            },
        ]}
        size="mini"
    />
}

export default DeleteFile;
