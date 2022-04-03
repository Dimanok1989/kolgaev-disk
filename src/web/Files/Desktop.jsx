import React from "react";
import { useDropzone } from "../Dropzone";
import Uploads from "../Uploads";
import { Files, CreateFolder } from ".";
import { withRouter } from "react-router-dom";
import Photo from "../Views/Photo";

const Desktop = () => {

    const [pushFile, setPushFile] = React.useState(null);
    const [updateFile, setUpdateFile] = React.useState(null);

    const { DragEnter } = useDropzone({
        showDragEnter: true,
        // block: desktop.current,
    });

    React.useEffect(() => {

        window.Echo && window.Echo.private('Disk')
            .listen('Disk\\NewFile', setPushFile)
            .listen('Disk\\UpdateFile', setUpdateFile);

        return () => {
            window.Echo && window.Echo.leave('Disk');
        };

    }, []);

    return <div id="desktop">

        <DragEnter />

        <Files
            pushFile={pushFile}
            updateFile={updateFile}
        />

        <Uploads />

        <CreateFolder />

        <Photo />

    </div>

}

export default withRouter(Desktop);