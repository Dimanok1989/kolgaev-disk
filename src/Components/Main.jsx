import './../css/main.css';
import MainMenu from './MainMenu';
import FilesContent from './Files/Files';
import UploadsMain from './Uploads/UploadsMain';
import CreateFolder from './Files/CreateFolder';

function Main(props) {

    return <div>

        <div className="main-content py-3">
            <MainMenu />
            <FilesContent />
        </div>

        <UploadsMain />
        <CreateFolder />

    </div>

}

export default Main;