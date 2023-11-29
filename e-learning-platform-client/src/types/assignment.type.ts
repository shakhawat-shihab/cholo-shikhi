export type assignmentCreate = {
  title?: string;
  description?: string;
  isPremium?: string;
  teacherRef: string;
  courseRef: string;
  moduleRef: string;
  document?: File | null;
  total:number;
  passMarkPercentage:number;
};


export interface Assignment {
  _id: string;
  title: string;
  description: string;
  courseRef: string;
  moduleRef: string;
  teacherRef: string;
  isPublishByTeacher: boolean;
  documentUrl: string;
  total: number;
  passMarkPercentage: number;
  durationInDay: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AssignmentBasic{
  _id: string;
  title: string;
}