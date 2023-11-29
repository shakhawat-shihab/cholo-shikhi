import React, { useEffect } from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
} from "@material-tailwind/react";

import { useSelector } from "react-redux";
import {
  adminDashboard,
  teacherDashboard,
} from "../../../../utils/dashboardItems";
import Icon from "../../../atoms/icon/icon";
import { Link } from "react-router-dom";
import useCourseHook from "../../../../hooks/course/useCourseHook";
import useSubscriptionHook from "../../../../hooks/subscription/useSubscriptionHook";

type Props = {};

export default function Sidebar({}: Props) {
  const { auth, teacher, subscription } = useSelector((state: any) => state);
  const user = auth.userData;
  // console.log(userData);

  // console.log("subscription ", subscription?.subscriptions);
  const objectNumber: any = {};
  objectNumber["teacherCourseCount"] = teacher?.courseCount;
  objectNumber["courseReqCount"] = teacher?.courseReqCount;
  objectNumber["subscriptionReqCount"] = subscription?.subscriptions?.length;
  // console.log("objectNumber  ", objectNumber);

  return (
    <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
      <div className="mb-2 p-4">
        <Typography variant="h5" color="blue-gray">
          Dashboard
        </Typography>
      </div>
      <List>
        {user?.role == "teacher" &&
          teacherDashboard?.map((x) => (
            <Link to={`/teacher/dashboard${x?.route}`}>
              <ListItem>
                <ListItemPrefix>
                  <Icon iconName={x?.icon} className="h-5 w-5" />
                </ListItemPrefix>
                {x?.label}
                <ListItemSuffix>
                  {objectNumber[`${x?.numberProperty}`] ? (
                    <Chip
                      value={objectNumber[`${x?.numberProperty}`]}
                      size="sm"
                      variant="ghost"
                      color="blue-gray"
                      className="rounded-full"
                    />
                  ) : (
                    <></>
                  )}
                </ListItemSuffix>
              </ListItem>
            </Link>
          ))}

        {user?.role == "admin" &&
          adminDashboard?.map((x) => (
            <Link to={`/admin/dashboard${x?.route}`}>
              <ListItem>
                <ListItemPrefix>
                  <Icon iconName={x?.icon} className="h-5 w-5" />
                </ListItemPrefix>
                {x?.label}
                <ListItemSuffix>
                  {objectNumber[`${x?.numberProperty}`] ? (
                    <Chip
                      value={objectNumber[`${x?.numberProperty}`]}
                      size="sm"
                      variant="ghost"
                      color="blue-gray"
                      className="rounded-full"
                    />
                  ) : (
                    <></>
                  )}
                </ListItemSuffix>
              </ListItem>
            </Link>
          ))}
      </List>
    </Card>
  );
}
