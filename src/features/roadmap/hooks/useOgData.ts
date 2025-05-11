import { useState } from "react";
import { toast } from "sonner";
import { getOgData } from "@/actions/roadmap";
import { isValidUrl } from "@/lib/utils";

export function useOgData() {
  const [isFetching, setIsFetching] = useState(false);

  const fetchOgData = async (url: string) => {
    if (!isValidUrl(url)) {
      toast.error("정확한 url을 입력해주세요");
      return undefined;
    }

    setIsFetching(true);

    const response = await getOgData(url);

    setIsFetching(false);

    if (!response.success) {
      toast.error(response.message);
      return undefined;
    }

    return response.payload;
  };

  return { fetchOgData, isFetching };
}
