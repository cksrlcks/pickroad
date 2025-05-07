import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/img/logo.svg";
import Account from "./Account";
import Nav from "./Nav";
import { ThemeToggle } from "./ThemeToggle";

export default function Header() {
  return (
    <div className="fixed top-0 left-0 z-100 flex h-22 w-full items-center gap-10 px-6 backdrop-blur-sm md:px-10">
      <Link href="/">
        <Image src={Logo} alt="Pick Road" className="dark:invert" />
      </Link>
      <Nav />
      <div className="ml-auto flex items-center gap-4">
        <Account />
        <ThemeToggle />
      </div>
    </div>
  );
}
