import React, { useState } from "react";
import { useActions } from "../../hooks/useActions";
import DragEnter from "./DragEnter";
import "./dropzone.css";

export const useDropzone = (props = {}) => {

    const {
        root,
        showDragEnter,
    } = props;

    const { setUploadFiles } = useActions();

    const area = document.getElementById(root || "root");
    const [dragEnter, setDragEnter] = React.useState(false);

    const onDrop = React.useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();

        setUploadFiles(event.dataTransfer?.files || []);
        setDragEnter(false);
    }, []);

    const onDragEnter = React.useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();

        setDragEnter(true);
    }, []);

    const onDragLeave = React.useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
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