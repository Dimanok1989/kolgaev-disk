import React from 'react';

import { connect } from 'react-redux';
import { setOpenUploadModal } from './../store/uploads/actions';

import { Button } from 'semantic-ui-react';

import { openInput } from './Uploads/UploadsMain';

function UploadsMain(props) {

    const { setOpenUploadModal } = props;

    return <div className="main-header">
        <Button onClick={openInput}>Загрузить</Button>
    </div>

}

const mapStateToProps = state => ({
    show: state.uploads.show,
});

const mapDispatchToProps = {
    setOpenUploadModal
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadsMain);