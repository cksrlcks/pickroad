"use client";

import IconGoogle from "@/assets/img/icon-google.svg";
import IconKakao from "@/assets/img/icon-kakao.svg";
import { authClient } from "@/lib/auth-client";
import { SocialButton } from "./SocialButton";

export default function SocialLogin() {
  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  const handleKakaoLogin = async () => {
    await authClient.signIn.oauth2({
      providerId: "kakao",
      callbackURL: "/",
    });
  };

  return (
    <ul className="space-y-1.5">
      <li>
        <SocialButton
          icon={IconGoogle}
          label="구글로 시작하기"
          onClick={handleGoogleLogin}
        />
      </li>
      <li>
        <SocialButton
          className="border-[#f2d413] bg-[#fee400] text-slate-950 hover:bg-[#fed800]"
          icon={IconKakao}
          label="카카오로 시작하기"
          onClick={handleKakaoLogin}
        />
      </li>
    </ul>
  );
}
