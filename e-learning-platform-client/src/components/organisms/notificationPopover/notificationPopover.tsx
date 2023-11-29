import React, { useEffect } from "react";
import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Typography,
  Badge,
} from "@material-tailwind/react";
import { BellIcon } from "@heroicons/react/24/solid";
import Icon from "../../atoms/icon/icon";
import { useSelector } from "react-redux";
import useNotificationHook from "../../../hooks/notification/useNotificationHook";
import "./notificationPopover.scss";
import { MdDelete } from "react-icons/md";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import {
  AdminNotification,
  GeneralNotification,
} from "../../../types/notification.type";

type Props = {
  notification: GeneralNotification | undefined;
  adminNotification: AdminNotification | null;
};

export function NotificationPopover({
  notification,
  adminNotification,
}: Props) {
  const [openPopover, setOpenPopover] = React.useState(false);
  const user = useSelector((state: any) => state.auth.userData);

  // console.log("openPopover ", openPopover);

  const { loadAdminNotifications } = useNotificationHook();

  // console.log("adminNotification ", adminNotification);
  // console.log("notification ", notification);

  const readAdminNotification = () => {};

  const readUserNotification = () => {};

  return (
    <Popover open={openPopover} handler={setOpenPopover}>
      <PopoverHandler className="shihab cursor-pointer">
        {user?.role == "admin" ? (
          <div
            className="cursor-pointer"
            onClick={() => readAdminNotification()}
          >
            {adminNotification != null && adminNotification?.length ? (
              <Badge
                className="min-w-18 min-h-18 text-xs p-0"
                content={adminNotification?.length}
              >
                <Icon iconName={BellIcon} className="w-6 h-6" />
              </Badge>
            ) : (
              <Icon iconName={BellIcon} className="w-6 h-6" />
            )}
          </div>
        ) : (
          <div
            className="cursor-pointer"
            onClick={() => readUserNotification()}
          >
            {notification != undefined &&
            notification?.notifications?.length ? (
              <Badge
                className="min-w-18 min-h-18 text-xs p-0"
                content={notification?.notifications?.length}
              >
                <Icon iconName={BellIcon} className="w-6 h-6" />
              </Badge>
            ) : (
              <Icon iconName={BellIcon} className="w-6 h-6" />
            )}
          </div>
        )}
      </PopoverHandler>
      <PopoverContent className="z-50 notification-container py-2">
        <div className="flex items-center gap-1">
          {user?.role == "admin" ? (
            <div className="w-full">
              {adminNotification?.length ? (
                adminNotification?.map((x: any) => {
                  return (
                    <div className=" my-2 border-b py-2">
                      <div className="my-1 py-1 flex items-center">
                        {x?.isSeen == false && (
                          <span className=" p-0.5 rounded-full bg-blue-700 me-2" />
                        )}
                        <div>
                          {x.type == "enrollmentRequest" && (
                            <Link to="/admin/dashboard/subscription-request">
                              {" "}
                              <Typography
                                color="gray"
                                className="text-xs font-medium text-blue-gray-500"
                              >
                                {`${x?.studentInfo?.userName} has requestd to enroll
                          ${x?.subscriptionInfo?.courses?.length} courses`}
                              </Typography>
                            </Link>
                          )}
                        </div>
                        <div>
                          {x.type == "teacherRequest" && (
                            <Link to="/admin/dashboard/teacher-request">
                              <Typography
                                color="gray"
                                className="text-xs font-medium text-blue-gray-500"
                              >
                                {`${x?.teacherInfo?.firstName} ${x?.teacherInfo?.lastName} (${x?.teacherInfo?.userName}) has requestd to be a teacher
                          `}
                              </Typography>
                            </Link>
                          )}
                        </div>
                        <div>
                          {x.type == "courseRequest" && (
                            <Link to="/admin/dashboard/course-request">
                              <Typography
                                color="gray"
                                className="text-xs font-medium text-blue-gray-500"
                              >
                                {`${x?.courseInfo?.teacherUserName} has requestd to publish
                          a course on ${x?.courseInfo?.title}`}
                              </Typography>
                            </Link>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <MdDelete
                          className=" cursor-pointer hover:text-gray-900"
                          size={12}
                        />
                        <IoCheckmarkDoneSharp
                          size={12}
                          className=" ms-3 hover:text-gray-900 cursor-pointer"
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div>No notification Found</div>
              )}
            </div>
          ) : (
            <div className="w-full">
              {notification?.notifications?.length ? (
                notification?.notifications?.map((x: any) => {
                  return (
                    <div className=" my-2 border-b py-2">
                      <div className="my-1 py-1 flex items-center">
                        {x?.isSeen == false && (
                          <span className=" p-0.5 rounded-full bg-blue-700 me-2" />
                        )}
                        <div>
                          <Typography
                            color="gray"
                            className="text-xs font-medium text-blue-gray-500"
                          >
                            {x?.content}
                          </Typography>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <MdDelete
                          className=" cursor-pointer hover:text-gray-900"
                          size={12}
                        />
                        <IoCheckmarkDoneSharp
                          size={12}
                          className=" ms-3 hover:text-gray-900 cursor-pointer"
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div>No notification Found</div>
              )}
            </div>
          )}

          {/* {user?.role == "teacher" || user?.role == "student" ? (
            <div className="w-full">
              {notification?.notifications?.map((x: any) => {
                return (
                  <div className=" my-2 border-b py-2">
                    <div className="my-1 py-1 flex items-center">
                      {x?.isSeen == false && (
                        <span className=" p-0.5 rounded-full bg-blue-700 me-2" />
                      )}
                      <div>
                        {x.type == "enrollmentRequest" && (
                          <Typography
                            color="gray"
                            className="text-xs font-medium text-blue-gray-500"
                          >
                            {x?.content}
                          </Typography>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <MdDelete
                        className=" cursor-pointer hover:text-gray-900"
                        size={12}
                      />
                      <IoCheckmarkDoneSharp
                        size={12}
                        className=" ms-3 hover:text-gray-900 cursor-pointer"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div>No Notification</div>
          )} */}
        </div>
      </PopoverContent>
    </Popover>
  );
}
