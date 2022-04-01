import React from "react";
import { useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import { Header, Icon, Input, Modal } from "semantic-ui-react";
import { useActions } from "../../hooks/useActions";
import { axios } from "../../system";

const CreateFolder = ({ match }) => {

    const { createFolder, files } = useSelector(state => state.folder);
    const { setCreateFolder, setFiles } = useActions();

    const [name, setName] = React.useState("");
    const [save, setSave] = React.useState(false);

    const pushNewFolder = React.useCallback((file) => {

        let item = 0;
        let list = [...files];

        for (let i in files) {

            item = i;

            if (files[i].is_dir === false) {
                break;
            }
        }

        list.splice(item, 0, file);

        console.log(item);
        setFiles(list);

    }, [files]);

    React.useEffect(() => {

        return () => {
            setName("");
            setSave(false);
        }

    }, [createFolder]);

    React.useEffect(() => {

        if (save) {

            axios.post('disk/folder/create', {
                name, dir: match?.params?.folder
            }).then(({ data }) => {
                pushNewFolder(data.file);
                setCreateFolder(false);
            }).catch(e => {
                setSave(false);
            });
        }

    }, [save]);

    return <Modal
        open={createFolder}
        // header={<Header content="Создать новый каталог" as="h4" />}
        size="tiny"
        centered={false}
        closeIcon={<Icon
            name="close"
            onClick={() => setCreateFolder(false)}
            disabled={save}
        />}
        closeOnDimmerClick={false}
        closeOnEscape={false}
        content={<div className="content">

            <Header
                content="Создать новый каталог"
                as="h3"
            />

            <Input
                placeholder="Введите имя каталога"
                fluid
                value={name}
                onChange={(e, { value }) => setName(value)}
                disabled={save}
                ref={ref => ref && ref.focus()}
                onKeyUp={e => name.length > 0 && e.keyCode === 13 && setSave(true)}
            />

        </div>}
        actions={[{
            key: "save",
            positive: true,
            content: "Создать",
            icon: "save",
            labelPosition: "right",
            disabled: name.length === 0 || save,
            onClick: () => !save && setSave(true),
            loading: save,
        }]}
    />

}

export default withRouter(CreateFolder);