export interface GradeByCourse {
  description: string;
  deadtime: string;
  type_of_evaluation: string;
  id: number;
}

export interface Califications {
  id: number;
  grade: number;
  observation: string;
  status: string;
  task_name: string;
  student_name: string;
}
