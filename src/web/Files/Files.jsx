import { useCallback, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import { Icon, Loader, Message } from "semantic-ui-react";
import { useActions } from "../../hooks/useActions";
import { axios } from "../../system";
import FileRow from "./FileRow";
import BreadCrumbs from "./BreadCrumbs";
import FileRowContextMenu from "./FileRowContextMenu";
import Rename from "./Rename";

const Files = props => {

    const { files, mainFolder } = useSelector(store => store.folder);
    const { setFiles } = useActions();
    const folder = props.match?.params[0] || null;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [breadCrumbs, setBreadCrumbs] = useState([]);
    const [showMenu, setShowMenu] = useState(false);
    const [context, setContext] = useState({});

    const closeContext = useCallback(() => setContext({}), []);

    const pushNewFile = useCallback(({ file, dir }) => {

        if (dir === folder || dir === mainFolder) {

            let append = true,
                list = [...files];

            list.forEach(row => {
                if (row.id === file.id)
                    append = false;
            });

            if (append)
                list.push(file);

            setFiles(list);
        }

    }, [files, mainFolder, folder]);

    const pushUpdateFile = useCallback(({ file }) => {

        let list = [...files];

        for (let i in files) {
            if (files[i].id === file.id) {
                list[i] = file;
                break;
            }
        }

        setFiles(list);

    }, [files, mainFolder, folder]);

    const getFiles = useCallback(param => {

        setLoading(true);

        axios.get('disk/files', {
            params: {
                ...param,
                dir: folder
            }
        }).then(({ data }) => {
            setError(null);
            setFiles(data.page > 1 ? [...files, ...data.files] : data.files);
            setBreadCrumbs(data.breadcrumbs);
        }).catch(e => {
            setError(axios.getError(e));
        }).then(() => {
            setLoading(false);
        });

    }, [folder]);

    useEffect(() => {
        getFiles({ page: 1 });
        // eslint-disable-next-line
    }, [folder]);

    useEffect(() => props.pushFile && pushNewFile(props.pushFile), [props.pushFile]);
    useEffect(() => props.updateFile && pushUpdateFile(props.updateFile), [props.updateFile]);

    return <div className="body-content position-relative" id="files-content">

        <Rename
            show={context?.context === "rename"}
            data={context}
            close={closeContext}
        />

        {showMenu && <FileRowContextMenu
            {...showMenu}
            setShowMenu={setShowMenu}
            setSelect={setContext}
        />}

        <BreadCrumbs data={breadCrumbs} />

        {loading && <Loader inline="centered" active className="mt-4" />}

        {!loading && <div>

            {error && <Message error content={error} className="mt-3" />}

            {!error && typeof files == "object" && files.length === 0 && <div className="text-center my-5 opacity-60">
                <div><b>Файлов еще нет</b></div>
                <small>Перетащите сюда файл или используйте кнопку <Icon name="upload" fitted /></small>
            </div>}

            {!error && typeof files == "object" && files.length > 0 && <div className="files-desktop">

                {files.map(file => <FileRow
                    key={file.id}
                    {...props}
                    row={file}
                    showMenu={showMenu}
                    selected={showMenu?.id === file.id}
                    setShowMenu={setShowMenu}
                />)}

                {Array.from({ length: 20 }, (v, k) => k).map((e, i) => <div key={`empty_${i}`} className="file-row-empty" />)}

            </div>}

        </div>}

    </div>

}

export default withRouter(Files);