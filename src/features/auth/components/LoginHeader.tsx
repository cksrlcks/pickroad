import Image from "next/image";
import Logo from "@/assets/img/logo.svg";

export default function LoginHeader() {
  return (
    <header className="flex flex-col items-center space-y-4">
      <div>
        <Image src={Logo} alt="Pick Road" />
      </div>
      <p className="text-subtext text-sm">
        Pick-Road의 서비스를 이용하시려면 로그인을 해주세요
      </p>
    </header>
  );
}
