import React from "react";
import { Progress } from "semantic-ui-react";

const UploadProgress = props => {

    const { files, size, upload } = props;

    const [uploaded, setUploaded] = React.useState(0);
    const [percent, setPercent] = React.useState(0);

    React.useEffect(() => {
        if (typeof upload == "object") {
            let uploadSize = 0;
            for (let i in upload) {
                uploadSize += upload[i].uploadSize;
            }
            setUploaded(uploadSize);
        }
    }, [upload]);

    React.useEffect(() => {
        if (size > 0 && uploaded > 0) {
            setPercent(Number((uploaded * 100 / size).toFixed(0)));
        }
    }, [uploaded]);

    console.log({ files, size, upload });

    return <div style={{
        position: "fixed",
        right: 10,
        bottom: 10,
        background: "#ffffff",
        borderRadius: "0.25rem",
        width: 250,
        height: 50,
    }}>
        <Progress percent={percent} indicating={percent !== 100} />
    </div>

}

export default UploadProgress;