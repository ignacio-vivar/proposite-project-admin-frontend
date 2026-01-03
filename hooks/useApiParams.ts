import { UseApiCall } from "@/models";
import { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";

type UseApiParamsOptions<P, T> = {
  autoFetch?: boolean;
  params?: P; // Parámetros opcionales para autoFetch
  initialData?: T;
};

type CustomError = AxiosError | null;

interface UseApiParamsResult<T, P> {
  loading: boolean;
  data: T;
  setData: React.Dispatch<React.SetStateAction<T>>;
  error: CustomError;
  fetch: (param: P) => void; // Parámetro obligatorio
}

export const useApiParams = <T, P>(
  apiCall: (param: P) => UseApiCall<T>, // Parámetro obligatorio
  options?: UseApiParamsOptions<P, T>,
): UseApiParamsResult<T, P> => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<T>(options?.initialData ?? ({} as T));
  const [error, setError] = useState<CustomError>(null);

  const fetch = useCallback(
    (param: P) => {
      const { call, controller } = apiCall(param); // Parámetro obligatorio
      setLoading(true);

      call
        .then((response) => {
          setData(response.data);
          setError(null);
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setLoading(false);
        });

      return () => controller.abort();
    },
    [apiCall],
  );

  useEffect(() => {
    if (options?.autoFetch && options.params !== undefined) {
      fetch(options.params);
    }
  }, [fetch, options?.autoFetch, options?.params]);

  return { loading, data, setData, error, fetch };
};
