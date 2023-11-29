import { axiosInstanceToken } from "../utils/axiosCreate";

class NotificationApi {
  endPoints = {
    loadAdminNotifications: "/notification/get-admin-notification",
    loadNotificationByUser: "/notification/get-notification",
    readAdminNotification: "/notification//read-admin-notification",
    readUserNotification: "/notification//read-user-notification",
  };

  loadAdminNotifications = async () => {
    let url = this.endPoints.loadAdminNotifications;
    console.log("url --- ", url);
    let data = await axiosInstanceToken.get(url);
    return data;
  };

  loadNotificationByUser = async (userRef: string) => {
    let url = this.endPoints.loadNotificationByUser;
    console.log();
    url += `/${userRef}`;
    let data = await axiosInstanceToken.get(url);
    return data;
  };

  readAdminNotification = async () => {
    let url = this.endPoints.readAdminNotification;
    let data = await axiosInstanceToken.patch(url);
    return data;
  };

  readUserNotification = async (userId: string) => {
    let url = this.endPoints.loadNotificationByUser;
    url += `/${userId}`;
    let data = await axiosInstanceToken.patch(url);
    return data;
  };
}

export default new NotificationApi();
