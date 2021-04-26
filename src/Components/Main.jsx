import './../css/main.css';
import MainMenu from './MainMenu';

function Main(props) {

    return <div>
        <div className="main-content py-3">
            <MainMenu />
            <div className="files-content mx-1">Files</div>
        </div>
    </div>

}

export default Main;