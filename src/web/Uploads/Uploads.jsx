import React from "react";
import { useSelector } from "react-redux";
import useUpload from "./useUpload";

const Uploads = () => {

    const { uploads } = useSelector(store => store.folder);
    const [files, setFiles] = React.useState([]);
    const [step, setStep] = React.useState(null);

    const { uploadFile } = useUpload({
        uploaded: () => setStep(step => (step + 1)),
    });

    React.useEffect(() => {

        if (typeof uploads == "object") {

            setFiles(prev => {

                let list = [...prev];

                Array.from(uploads).forEach(row => {
                    list.push(row);
                });

                return list;
            });
        }

    }, [uploads]);

    React.useEffect(() => {
        if (files.length > 0 && step === null) {
            setStep(0);
        }
    }, [files]);

    React.useEffect(async () => {

        if (step !== null && typeof files[step] != "undefined") {
            await uploadFile(files[step]);
        } else if (step !== null && typeof files[step] == "undefined") {
            setStep(null);
            setFiles([]);
        }

    }, [step]);

    return null;

}

export default Uploads;