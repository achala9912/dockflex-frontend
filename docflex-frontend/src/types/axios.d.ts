import "axios";

declare module "axios" {
  interface AxiosRequestConfig {
    skipLoading?: boolean;
  }
}
