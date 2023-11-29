export interface QuestionCreate {
    _id?:string;  // for uddate
    quizRef: string;
    teacherRef: string;
    question: string;
    options: string[];
    correctAns: number[];
}