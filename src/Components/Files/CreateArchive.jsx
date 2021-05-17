import React from 'react';
import axios from './../../system/axios';
import Cookies from 'js-cookie';

import { connect } from 'react-redux';
import { setCreateArchiveProcess, setCreateArchiveCompete, setDownloadArchive } from './../../store/files/actions';

import CreateArchiveProcess from './CreateArchiveProcess';

function CreateArchive(props) {

    const { createArchiveProcess, setCreateArchiveProcess } = props;
    const { createArchiveComplete, setCreateArchiveCompete } = props;
    const { downloadArchive, setDownloadArchive } = props;

    const [ downloadData, setDownloadData ] = React.useState(null);

    React.useEffect(() => {

        if (createArchiveComplete) {

            setDownloadData(createArchiveComplete.archive);
            setCreateArchiveProcess("completed");
            setCreateArchiveCompete(true);

            setTimeout(() => {
                setCreateArchiveProcess(false);
                setCreateArchiveCompete(false);
            }, 2000);

        }

        return () => setCreateArchiveCompete(null);

    }, [createArchiveComplete]);

    React.useEffect(() => {

        if (downloadArchive) {

            setCreateArchiveProcess(true);
            
            axios.post('disk/downloadFolder', downloadArchive).then(({ data }) => {
                setCreateArchiveProcess({ size: data.size });
            }).catch(error => {
                setCreateArchiveCompete(axios.getError(error));
                setCreateArchiveCompete(true);
            });

        }

        return () => setDownloadArchive(false);

    }, [downloadArchive]);

    React.useEffect(() => {

        if (downloadData) {
        
            const link = document.createElement('a');
            const url = `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}/download`;
            const main_id = Cookies.get('main_id') || null;
        
            link.href = `${url}/${downloadData.name}?folder=${downloadData.id}&main_id=${main_id}`;
            document.body.appendChild(link);
        
            link.click();
        
            document.body.removeChild(link);
        
        }

    }, [downloadData]);

    return <CreateArchiveProcess
        process={createArchiveProcess}
        setCreateProcess={setCreateArchiveProcess}
        completeCreate={createArchiveComplete}
        setCompleteCreate={setCreateArchiveCompete}
    />

}

const mapStateToProps = state => ({
    createArchiveProcess: state.files.createArchiveProcess,
    createArchiveComplete: state.files.createArchiveComplete,
    downloadArchive: state.files.downloadArchive,
});

const mapDispatchToProps = {
    setCreateArchiveProcess,
    setCreateArchiveCompete,
    setDownloadArchive
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateArchive);