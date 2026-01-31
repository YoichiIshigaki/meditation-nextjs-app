import axios, { type AxiosInstance } from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";

const environment = process.env.NODE_ENV;

const apiEndpoint = (env: string) => {
  switch (env) {
    case "development":
      return "/api/";
    case "staging":
      return "https://stg.some-domain.com/api/";
    case "production":
      return "https://some-domain.com/api/";
    default:
      return "/api/";
  }
};

export const apiInstance: AxiosInstance = axios.create({
  baseURL: apiEndpoint(environment),
  timeout: 30 * 1000, // 30s
  // headers: {'X-Custom-Header': 'foobar'}
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
  body: T,
) => {
  const { isPending, error, data, isSuccess } = useMutation({
    mutationFn: () => apiInstance.post<R>(path, body).then((res) => res.data),
  });
  return { isPending, error, data, isSuccess };
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
  const { isPending, error, isSuccess } = useMutation({
    mutationFn: () => apiInstance.delete(`${path}/${id}`),
  });
  return { isPending, error, isSuccess };
};
