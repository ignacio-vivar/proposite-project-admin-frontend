import {
  DELETE_TASK,
  GET_GRADE_LIST_BY_COURSE,
  UPDATE_GRADE_BY_ID,
} from "@/config";
import { UseApiCall } from "@/models";
import { Califications } from "@/models/grades.model";
import { loadAbort } from "@/utilities";
import api from "./token.interceptor";

export const getGradesByAssignature = (
  id: number,
): UseApiCall<Califications[]> => {
  const controller = loadAbort();
  return {
    call: api.get<Califications[]>(GET_GRADE_LIST_BY_COURSE(id), {
      signal: controller.signal,
    }),
    controller,
  };
};

export const updateGrade = ({
  id,
  grade,
  observation,
  status,
}: {
  id: number;
  grade: number;
  observation: string;
  status: string;
}): UseApiCall<string> => {
  const controller = loadAbort();
  const body = {
    grade,
    observation,
    status,
  };
  return {
    call: api.put<string>(UPDATE_GRADE_BY_ID(id), body, {
      signal: controller.signal,
    }),
    controller,
  };
};

export const deleteGrade = (id: number): UseApiCall<string> => {
  const controller = loadAbort();
  return {
    call: api.delete<string>(DELETE_TASK(id), {
      signal: controller.signal,
    }),
    controller,
  };
};
