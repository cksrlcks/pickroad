import { PropsWithChildren, Suspense } from "react";
import FilterProvider from "./FilterProvider";
import Header from "./Header";
import Inner from "./Inner";

/**
 * 상단 헤더의 필터링과, 본문의 필터링이 복합적으로 적용되는 레이아웃
 * (본문과 헤더의 url searchparams 연계가 필요한 페이지)
 */
export function RoadmapLayout({ children }: PropsWithChildren) {
  return (
    <Suspense>
      <FilterProvider basePath="/roadmap">
        <Header />

        <Inner className="pb-10">
          <main>{children}</main>
        </Inner>
      </FilterProvider>
    </Suspense>
  );
}

/**
 * 상단 헤더의 필터링만 적용되는 레이아웃
 * (본문과 헤더의 url searchparams 연계가 필요하지 않은 페이지)
 */
export function DefaultLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Suspense>
        <FilterProvider basePath="/roadmap">
          <Header />
        </FilterProvider>
      </Suspense>

      <Inner className="pb-10">
        <main>{children}</main>
      </Inner>
    </>
  );
}
