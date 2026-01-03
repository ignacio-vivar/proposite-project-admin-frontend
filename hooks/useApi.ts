"use client";

import { UseApiCall } from "@/models/useApi.model";
import { useCallback, useEffect, useState } from "react";

type UseApiOptions<T> = {
  autoFetch?: boolean;
  initialData?: T;
};

type CustomError = Error | null;

interface UseApiResult<T> {
  loading: boolean;
  data: T;
  error: CustomError;
  fetch: () => void;
}

export const useApi = <T>(
  apiCall: () => UseApiCall<T>,
  options?: UseApiOptions<T>,
): UseApiResult<T> => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<T>(options?.initialData ?? ({} as T));
  const [error, setError] = useState<CustomError>(null);

  const fetch = useCallback(() => {
    const { call, controller } = apiCall();
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
  }, [apiCall]);

  useEffect(() => {
    if (options?.autoFetch) {
      return fetch();
    }
  }, [fetch, options?.autoFetch]);

  return { loading, data, error, fetch };
};
