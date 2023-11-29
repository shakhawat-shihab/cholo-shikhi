import React, { useEffect } from "react";
import {
  Drawer,
  Button,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
} from "@material-tailwind/react";

import "./drawerSidebar.scss";
import { useDispatch, useSelector } from "react-redux";
import { closeDashboardDrawer } from "../../../../../redux/slices/settingsSlice";
import {
  adminDashboard,
  teacherDashboard,
} from "../../../../../utils/dashboardItems";
import Icon from "../../../../atoms/icon/icon";
import { Link } from "react-router-dom";
import useCourseHook from "../../../../../hooks/course/useCourseHook";

type Props = {};

export default function DrawerSidebar({}: Props) {
  // const [open, setOpen] = React.useState(false);
  // const toggleDrawer = () => setShowDrawer(!showDrawer);

  const user = useSelector((state: any) => state.auth.userData);

  const dispatch = useDispatch();

  const { settings, auth } = useSelector((state: any) => state);
  const { userData } = auth;
  // console.log(settings);

  const closeDrawer = () => {
    dispatch(closeDashboardDrawer());
  };

  const { loadTeacherCourses, teacherCourses, isLoadingCourse } =
    useCourseHook();

  useEffect(() => {
    if (user?.role == "teacher") loadTeacherCourses(user?.userRef?.teacherRef);
  }, [user]);

  return (
    <React.Fragment>
      <Drawer
        open={Boolean(settings?.showDashboard).valueOf()}
        onClose={closeDrawer}
        overlay={true}
        className={`${
          settings?.showDashboard ? "make-visible " : "make-hidden"
        } `}
      >
        <div className="mb-2 flex items-center justify-between p-4 z-50">
          <Typography variant="h5" color="blue-gray">
            Material Tailwind
          </Typography>
          <IconButton variant="text" color="blue-gray" onClick={closeDrawer}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </div>
        <List className="bg-white">
          {userData?.role == "teacher" &&
            teacherDashboard?.map((x) => (
              <Link key={x.route} to={`/teacher/dashboard${x?.route}`}>
                <ListItem>
                  <ListItemPrefix>
                    <Icon iconName={x?.icon} className="h-5 w-5" />
                  </ListItemPrefix>
                  {x?.label}
                  <ListItemSuffix>
                    {x?.isNumbered && (
                      <Chip
                        value="14"
                        size="sm"
                        variant="ghost"
                        color="blue-gray"
                        className="rounded-full"
                      />
                    )}
                  </ListItemSuffix>
                </ListItem>
              </Link>
            ))}

          {userData?.role == "admin" &&
            adminDashboard?.map((x) => (
              <Link key={x.route} to={`/admin/dashboard${x?.route}`}>
                <ListItem>
                  <ListItemPrefix>
                    <Icon iconName={x?.icon} className="h-5 w-5" />
                  </ListItemPrefix>
                  {x?.label}
                  <ListItemSuffix>
                    {x?.isNumbered && (
                      <Chip
                        value="14"
                        size="sm"
                        variant="ghost"
                        color="blue-gray"
                        className="rounded-full"
                      />
                    )}
                  </ListItemSuffix>
                </ListItem>
              </Link>
            ))}
        </List>
      </Drawer>
    </React.Fragment>
  );
}
