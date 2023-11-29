import {
  ArrowUpOnSquareIcon,
  ClipboardDocumentIcon,
  CloudArrowUpIcon,
  Cog6ToothIcon,
  PowerIcon,
  ShieldCheckIcon,
  TvIcon,
  UserCircleIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/solid";

type DashboardItem = {
  label: string;
  icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>
  >;
  route: string;
  isNumbered: boolean;
  numberProperty?: string;
};

export const teacherDashboard: DashboardItem[] = [
  {
    label: "My Profile",
    icon: UserCircleIcon,
    route: "/my-profile",
    isNumbered: false,
  },
  {
    label: "My Courses",
    icon: TvIcon,
    route: "/my-course",
    isNumbered: true,
    numberProperty: "teacherCourseCount",
  },
  {
    label: "Create Course",
    icon: CloudArrowUpIcon,
    route: "/create-course",
    isNumbered: false,
  },
];

export const adminDashboard: DashboardItem[] = [
  {
    label: "My Profile",
    icon: UserCircleIcon,
    route: "/my-profile",
    isNumbered: false,
  },
  {
    label: "Teacher Request",
    icon: ShieldCheckIcon,
    route: "/teacher-request",
    isNumbered: true,
    numberProperty: "teacherRequestCount",
  },
  {
    label: "Course Request",
    icon: VideoCameraIcon,
    route: "/course-request",
    isNumbered: true,
    numberProperty: "courseReqCount",
  },
  {
    label: "Subscription Request",
    icon: ClipboardDocumentIcon,
    route: "/subscription-request",
    isNumbered: true,
    numberProperty: "subscriptionReqCount",
  },
];
