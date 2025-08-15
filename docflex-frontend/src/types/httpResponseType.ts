export interface HttpResponse<T> {
  total: number;
  totalPages: number;
  success: boolean;
  message: string;
  currentPage(currentPage: any): import("react").SetStateAction<number>;
  _id: any;
  data: T;
  meta?: {
    totalItems?: number;
    [key: string]: any;
  };
  statusCode: number;
  searchResultFound?: boolean;
}
