export interface HttpResponse<T> {
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
