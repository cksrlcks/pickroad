import { Mail } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="break-keep">
      <h2 className="mb-4 text-lg font-semibold">개인정보처리방침</h2>
      <div className="mb-8 space-y-2 text-sm">
        <p>
          본 서비스는 로그인 시 이메일, 이름, 프로필 이미지와 같은 최소한의
          개인정보를 소셜 로그인(Google, Kakao 등)을 통해 수집합니다.
        </p>
        <p>
          이 정보는 사용자 인증과 서비스 개선 목적 외에는 사용되지 않으며,
          제3자에게 제공되지 않습니다.
        </p>
        <p>
          개인정보처리방침에 대한 문의사항이 있으신 경우, 아래의 이메일로 문의해
          주시기 바랍니다.
        </p>
      </div>
      <div className="text-sm">
        <a
          href="mailto:pickroad.master@gmail.com"
          className="font-semibold hover:underline"
        >
          <Mail size={14} className="-mt-0.5 mr-1.5 inline" />
          pickroad.master@gmail.com
        </a>
      </div>
    </div>
  );
}
