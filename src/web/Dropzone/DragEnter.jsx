import { useCallback, useEffect, useRef } from "react";

const DragEnter = ({ show, setShow }) => {

    const block = useRef();
    const onDragLeave = useCallback(() => setShow(false), []);

    useEffect(() => {
        block.current && block.current.addEventListener('dragleave', onDragLeave);
        return () => {
            block.current && block.current.removeEventListener('dragleave', onDragLeave);
        }
    }, []);

    return <div
        className="drag-enter"
        ref={block}
        style={{
            display: show ? "block" : "none",
            transition: ".3s",
        }}
    />

}

export default DragEnter;