export type InfoStudent = {
  group: number;
  year: number;
  active: boolean;
};

type User = {
  id: number;
  email: string;
  name: string;
};

export type StudentData = {
  id: number;
  group: number;
  year: number;
  active: boolean;
  user: User;
};
export type StudentWithTags = StudentData & {
  materiasTags: string[];
};

type Assignatures = {
  name: string;
  tag: string;
  id: number;
};

export type StudentAssignatures = {
  student_id: number;
  id: number;
  assignatures: Assignatures[];
};
