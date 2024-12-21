import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import File from "@/components/Files/File";
import CreateFolder from "@/components/Actions/CreateFolder";
import { useApp } from "@/hooks/useApp";
import useFetch from "@/hooks/useFetch";
import { useParams } from "next/navigation";
import { createRef, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Loader } from "semantic-ui-react";
import Upload from "@/components/Actions/Upload";
import { UploadProvider } from "@/contexts/uploadContext";
import { ContextMenu } from "primereact/contextmenu";
import FolderGallery from "@/components/Gallery/Gallery";
import Watch from "@/components/Player/Watch";

const Home = () => {

  const { folder } = useParams();
  const { isLoading, getJson } = useFetch();
  const { files, setFiles } = useApp();
  const [meta, setMeta] = useState({});
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [currentPage, setCurrentPage] = useState(meta?.current_page || 1);

  const cm = createRef();
  const [selectedFile, setSelectedFile] = useState();
  const [contextItems, setContextItems] = useState([]);

  const { ref, inView } = useInView({
    threshold: 0.3,
  });

  const fetchFiles = async (params) => {
    await getJson('disk/files', params, response => {
      setFiles((response?.meta?.current_page || 1) > 1 ? [...files, ...response.data] : response.data);
      setMeta(response.meta);
      setCurrentPage((response?.meta?.current_page || 0) + 1);
      setBreadcrumbs(response.breadcrumbs || []);
    });
  }

  useEffect(() => {
    setFiles([]);
    setMeta({});
    setCurrentPage(1);
    fetchFiles(folder ? { folder, page: 1 } : { page: 1 });
  }, [folder]);

  useEffect(() => {
    if (meta?.current_page && meta?.current_page >= meta?.last_page) {
      return;
    }
    (currentPage <= 1) && setFiles([]);
    (inView && !isLoading) && fetchFiles(folder ? { folder, page: currentPage } : { page: currentPage });
  }, [currentPage, inView]);

  const onContextMenu = (event, file) => {
    if (cm.current) {
      setSelectedFile(file);
      cm.current.show(event);
    }
  }

  useEffect(() => {
    const items = [];
    selectedFile?.is_rename && items.push({
      label: 'Переименовать',
      icon: 'pi pi-file-edit',
    });
    items.push({
      label: 'Скачать',
      icon: 'pi pi-download',
      // onClick: () => downloadFile(selectedFile),
    });
    selectedFile?.is_delete && items.push({
      label: 'Удалить',
      icon: 'pi pi-trash',
    });
    setContextItems(items);
    // eslint-disable-next-line
  }, [selectedFile]);

  return <UploadProvider>
    <div className="max-w-screen-lg mx-auto">
      <div className="flex items-center justify-between my-6 px-3">
        <Breadcrumbs items={breadcrumbs} />
        <div className="flex items-center gap-3">
          <Upload />
          <CreateFolder />
        </div>
      </div>
      <FolderGallery />
      <Watch />
      <div className={`p-5 flex flex-wrap justify-center gap-3 bg-white rounded-2xl`}>
        {files.map(a => <File
          key={a.id}
          file={a}
          onContextMenu={onContextMenu}
          isActive={selectedFile?.id === a.id}
        />)}
        {(Array.from({ length: 11 }, (_, i) => i).map(i => <div key={`_e-${i}`} className={`w-[100px]`} />))}
        <ContextMenu
          model={contextItems}
          ref={cm}
          breakpoint="767px"
          className="py-1"
          style={{ boxShadow: "4px 4px 30px 4px rgba(34, 60, 80, 0.43)" }}
          onHide={() => setSelectedFile(null)}
        />
        {files.length === 0 && <div className="flex items-center justify-center opacity-40 w-full my-6">
          <strong>{isLoading ? <Loader active inline /> : 'Файлов ещё нет'}</strong>
        </div>}
      </div>
      <div className="w-full h-[32px] relative my-3">
        {isLoading && files.length > 0 && <div className="text-center absolute left-0 right-0 top-0 bottom-0">
          <Loader active inline />
        </div>}
      </div>
      <div ref={ref} className="h-1" />
    </div>
  </UploadProvider>
};

export default Home;
