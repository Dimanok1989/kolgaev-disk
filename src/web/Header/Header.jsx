import { Button, Image } from "semantic-ui-react";
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

            <div className="position-relative d-flex align-items-center">

                <Button.Group className="position-absolute" basic style={{ right: 0 }}>

                    <Button
                        icon={{ name: "upload" }}
                        title="Загрузить файлы"
                        disabled
                        className="p-2"
                    />

                    <Button
                        icon={{ name: "folder" }}
                        title="Создать каталог"
                        className="p-2"
                        onClick={() => setCreateFolder(true)}
                    />

                </Button.Group>

            </div>

        </div>

    </div>

}

export default Header;