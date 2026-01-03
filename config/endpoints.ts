export const API_BASE_URL = "http://localhost:8000";

export const LOGIN_URL = `${API_BASE_URL}/auth`;

export const USERS = `users`;

export const REGISTER_URL = `${API_BASE_URL}/${USERS}/register`;

const ADMIN_ASG = `admin/assignature`;

const ADMIN_STD = `admin/students`;

export const ALL_STUDENT = `${API_BASE_URL}/${ADMIN_STD}`;

export const STUDENT_ID = (id: number) => `${API_BASE_URL}/${ADMIN_STD}/${id}`;

export const STUDENT_ASSIGNS = (id: number) =>
  `${API_BASE_URL}/${ADMIN_ASG}/getStudentAssignatures/${id}`;

export const USER_ID = (id: number) => `${API_BASE_URL}/admin/users/${id}`;

const ADMIN_ST_SG = `admin/assignature/student`;

export const STD_ASG_LIST = (id: number) =>
  `${API_BASE_URL}/${ADMIN_ST_SG}/${id}/assignatures`;

export const INIT_ASSIGN = (std_id: number) =>
  `${API_BASE_URL}/${ADMIN_ST_SG}/${std_id}/initAssignatures`;

export const GET_ASSIGN_BY_COURSE = (asg_id: number) =>
  `${API_BASE_URL}/admin/tasks/mindata/${asg_id}`;

export const UPDATE_ASSIGMENT = (id: number) =>
  `${API_BASE_URL}/admin/tasks_update/${id}`;

export const ADD_ASSIGMENT = `${API_BASE_URL}/admin/tasks`;

export const GET_GRADE_LIST_BY_COURSE = (id: number) =>
  `${API_BASE_URL}/admin/tasks/grades_list/${id}/`;

export const UPDATE_GRADE_BY_ID = (id: number) =>
  `${API_BASE_URL}/admin/submissions/${id}`;

export const DELETE_TASK = (id_task: number) =>
  `${API_BASE_URL}/admin/tasks_delete/${id_task}`;

export const DISABLE_STUDENTS = `${API_BASE_URL}/${ADMIN_STD}/disableSelecteds`;

export const ENABLE_STUDENTS = `${API_BASE_URL}/${ADMIN_STD}/enableSelecteds`;
