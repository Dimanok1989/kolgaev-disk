import { useApp } from "@/hooks/useApp";
import Link from "next/link";
import { useRouter } from "next/router";
import { Icon } from "semantic-ui-react";

const Navbar = () => {

    const { pathname } = useRouter();
    const { menu: navigation } = useApp();

    return <nav className={`flex flex-col items-start gap-1 py-3 px-2`}>
        {(navigation || []).map((item, key) => {

            const active = pathname === item.path
                || (pathname.startsWith(item.path) && item.path !== "/");

            return <Link href={item.path} key={key} className={`px-3 py-2 text-white hover:text-white hover:bg-slate-700 block w-full rounded ${active ? "bg-slate-800" : ""}`}>
                {item.icon && <Icon name={item.icon} disabled={!active} className="!me-3" />}
                {item.title}
            </Link>
        })}
    </nav>
};

export default Navbar;
