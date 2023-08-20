export type ReturnPagination<T> = {
  meta: {
    limit: number;
    currentPage: number;
    previousPage: number | null;
    nextPage: number | null;
    totalPages: number;
    countItems: number;
  };
  items: T[];
};

export function getPaginationOptions(
  page: number,
  limit: number,
): { offset: number; limit: number } {
  return {
    offset: (page - 1) * limit,
    limit,
  };
}

export function getPaginationData<T = void>(
  items: T[],
  offset: number,
  limit: number,
  count: number,
): ReturnPagination<T> {
  const currentPage = offset / limit + 1;
  const previousPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = limit * currentPage < count ? currentPage + 1 : null;
  const totalPages = Math.ceil(count / limit);

  return {
    meta: {
      limit,
      currentPage,
      previousPage,
      nextPage,
      totalPages,
      countItems: count,
    },
    items,
  };
}
