const Extractor = ({ extractor }) => {

    if (!extractor) {
        return null;
    }

    return <div className="mb-2 flex items-center gap-3" title="Источник видео">
        {extractor.icon && <img src={extractor.icon} width="24px" />}
        {extractor.url && <a href={extractor.url} target="_blank">{extractor.url}</a>}
    </div>
}

export default Extractor;