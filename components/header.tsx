import {ReactElement} from "react";
import Link from "next/link";

export const Header = (): ReactElement => {
    return (
        <nav className="bg-navy flex items-center justify-between px-10 py-7.5">
            <Link href={"/"} className="flex items-center gap-2.5">
                <span className="text-gold font-medium">Praise & Confused</span>
            </Link>
            <div className="flex gap-5 text-sm text-stone-300">
                <Link href={"/episodes"}>Episodes</Link>
                <Link href={"/about"}>About</Link>
                <Link href={"mailto:realpncpod@gmail.com"}>Contact</Link>
            </div>
        </nav>
    )
}
