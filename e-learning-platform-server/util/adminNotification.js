const AdminNotificationModel = require("../model/User/AdminNotification");

const addAdminNotification = async function (object) {
  try {
    // console.log("object ", object);
    if (object?.type == "teacherRequest") {
      let res = await AdminNotificationModel.create({
        type: object?.type,
        teacherRef: object?.teacherRef,
        // userRef: "object?.userRef",
        // content: object?.content,
        // link: object?.link,
      });
      // console.log(res);
    }
    if (object?.type == "courseRequest") {
      console.log("courseRequest ", object);
      let res = await AdminNotificationModel.create({
        type: object?.type,
        teacherRef: object?.teacherRef,
        courseRef: object?.courseRef,
        // content: object?.content,
        // link: object?.link,
      });
      // console.log(res);
    }
    if (object?.type == "enrollmentRequest") {
      let res = await AdminNotificationModel.create({
        type: object?.type,
        subscriptionRef: object?.subscriptionRef,
        studentRef: object?.studentRef,
        // content: object?.content,
        // link: object?.link,
      });
      // console.log(res);
    }
  } catch (error) {
    console.error("Error ", error);
    throw error;
  }
};
module.exports = {
  addAdminNotification,
};
