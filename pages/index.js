import File from "@/components/Files/File";
import useFetch from "@/hooks/useFetch";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Loader } from "semantic-ui-react";

const Home = () => {

  const { folder } = useParams();
  const { isLoading, getJson } = useFetch();
  const [files, setFiles] = useState([]);
  const [meta, setMeta] = useState({});
  const [currentPage, setCurrentPage] = useState(meta?.current_page || 1);

  const { ref, inView } = useInView({
    threshold: 0.3,
  });

  const fetchFiles = async (params) => {
    await getJson('disk/files', params, response => {
      setFiles(p => [...p, ...response.data]);
      setMeta(response.meta);
      setCurrentPage((response?.meta?.current_page || 0) + 1);
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

  return <div className="max-w-screen-lg mx-auto">
    <div className={`p-5 flex flex-wrap gap-3`}>
      {files.map(a => <File key={a.id} file={a} />)}
    </div>
    <div className="w-full h-[32px] relative mb-3">
      {isLoading && <div className="text-center absolute left-0 right-0 top-0 bottom-0">
        <Loader active inline />
      </div>}
    </div>
    <div ref={ref} className="h-1" />
  </div >
};

export default Home;
