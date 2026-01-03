import { loadAbort } from "@/utilities";
import api from "./token.interceptor";
import { StudentAssignatures, UseApiCall } from "@/models";
import {
  ADD_ASSIGMENT,
  GET_ASSIGN_BY_COURSE,
  INIT_ASSIGN,
  UPDATE_ASSIGMENT,
} from "@/config";
import { GradeByCourse } from "@/models/grades.model";

export const initAssignaturesData = ({
  std_id,
}: {
  std_id: number;
}): UseApiCall<StudentAssignatures> => {
  const controller = loadAbort();
  return {
    call: api.post<StudentAssignatures>(INIT_ASSIGN(std_id), {
      signal: controller.signal,
    }),
    controller,
  };
};

export const getAssigmentsByAssignature = (
  id: number,
): UseApiCall<GradeByCourse[]> => {
  const controller = loadAbort();
  return {
    call: api.get<GradeByCourse[]>(GET_ASSIGN_BY_COURSE(id), {
      signal: controller.signal,
    }),
    controller,
  };
};

export const updateAssigments = ({
  id,
  description,
  deadtime,
  type_of_evaluation,
}: {
  id: number;
  description: string;
  deadtime: string;
  type_of_evaluation: string;
}): UseApiCall<string> => {
  const controller = loadAbort();
  const body = {
    description,
    deadtime,
    type_of_evaluation,
  };
  return {
    call: api.put<string>(UPDATE_ASSIGMENT(id), body, {
      signal: controller.signal,
    }),
    controller,
  };
};

export const addAssigmentsByAssignature = ({
  assignature_id,
  description,
  deadtime,
  type_of_evaluation,
}: {
  assignature_id: number;
  description: string;
  deadtime: string;
  type_of_evaluation: string;
}): UseApiCall<string> => {
  const controller = loadAbort();
  const body = {
    description,
    deadtime,
    type_of_evaluation,
    assignature_id,
  };
  return {
    call: api.post<string>(ADD_ASSIGMENT, body, {
      signal: controller.signal,
    }),
    controller,
  };
};
