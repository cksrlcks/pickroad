import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/img/logo.svg";
import Account from "./Account";
import Nav from "./Nav";

export default function Header() {
  return (
    <div className="fixed top-0 left-0 z-100 flex h-22 w-full items-center gap-10 bg-white/30 px-6 backdrop-blur-sm md:px-10">
      <Link href="/">
        <Image src={Logo} alt="Pick Road" />
      </Link>
      <Nav />
      <div className="ml-auto">
        <Account />
      </div>
    </div>
  );
}
