interface Answer {
  answer: string;
  userName: string;
  userImage?: string;
  replyTime: string;
}

export interface Forum {
  _id: string;
  userName:string;
  image:string;
  question: string;
  createdAt: string;
  answer: Answer[];
  courseTitle: string;
}