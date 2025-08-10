export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}
