import Breadcrumbs, { MAIN_PAGE_FOLDER_NAME } from "@/components/Breadcrumbs/Breadcrumbs";
import File from "@/components/Files/File";
import CreateFolder from "@/components/Actions/CreateFolder";
import { useApp } from "@/hooks/useApp";
import useFetch, { getError } from "@/hooks/useFetch";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Loader } from "semantic-ui-react";
import Upload from "@/components/Actions/Upload";
import { UploadProvider } from "@/contexts/uploadContext";
import { ContextMenu } from "primereact/contextmenu";
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';
import FolderGallery from "@/components/Gallery/Gallery";
import Watch from "@/components/Player/Watch";
import Head from "next/head";
import { APP_NAME } from "./_app";
import useAxios from "@/hooks/useAxios";
import { classNames } from "primereact/utils";
import useFileShare from "@/hooks/useFileShare";

const Home = () => {

  const { folder } = useParams();
  const { error, isLoading, getJson } = useFetch();
  const { user, files, setFiles } = useApp();
  const [meta, setMeta] = useState({});
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [currentPage, setCurrentPage] = useState(meta?.current_page || 1);

  const cm = useRef();
  const [selectedFile, setSelectedFile] = useState();
  const [contextItems, setContextItems] = useState([]);
  const { selectShareFile, FileShare } = useFileShare();

  const toast = useRef();

  const { axios } = useAxios();

  const { ref, inView } = useInView({
    threshold: 0.3,
  });

  useEffect(() => {
    setTimeout(() => {
      window.Echo && window.Echo.private(`disk.files.${user.id}`)
        .listen('Disk\\CreateZipFolderDone', (data) => {

          toast.current && toast.current.clear();

          if (data.type === "successful") {
            toast.current && toast.current.show({
              severity: 'success',
              summary: `Архив готов`,
              detail: `Сейчас начнется автоматическое скачивание файла: ${data.file_name}`,
              life: 10000,
            });
            const link = document.createElement('a');
            link.href = data.url;
            link.target = "_blank";
            link.setAttribute('download', data.file_name);
            document.body.appendChild(link);
            link.click();
          } else if (data.type === "failed") {
            toast.current && toast.current.show({
              severity: 'error',
              summary: `Ошибка подготовки`,
              detail: `Не удалось создать архив для каталога: ${data.dirName}`,
              life: 10000,
            });
          }
        });
    }, 500);
    return () => {
      window.Echo && window.Echo.leave(`disk.files.${user.id}`);
    }
  }, [folder]);

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

  /**
   * Запрос на скачивание файла
   * @param {object} file
   * @return {void}
   */
  const downloadFile = useCallback((file) => {

    axios.get(`disk/download/${file.link}`)
      .then(({ data }) => {

        if (!data?.url) {
          toast.current && toast.current.show(
            getToastPrepareFile(file)
          );
        }

        if (data?.url) {

          setTimeout(() => {

            let file_name = data?.file_name
              ? data.file_name
              : `${file.name}${file.extension ? `.${file.extension}` : ``}`;

            const link = document.createElement('a');
            link.href = data.url;
            link.target = "_blank";
            link.setAttribute('download', file_name);
            document.body.appendChild(link);
            link.click();

          }, 500);
        }
      })
      .catch(e => {
        toast.current && toast.current.show({
          severity: 'error',
          summary: `Ошибка подготовки`,
          detail: getError(e),
          life: 10000,
        });
      });
  }, []);

  const onContextMenu = (event, file) => {
    if (cm.current) {
      setSelectedFile(file);
      cm.current.show(event);
    }
  }

  useEffect(() => {

    const items = [];

    if (selectedFile?.isShare) {
      items.push({
        label: 'Общий доступ',
        icon: 'pi pi-users',
        template: ItemContextMenuTemplate,
        onClick: () => selectShareFile(selectedFile),
      });
      items.push({ separator: true, classNames: "border !important" });
    }

    selectedFile?.isRename && items.push({
      label: 'Переименовать',
      icon: 'pi pi-file-edit',
      template: ItemContextMenuTemplate,
    });

    items.push({
      label: 'Скачать',
      icon: 'pi pi-download',
      template: ItemContextMenuTemplate,
      onClick: () => downloadFile(selectedFile),
    });

    selectedFile?.isDelete && items.push({
      label: 'Удалить',
      icon: 'pi pi-trash',
      template: ItemContextMenuTemplate,
    });

    setContextItems(items);

    // eslint-disable-next-line
  }, [selectedFile]);

  return <UploadProvider>
    <Head>
      <title>{breadcrumbs.at(-1)?.name || MAIN_PAGE_FOLDER_NAME} | {APP_NAME}</title>
    </Head>
    <div className="max-w-screen-xl mx-auto">
      {FileShare}
      <div className="flex items-center justify-between my-6 px-3">
        <Breadcrumbs items={breadcrumbs} />
        <div className="flex items-center gap-3">
          <Upload />
          <CreateFolder />
        </div>
      </div>
      <FolderGallery />
      <Watch />
      <div className={`relative p-5 flex flex-wrap justify-center gap-3 bg-white rounded-2xl min-h-[185px]`}>
        {files.map(a => <File
          key={a.id}
          file={a}
          onContextMenu={onContextMenu}
          isActive={selectedFile?.id === a.id}
        />)}
        {(Array.from({ length: 11 }, (_, i) => i).map(i => <div key={`_e-${i}`} className={`w-[100px]`} />))}
        <Toast ref={toast} className="z-40" />
        <ContextMenu
          model={contextItems}
          ref={cm}
          breakpoint="767px"
          className="py-1 file-context-menu"
          style={{ boxShadow: "4px 4px 30px 4px rgba(0, 0, 0, 0.43)" }}
          onHide={() => setSelectedFile(null)}
        />
        {files.length === 0 && <div className="absolute flex items-center justify-center w-full my-6 inset-0">
          {!error && <strong className="opacity-40">{isLoading ? <Loader active inline /> : 'Файлов ещё нет'}</strong>}
          {error && <Message severity="error" text={error} />}
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
}

const ItemContextMenuTemplate = (item, options) => {
  return <span
    className="d-flex cursor-pointer px-3 pt-2 pb-1 flex items-center gap-2"
    onClick={() => typeof item.onClick == "function" && item.onClick()}
  >
    {item.icon && <span><i className={item.icon} /></span>}
    <span>{item.label}</span>
  </span>
}

const getToastPrepareFile = file => ({
  id: `file-${file.id}`,
  severity: 'info',
  summary: `Подготовка ${file.is_dir ? 'каталога' : 'файла'}`,
  detail: `После подготовки загрузка начнется автоматически`,
  sticky: true,
});

export default Home;
