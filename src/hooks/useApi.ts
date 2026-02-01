import axios, { type AxiosInstance } from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { isServer } from "@/lib/utils";

const environment = process.env.NODE_ENV;

const apiEndpoint = (env: string) => {
  if (isServer()) {
    return "/api/"; // SSR時はダミー値を返す
  }
  switch (env) {
    case "development":
    case "local":
      return `http://${window.location.hostname}:${window.location.port}/api/`;
    case "staging":
      return "https://stg.some-domain.com/api/";
    case "production":
      return "https://some-domain.com/api/";
    default:
      return "/api/";
  }
};

// 遅延初期化用のシングルトン
let _apiInstance: AxiosInstance | null = null;

const getApiInstance = (): AxiosInstance => {
  if (!_apiInstance) {
    _apiInstance = axios.create({
      baseURL: apiEndpoint(environment),
      timeout: 30 * 1000, // 30s
    });
  }
  return _apiInstance;
};

// 後方互換性のためのエクスポート
export const apiInstance: AxiosInstance = new Proxy({} as AxiosInstance, {
  get(_, prop) {
    return getApiInstance()[prop as keyof AxiosInstance];
  },
});

export const useGetApi = <R extends Record<string, unknown>>(
  path: string,
  queryParams: Record<string, string>,
  keyName: string,
) => {
  const { isPending, error, data, isSuccess } = useQuery({
    queryKey: [keyName],
    queryFn: () =>
      apiInstance.get<R>(path, queryParams).then((res) => res.data),
  });
  return { isPending, error, data, isSuccess };
};

export const usePostApi = <
  T extends Record<string, unknown>,
  R extends Record<string, unknown>,
>(
  path: string,
) => {
  const { isPending, error, data, isSuccess, mutate, mutateAsync } = useMutation({
    mutationFn: (body: T) => apiInstance.post<R>(path, body).then((res) => res.data),
  });
  return { isPending, error, data, isSuccess, mutate, mutateAsync };
};

export const usePutApi = <
  T extends Record<string, unknown>,
  R extends Record<string, unknown>,
>(
  path: string,
  body: T,
) => {
  const { isPending, error, data, isSuccess } = useMutation({
    mutationFn: () => apiInstance.put<R>(path, body).then((res) => res.data),
  });
  return { isPending, error, data, isSuccess };
};

export const useDeleteApi = (path: string, id: string) => {
  const { isPending, error, isSuccess, mutate } = useMutation({
    mutationFn: () => apiInstance.delete(`${path}/${id}`),
  });
  return { isPending, error, isSuccess, mutate };
};
