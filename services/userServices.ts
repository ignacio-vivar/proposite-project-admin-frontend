import { UseApiCall, UserUpdate } from "@/models/";
import { loadAbort } from "@/utilities";
import api from "./token.interceptor";
import { USER_ID } from "@/config";

export const updateUserData = ({
  id,
  userData,
}: {
  id: number;
  userData: UserUpdate;
}): UseApiCall<string> => {
  const controller = loadAbort();
  return {
    call: api.put<string>(USER_ID(id), userData, {
      signal: controller.signal,
    }),
    controller,
  };
};
