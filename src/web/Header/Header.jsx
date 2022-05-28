import { useCallback, useRef } from "react";
import { withRouter } from "react-router-dom";
import { Icon, Image } from "semantic-ui-react";
import { useActions } from "../../hooks/useActions";
import "./header.css";

const Header = (props) => {

    const { setCreateFolder, setUploadFiles } = useActions();
    const input = useRef();

    const changeFiles = useCallback(e => setUploadFiles(e.target?.files || []), []);

    return <div className="header-bar">

        <div className="header-bar-content d-flex align-items-center">

            <div className="header-link flex-grow-1" onClick={() => props.history.push("/")}>

                <Image
                    src="/logo.svg"
                    width={32}
                    height={32}
                    rounded
                />

                <div className="header-title text-nowrap">
                    <strong>Kolgaev.ru</strong>
                    <span>Файлообменник</span>
                </div>

            </div>

            <div className="position-relative d-flex align-items-center" style={{ fontSize: "130%" }}>

                <input
                    type="file"
                    multiple
                    className="d-none"
                    ref={input}
                    onChange={changeFiles}
                />

                <span className="mx-2">
                    <Icon
                        name="upload"
                        title="Загрузить файлы"
                        fitted
                        link
                        onClick={() => input.current && input.current.click()}
                    />
                </span>

                <span className="mx-2">
                    <Icon
                        name="folder"
                        title="Создать каталог"
                        fitted
                        link
                        onClick={() => setCreateFolder(true)}
                    />
                </span>

            </div>

        </div>

    </div>

}

export default withRouter(Header);