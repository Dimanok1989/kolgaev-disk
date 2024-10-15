import { useState } from "react";

function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

const InputUpload = props => {

    const { multiple, onChange } = props;
    const inputId = `upload-file-${String(randomInteger(1000000000, 9999999999))}`;
    const [placeholder, setPlaceholder] = useState(props.placeholder || "Upload file");

    const handleChange = e => {

        let files = e?.target?.files || null;

        if (files && files.length) {
            setPlaceholder(`${files[0]?.name} ${files.length > 1 ? `(+${files.length - 1})` : ``}`.trim());
        } else {
            setPlaceholder(props.placeholder || "Upload file");
        }

        typeof onChange == "function" && onChange(e, {
            files,
            name: e?.target?.name || null,
        });
    }

    return <div className="">

        <input
            multiple={multiple || false}
            type="file"
            className="hidden"
            id={inputId}
            onChange={handleChange}
        />

        <label className="ui fluid button" htmlFor={inputId}>
            <i className="ui upload icon float-start"></i>
            {placeholder}
        </label>

    </div>
}

export default InputUpload;