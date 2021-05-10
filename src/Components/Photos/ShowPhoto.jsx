import React from 'react';
import axios from './../../system/axios';

import { connect } from 'react-redux';
import { setShowPhoto } from './../../store/files/actions';

import './photo.css';

import { Icon, Loader } from 'semantic-ui-react';

function ShowPhoto(props) {

    // const [locading, setLoading] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [image, setImage] = React.useState(null);
    const [idPhoto, setIdPhoto] = React.useState(null);

    const { photo, openFolder } = props;

    React.useEffect(() => {

        if (photo) {

            setLoading(true);
            setImage(null);

            let id, step;

            if (typeof photo == "object") {
                id = photo.id;
                step = photo.step;
            }
            else {
                id = photo;
                step = null;
            }

            axios.post('disk/showImage', {
                id,
                step,
                folder: openFolder
            }).then(({ data }) => {
                setImage(data.link);
                setIdPhoto(data.id);
            }).catch(error => {
                setLoading(false);
            });

        }

    }, [photo]);

    if (!photo)
        return null;

    return <div className="lite-box d-flex align-items-center justify-content-center">

        {image ? <img src={image} onLoad={() => setLoading(false)} style={{
            opacity: loading ? 0 : 1,
        }} /> : null}

        {loading ? <Loader active inverted indeterminate inline="centered" size="medium" /> : null}

        <div className="d-flex justify-content-center align-items-center hover cursor-pointer lite-box-close" onClick={() => {
            props.setShowPhoto(null);
        }}>
            <Icon name="times" className="text-light" />
        </div>

        {loading ? null : <div className="d-flex justify-content-start align-items-center hover lite-box-back cursor-pointer" onClick={() => {
            props.setShowPhoto({
                id: idPhoto,
                step: "back",
            });
        }}>
            <Icon name="chevron left" className="text-light" />
        </div>}

        {loading ? null : <div className="d-flex justify-content-end align-items-center hover lite-box-next cursor-pointer" onClick={() => {
            props.setShowPhoto({
                id: idPhoto,
                step: "next",
            });
        }}>
            <Icon name="chevron right" className="text-light" />
        </div>}

    </div>;

}

const mapStateToProps = state => ({
    photo: state.files.photo,
    openFolder: state.files.openFolder,
});

const mapDispatchToProps = {
    setShowPhoto
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowPhoto);