export interface MyQuizAssessment {
    isTried?: boolean;
    isRunning?: boolean;
    duration: number;
    questionCount:number;
    passMarkPercentage?: number;
    status?:string;
    submittedAt?:string;
    marksObtained?:number;
    percentage?:number;
  }

  export type QuestionData = {
    _id: string;
    quizRef: string;
    question: string;
    options: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    nextExist: boolean;
    previousExist: boolean;
    endTime: string;
    userAns:number[]
};

export type MyAnswer={
    questionRef?:string;
    submittedAns?:number[]
}