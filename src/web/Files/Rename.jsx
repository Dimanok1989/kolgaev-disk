import React from "react";
import { Dimmer, Header, Icon, Input, Loader, Modal } from "semantic-ui-react";
import { useActions } from "../../hooks/useActions";
import { axios } from "../../system";

const Rename = props => {

    const { data, show, close } = props;
    const { setUpdateFileRow } = useActions();

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [formdata, setFormdata] = React.useState({});
    const [save, setSave] = React.useState(false);
    const [saveError, setSaveError] = React.useState(null);
    const [input, setInput] = React.useState(false);

    React.useEffect(() => {

        if (show === true) {

            setLoading(true);
            setError(null);
            setFormdata({ name: data?.name || "" });

            axios.get('disk/file', {
                params: {
                    id: data.id,
                }
            }).then(({ data }) => {
                setFormdata({
                    name: data.row?.name || "",
                    id: data.row?.id || null,
                });
            }).catch(e => {
                setError(axios.getError(e));
            }).then(() => {
                setLoading(false);
            });
        }

        return () => {
            setError(null);
            setFormdata({});
            setSave(false);
            setSaveError(null);
        }

    }, [show]);

    React.useEffect(() => {

        const saveName = formdata => {

            axios.post('disk/file/rename', formdata).then(({ data }) => {
                setUpdateFileRow(data.row);
                close();
            }).catch(e => {
                setSaveError(axios.getError(e));
            }).then(() => {
                setSave(false);
            });

        }

        save && saveName(save);

    }, [save]);

    return <Modal
        open={show}
        size="tiny"
        centered={false}
        closeIcon={<Icon name="close" onClick={close} />}
        content={<div className="content position-relative">

            <Header as="h3" content={`Переименовать ${data.is_dir ? "каталог" : "файл"}`} />

            <Input
                fluid
                placeholder="Укажите имя файла"
                value={formdata.name || ""}
                onChange={(e, { value }) => setFormdata(p => ({ ...p, name: value }))}
                disabled={save ? true : false}
                error={saveError ? true : false}
                onKeyUp={e => e.keyCode === 13 && setSave(formdata)}
            />

            {(error || saveError) && <div className="text-danger mt-1" style={{ marginBottom: -15 }}>
                <small><b>Ошибка:</b> {error || saveError}</small>
            </div>}

            <Dimmer active={loading} inverted>
                <Loader />
            </Dimmer>
        </div>}
        actions={[
            {
                key: "save",
                color: error ? "red" : "green",
                content: "Переименовать",
                icon: "save",
                labelPosition: "right",
                disabled: (error ? true : false) || loading || (save ? true : false),
                loading: save ? true : false,
                onClick: () => setSave(formdata),
            }
        ]}
    />
}

export default Rename;