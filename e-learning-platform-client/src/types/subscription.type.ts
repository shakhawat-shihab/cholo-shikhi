// types.ts

export interface Course {
  _id: string;
  title: string;
  teacherUserName: string;
  teacherFirstName: string;
  teacherLastName: string;
  thumbnail: string;
  statusOfSubscription: string;
}

export interface UserDetails {
  _id: string;
  userName: string;
  email: string;
  image?: string;
}

export interface SubscriptionData {
  _id: string;
  isCheckedAdmin: string;
  createdAt: string;
  courses: Course[];
  userDetails: UserDetails;
}

export interface Subscription {
  subscriptions: SubscriptionData[];
  count: number;
  limit: number;
  page: number;
  total: number;
}
