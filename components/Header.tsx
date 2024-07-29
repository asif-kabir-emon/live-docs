import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = ({ children, className }: HeaderProps) => {
    return (
        <div className={cn("header", className)}>
            <Link href="/" className="md:flex-1">
                <Image
                    src="/assets/icons/logo.svg"
                    alt="Logo with name"
                    height={32}
                    width={120}
                    className="hidden md:block"
                />
                <Image
                    src="/assets/icons/logo-icon.svg"
                    alt="Logo"
                    height={32}
                    width={32}
                    className="mr-2 md:hidden"
                />
            </Link>
            {children}
        </div>
    );
};

export default Header;
