type usePaginationProps = {
  currentPage: number;
  totalCount: number;
  limit: number;
  visibleCount: number;
  onChangePage: (page: number) => void;
};

/**
 * pagination hook
 * 현재 페이지와 전체 데이터 수를 기반으로 페이지네이션 관련 정보를 계산하고,
 * 페이지 이동 핸들러를 제공합니다.
 *
 * @param {object} params - 페이지네이션 파라미터
 * @param {number} params.currentPage - 현재 페이지 번호 (1-based)
 * @param {number} params.totalCount - 전체 항목 수
 * @param {number} params.limit - 한 페이지당 항목 수
 * @param {number} params.visibleCount - 한 번에 보여줄 페이지 번호 개수
 * @param {(page: number) => void} params.onChangePage - 페이지 번호 변경 핸들러
 *
 */

export default function usePagination({
  currentPage,
  totalCount,
  limit,
  visibleCount,
  onChangePage,
}: usePaginationProps) {
  const totalPage = Math.ceil(totalCount / limit);
  const currentGroup = Math.ceil(currentPage / visibleCount);
  const firstPageInGroup = (currentGroup - 1) * visibleCount + 1;
  const lastPageInGroup = Math.min(currentGroup * visibleCount, totalPage);
  const pageLengthInGroup = lastPageInGroup - firstPageInGroup + 1;
  const pageNumbers = Array.from(
    { length: pageLengthInGroup },
    (_, index) => firstPageInGroup + index,
  );

  const isPrevDisabled = currentPage === 1 || totalPage === 0;
  const isNextDisabled = totalPage === currentPage || totalPage === 0;
  const isPrevGroupDisabled = currentGroup === 1;
  const isNextGroupDisabled = lastPageInGroup === totalPage;

  const handleNextClick = () => {
    if (!isNextDisabled) {
      onChangePage(currentPage + 1);
    }
  };

  const handlePrevClick = () => {
    if (!isPrevDisabled) {
      onChangePage(currentPage - 1);
    }
  };

  const handleNextGroupClick = () => {
    if (!isNextGroupDisabled) {
      onChangePage(lastPageInGroup + 1);
    }
  };

  const handlePrevGroupClick = () => {
    if (!isPrevGroupDisabled) {
      onChangePage(firstPageInGroup - 1);
    }
  };

  return {
    currentPage,
    totalPage,
    currentGroup,
    firstPageInGroup,
    lastPageInGroup,
    pageLengthInGroup,
    pageNumbers,
    isPrevDisabled,
    isNextDisabled,
    isPrevGroupDisabled,
    isNextGroupDisabled,
    handleNextClick,
    handlePrevClick,
    handleNextGroupClick,
    handlePrevGroupClick,
  };
}
