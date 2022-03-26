import React from "react";
import { useDropzone } from "../Dropzone";

const Desktop = () => {

    const { DragEnter } = useDropzone({
        showDragEnter: true,
        // block: desktop.current,
    });

    return <div className="bg-light" id="desktop">

        <DragEnter />

    </div>

}

export default Desktop;