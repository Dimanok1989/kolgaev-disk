import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Icon, Image, Loader } from "semantic-ui-react";
import { useActions } from "../../hooks/useActions";
import { axios } from "../../system";
import { withRouter } from "react-router-dom";

const Photo = props => {

    const folder = typeof props.match.params == "object" ? String(props.match.params[0]) : "0";

    const { showImage } = useSelector(state => state.folder);
    const { setShowImage } = useActions();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [image, setImage] = useState(null);
    const [change, setChange] = useState({ next: null, prev: null });

    const getImage = useCallback((params = {}) => {

        setLoading(true);

        axios.post('disk/view/image', params).then(({ data }) => {

            setChange({
                next: data.next,
                prev: data.prev
            });

            axios.get('disk/photo', {
                responseType: 'arraybuffer',
                params: {
                    id: params.id,
                    folder: data.folder,
                }
            }).then(({ data }) => {

                let base64 = btoa(
                    new Uint8Array(data).reduce((data, byte) => data + String.fromCharCode(byte), '')
                );

                setImage('data:image/png;base64,' + base64);

            }).catch(e => {
                setError(axios.getError(e));
            }).then(() => {
                setLoading(false);
            });

        }).catch(e => {
            setError(axios.getError(e));
            setLoading(false);
        });

    }, []);

    useEffect(() => {
        showImage && getImage({ id: showImage, folder });
        showImage === null && setError(null);
        showImage === null && setImage(null);
    }, [showImage, folder]);

    if (!showImage)
        return null;

    return <>

        <div className="views-bg"></div>

        {showImage && <div className="view-image">

            {loading && <Loader active inverted />}

            {!loading && error && <div className="bg-danger text-light rounded px-3" style={{ maxWidth: 300 }}>
                <b>{error}</b>
            </div>}

            {!loading && !error && <Image
                src={image}
                className="view-image-file"
                rounded
            />}

        </div>}

        <div
            onClick={() => setShowImage(null)}
            children={<Icon
                name="close"
                fitted
                size="large"
            />}
            className="close-view"
        />

        {!loading && change?.next && <div
            children={<Icon
                name="angle right"
                fitted
                size="large"
            />}
            className="change-view change-next"
            onClick={() => setShowImage(change.next)}
        />}

        {!loading && change?.prev && <div
            children={<Icon
                name="angle left"
                fitted
                size="large"
            />}
            className="change-view change-back"
            onClick={() => setShowImage(change.prev)}
        />}

    </>
}

export default withRouter(Photo);