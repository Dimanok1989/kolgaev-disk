import React from "react";
import { useDropzone } from "../Dropzone";
import Uploads from "../Uploads";
import Files from "./Files";

const Desktop = () => {

    const { DragEnter } = useDropzone({
        showDragEnter: true,
        // block: desktop.current,
    });

    return <div id="desktop">

        <DragEnter />

        <Files />

        <Uploads />

    </div>

}

export default Desktop;