import {
  UseApiCall,
  UserRegister,
  StudentData,
  StudentAssignatures,
  InfoStudent,
  UserData,
} from "@/models";
import { loadAbort } from "@/utilities";
import axios from "axios";
import {
  REGISTER_URL,
  ALL_STUDENT,
  STUDENT_ASSIGNS,
  STUDENT_ID,
  STD_ASG_LIST,
  DISABLE_STUDENTS,
  ENABLE_STUDENTS,
} from "@/config";

import api from "./token.interceptor";

export const registerUser = (user: UserRegister): UseApiCall<UserData> => {
  const controller = loadAbort();
  return {
    call: axios.post<UserData>(REGISTER_URL, user, {
      signal: controller.signal,
    }),
    controller,
  };
};

export const getAllStudentData = (): UseApiCall<StudentData[]> => {
  const controller = loadAbort();
  return {
    call: api.get<StudentData[]>(ALL_STUDENT, {
      signal: controller.signal,
    }),
    controller,
  };
};

export const getStudentData = (id: number): UseApiCall<StudentData> => {
  const controller = loadAbort();
  return {
    call: api.get<StudentData>(STUDENT_ID(id), {
      signal: controller.signal,
    }),
    controller,
  };
};

export const createStudentData = ({
  id,
  studentData,
}: {
  id: number;
  studentData: InfoStudent;
}): UseApiCall<StudentData> => {
  const controller = loadAbort();
  return {
    call: api.post<StudentData>(STUDENT_ID(id), studentData, {
      signal: controller.signal,
    }),
    controller,
  };
};

export const updateStudentData = ({
  id,
  studentData,
}: {
  id: number;
  studentData: InfoStudent;
}): UseApiCall<StudentData> => {
  const controller = loadAbort();
  return {
    call: api.put<StudentData>(STUDENT_ID(id), studentData, {
      signal: controller.signal,
    }),
    controller,
  };
};

export const getStudentAssignatures = (
  id: number,
): UseApiCall<StudentAssignatures> => {
  const controller = loadAbort();
  return {
    call: api.get<StudentAssignatures>(STUDENT_ASSIGNS(id), {
      signal: controller.signal,
    }),
    controller,
  };
};

export const updateAssignatures = ({
  id,
  array,
}: {
  id: number;
  array: number[];
}): UseApiCall<StudentAssignatures> => {
  const controller = loadAbort();
  const body = array;
  return {
    call: api.put<StudentAssignatures>(STD_ASG_LIST(id), body, {
      signal: controller.signal,
    }),
    controller,
  };
};

export const disableSelectedStudent = (array: number[]): UseApiCall<string> => {
  const controller = loadAbort();
  const body = array;

  return {
    call: api.patch<string>(DISABLE_STUDENTS, body, {
      signal: controller.signal,
    }),
    controller,
  };
};

export const enableSelectedStudent = (array: number[]): UseApiCall<string> => {
  const controller = loadAbort();
  const body = array;

  return {
    call: api.patch<string>(ENABLE_STUDENTS, body, {
      signal: controller.signal,
    }),
    controller,
  };
};
