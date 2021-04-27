import './../css/main.css';
import MainMenu from './MainMenu';
import FilesContent from './Files/FilesContent';

function Main(props) {

    return <div>
        <div className="main-content py-3">
            <MainMenu />
            <FilesContent />
        </div>
    </div>

}

export default Main;