import { Image } from "semantic-ui-react";
import "./header.css";

const Header = () => {

    return <div className="header-bar">

        <div className="header-bar-content">

            <div className="header-link">

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

        </div>

    </div>

}

export default Header;