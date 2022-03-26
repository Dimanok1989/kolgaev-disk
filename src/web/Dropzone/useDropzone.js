import React, { useState } from "react";
import DragEnter from "./DragEnter";
import "./dropzone.css";

export const useDropzone = (props = {}) => {

    const {
        root,
        showDragEnter,
    } = props;

    const area = document.getElementById(root || "root");
    const [dragEnter, setDragEnter] = React.useState(false);

    const onDrop = React.useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();

        let dt = event.dataTransfer
        let files = dt.files

        console.log(files, event);
        setDragEnter(false);
    }, []);

    const onDragEnter = React.useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();

        console.log(event);
        setDragEnter(true);
    }, []);

    const onDragLeave = React.useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();

        console.log(event);
    }, []);

    const onDragOver = React.useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);

    React.useEffect(() => {

        area.addEventListener('drop', onDrop);
        area.addEventListener('dragenter', onDragEnter);
        area.addEventListener('dragleave', onDragLeave);
        area.addEventListener('dragover', onDragOver);

        return () => {
            area.removeEventListener('drop', onDrop);
            area.removeEventListener('dragenter', onDragEnter);
            area.removeEventListener('dragleave', onDragLeave);
            area.removeEventListener('dragover', onDragOver);
        }

    }, []);

    return {
        DragEnter: () => <DragEnter
            show={dragEnter}
            setShow={setDragEnter}
            onDrop={onDrop}
        />
    }

}

export default useDropzone;