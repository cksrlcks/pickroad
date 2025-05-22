import { useCallback, useEffect, useRef } from "react";
import { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";

const CONFIRM_MESSAGE = "작성중이던 내용이 사라집니다. 정말 이동하시겠어요??";

export default function useConfirmNavigation(isDirty: boolean) {
  const router = useRouter();
  const isClickedFirst = useRef(false);

  const beforeUnloadHandler = useCallback((e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = true;
  }, []);

  const handlePopState = useCallback(() => {
    if (isDirty) {
      const confirm = window.confirm(CONFIRM_MESSAGE);

      if (!confirm) {
        window.history.pushState(null, "", "");
        return;
      }
    }
    history.back();
  }, [isDirty]);

  useEffect(() => {
    if (isDirty) {
      window.addEventListener("beforeunload", beforeUnloadHandler);
      window.addEventListener("popstate", handlePopState);
    } else {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
      window.removeEventListener("popstate", handlePopState);
    }

    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isDirty, router, beforeUnloadHandler, handlePopState]);

  useEffect(() => {
    if (!isClickedFirst.current) {
      history.pushState(null, "", "");
      isClickedFirst.current = true;
    }
  }, []);

  useEffect(() => {
    const originalPush = router.push;

    router.push = (url: string, options?: NavigateOptions) => {
      if (isDirty) {
        const confirm = window.confirm(CONFIRM_MESSAGE);

        if (confirm) originalPush(url, options);
      } else {
        originalPush(url, options);
      }
    };

    return () => {
      router.push = originalPush;
    };
  }, [router, isDirty]);

  return null;
}
