export interface MyAssignmentAssessment {
    isTried?: boolean;
    total: number;
    passMarkPercentage?: number;
    status?:string;
    percentage?:number;
  }

export type MyAnswer={
    questionRef?:string;
    submittedAns?:number[]
}

export interface PendingAssignment {
  _id: string;
  documentUrl: string;
  endTime: string;
  studentImage?: string | null;
  studentUserName?: string | null;
  userId?: string | null;
  studentId?: string | null;
}