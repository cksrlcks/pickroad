// Share roadmap
import { useEffect } from "react";
import { toast } from "sonner";

export function useShareRoadmap() {
  useEffect(() => {
    if (window.Kakao) {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_API_KEY);
      }
    }
  }, []);

  const handleKakaoShareClick = () => {
    if (!window.Kakao) {
      toast.error("카카오톡 SDK가 초기화되지 않았습니다.");
      return;
    }

    window.Kakao.Share.sendScrap({
      requestUrl: window.location.href,
      installTalk: true,
    });
  };

  const handleCopyUrlClick = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("URL이 복사되었습니다.");
  };

  return {
    handleKakaoShareClick,
    handleCopyUrlClick,
  };
}
