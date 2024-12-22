import Link from "next/link";

export const MAIN_PAGE_FOLDER_NAME = "Мои файлы";

const Breadcrumbs = ({ items }) => {
    return <div className="flex my-3">
        <Link href={`/`}>{MAIN_PAGE_FOLDER_NAME}</Link>
        {(items.length > 0) && <img className="mx-3 inline" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='7' height='8' fill='none' viewBox='0 0 7 8'%3E%3Cpath stroke='%23B4BBC6' stroke-linecap='round' stroke-width='2' d='m2 1 3 3-3 3' opacity='.5'/%3E%3C/svg%3E" />}
        {items.map((item, i) => <span key={item.id}>
            {i === (items.length - 1)
                ? <span className="cursor-default font-bold">{item.name}</span>
                : <Link href={`/${item.path}`}>{item.name}</Link>
            }
            {i < items.length - 1 &&
                <img className="mx-3 inline" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='7' height='8' fill='none' viewBox='0 0 7 8'%3E%3Cpath stroke='%23B4BBC6' stroke-linecap='round' stroke-width='2' d='m2 1 3 3-3 3' opacity='.5'/%3E%3C/svg%3E" />
            }
        </span>)}

    </div>
}

export default Breadcrumbs;