import React from "react";
import { useDropzone } from "../Dropzone";
import Uploads from "../Uploads";
import { Files, CreateFolder } from ".";
import { withRouter } from "react-router-dom";

const Desktop = () => {

    const [pushFile, setPushFile] = React.useState(null);

    const { DragEnter } = useDropzone({
        showDragEnter: true,
        // block: desktop.current,
    });

    React.useEffect(() => {

        window.Echo && window.Echo.private('Disk')
            .listen('Disk\\NewFile', setPushFile);

        return () => {
            window.Echo && window.Echo.leave('Disk');
        };

    }, []);

    return <div id="desktop">

        <DragEnter />

        <Files pushFile={pushFile} />

        <Uploads />

        <CreateFolder />

    </div>

}

export default withRouter(Desktop);