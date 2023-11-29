import { Module, ModuleContent, ModuleDetails } from "../types/module.type";

const helperFunction = () => {
  function getStudentCourseProgress(moduleData: ModuleDetails) {
    console.log("moduleData ---- ", moduleData);
    let moduleCompleted = true;
    let temp: ModuleDetails;
    let runningModule = "";
    let running = "";
    let type = "";
    let ans = moduleData.map((module: any) => {
      if (module.isRunning) {
        moduleCompleted = false;
        module.isRunning = true;
        runningModule = module?._id;
        let contentCompleted = true;
        let contentsTemp = module?.contents?.map((content: any) => {
          if (content.isRunning) {
            contentCompleted = false;
            content.isRunning = true;
            running = content._id;
            type = "content";
          } else if (contentCompleted == true) {
            content.isCompleted = true;
          } else if (contentCompleted == false) {
            content.isCompleted = false;
          }
          return content;
        });
        module.contents = contentsTemp;

        let quizCompleted = true;
        let quizTemp = [];
        if (contentCompleted) {
          // contentCompleted=true means all contents are finished.
          quizTemp = module?.quizzes?.map((quiz: any) => {
            if (quiz.isRunning) {
              quizCompleted = false;
              quiz.isRunning = true;
              running = quiz._id;
              type = "quiz";
            } else if (quizCompleted == true) {
              quiz.isCompleted = true;
            } else if (quizCompleted == false) {
              quiz.isCompleted = false;
            }
            return quiz;
          });
        } else {
          // contentCompleted=false means all contents are not finished. so all quizzes will be locked\
          quizCompleted = false;
          console.log("all contents are not finished");
          quizTemp = module?.quizzes?.map((quiz: any) => {
            quiz.isCompleted = false;
            quiz.isRunning = false;
            return quiz;
          });
        }
        module.quizzes = quizTemp;

        console.log("module ---- ", module?._id);
        console.log("module ---- ", contentCompleted, quizCompleted);

        let assignmentCompleted = true;
        let assignmentTemp = [];
        if (quizCompleted) {
          // quizCompleted=true means all quiz are finished.
          assignmentTemp = module?.assignments?.map((assignment: any) => {
            if (assignment.isRunning) {
              assignmentCompleted = false;
              assignment.isRunning = true;
              running = assignment._id;
              type = "assignment";
            } else if (assignmentCompleted == true) {
              assignment.isCompleted = true;
            } else if (assignmentCompleted == false) {
              assignment.isCompleted = false;
            }
            return assignment;
          });
        } else {
          // quizCompleted=false means all quiz are not finished. so all assignments will be locked
          assignmentCompleted = false;
          assignmentTemp = module?.assignments?.map((assignment: any) => {
            assignment.isCompleted = false;
            assignment.isRunning = false;
            return assignment;
          });
        }
        module.assignments = assignmentTemp;

        return module;
      } else if (moduleCompleted == true) {
        //modules are completed. so mark all content to isCompleted:true
        let contentTemp = module.contents?.map((content: any) => {
          content.isCompleted = true;
          return content;
        });
        module.contents = contentTemp;
        let quizTemp = module.quizzes?.map((quiz: any) => {
          quiz.isCompleted = true;
          return quiz;
        });
        module.quizzes = quizTemp;
        let assignmentTemp = module.assignments?.map((assignment: any) => {
          assignment.isCompleted = true;
          return assignment;
        });
        module.assignments = assignmentTemp;
        return module;
      } else if (moduleCompleted == false) {
        //modules are not completed. so mark all content to isCompleted:false
        let contentTemp = module.contents?.map((content: any) => {
          content.isCompleted = false;
          return content;
        });
        module.contents = contentTemp;
        let quizTemp = module.quizzess?.map((quiz: any) => {
          quiz.isCompleted = false;
          return quiz;
        });
        module.quizzess = quizTemp;
        let assignmentTemp = module.assignments?.map((assignment: any) => {
          assignment.isCompleted = false;
          return assignment;
        });
        module.assignments = assignmentTemp;
        return module;
      }
      return module;
    });
    console.log("helper ----------------- ", {
      running: running,
      type: type,
      module: ans,
      runningModule: runningModule,
    });
    return {
      running: running,
      type: type,
      module: ans,
      runningModule: runningModule,
    };
  }

  function getCurrent(moduleData: ModuleDetails) {
    // console.log("moduleData ", moduleData);
    let ruuningContent = "";
    let type = "";
    let temp: ModuleDetails;
    temp = moduleData?.map((module: any) => {
      if (module?.isRunning) {
        // content
        module?.contents?.map((content: any) => {
          if (content?.isRunning) {
            ruuningContent = content._id;
            type = "content";
          }
        });
        if (!ruuningContent) {
          module?.quizzes?.map((quiz: any) => {
            if (quiz?.isRunning) {
              ruuningContent = quiz._id;
              type = "quiz";
            }
          });
        }
        if (!ruuningContent) {
          module?.assignments?.map((assignmnet: any) => {
            if (assignmnet?.isRunning) {
              ruuningContent = assignmnet._id;
              type = "assignment";
            }
          });
        }
      }
    });
    return { running: ruuningContent, type: type };
  }

  const formatTimeDate = (dateString: Date | string) => {
    const date = new Date(dateString);
    if (!(!isNaN(date.getTime()) && date.toString() !== "Invalid Date")) {
      return "Invalid Date";
    }

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const dayOfWeek = daysOfWeek[date.getDay()];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const time =
      date.getHours() +
      ":" +
      ("0" + date.getMinutes()).slice(-2) +
      ":" +
      ("0" + date.getSeconds()).slice(-2);
    const timeZone = date.toString().match(/\((.*?)\)/)?.[1] || "";
    const formattedDate = `${time} ${day} ${month}, ${year}  `;

    return formattedDate;
  };

  return { getStudentCourseProgress, formatTimeDate, getCurrent };
};
export default helperFunction;
