import './../css/main.css';
import MainMenu from './MainMenu';
import FilesContent from './Files/Files';
import UploadsMain from './Uploads/UploadsMain';

function Main(props) {

    return <div>
        <div className="main-content py-3">
            <MainMenu />
            <FilesContent />
        </div>
        <UploadsMain />
    </div>

}

export default Main;