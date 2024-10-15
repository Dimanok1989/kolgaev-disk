import { useApp } from "@/hooks/useApp";
import Link from "next/link";

function Header() {

    const { user } = useApp();

    console.log(user);
    return <>
        <div className="bg-white py-4 px-5 sticky top-0 z-20 bg-opacity-80 cursor-default">
            <div className="w-full max-w-screen-xl mx-auto flex justify-between">
                <div className="text-xl flex gap-3 items-center">
                    <Link href="/" className="flex gap-1 items-center text-black hover:text-blue-900">
                        <img
                            src="/favicon.svg"
                            className="rounded w-[32px] h-[32px]"
                            alt="icon"
                        />
                        <strong>Файлообменник</strong>
                    </Link>
                    {/* <Link href="/">Файлы</Link> */}
                    <Link href="/video">Видео</Link>
                </div>
                <div className="flex gap-3 items-center">
                    <strong>{user.name || (user.username ? `@${user.username}` : `id-${user.id}`)}</strong>
                    {user.avatar && <img
                        src={user.avatar}
                        className="rounded w-[32px] h-[32px]"
                        alt="avatar"
                    />}
                </div>
            </div>
        </div>
    </>
}

export default Header;