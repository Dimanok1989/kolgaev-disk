import { Icon, Image } from "semantic-ui-react";
import { useActions } from "../../hooks/useActions";
import "./header.css";

const Header = () => {

    const { setCreateFolder } = useActions();

    return <div className="header-bar">

        <div className="header-bar-content d-flex align-items-center">

            <div className="header-link flex-grow-1">

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

                <span className="mx-2">
                    <Icon
                        name="upload"
                        title="Загрузить файлы"
                        fitted
                        // link
                        disabled
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

export default Header;