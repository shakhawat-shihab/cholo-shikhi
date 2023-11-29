import React, { useEffect, useState } from "react";
import useModuleHook from "../../../hooks/module/useModuleHook";
import { useLocation, useParams } from "react-router-dom";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Typography,
} from "@material-tailwind/react";
import { Module, ModuleDetails } from "../../../types/module.type";
import { IoIosArrowDropdown } from "react-icons/io";
import {
  MdAssignment,
  MdDocumentScanner,
  MdQuiz,
  MdTextFormat,
  MdVideoCall,
  MdVideoCameraBack,
  MdWorkspacePremium,
} from "react-icons/md";
import { AiFillCheckCircle } from "react-icons/ai";
import ViewContent from "./viewContent";
import { useSelector } from "react-redux";
import helperFunction from "../../../utils/helper";
import { BsCheck, BsLockFill, BsPauseCircleFill } from "react-icons/bs";
import { FaCircleCheck, FaLock } from "react-icons/fa6";
import "./courseContent.scss";
import { Dispatch } from "@reduxjs/toolkit";

type Props = {
  setSelectedContentId?: (_id: string) => void;
  setSelectedContentType?: (_id: string) => void;
  courseTeacherRef?: string;
  reloadContentStudent?: boolean;
  setCurrentModule?: React.Dispatch<React.SetStateAction<string>>;
};

export default function CourseContent({
  setSelectedContentId,
  setSelectedContentType,
  courseTeacherRef,
  reloadContentStudent,
  setCurrentModule,
}: Props) {
  4;
  const [studentProgress, setStudentProgress] =
    useState<ModuleDetails | null>();
  const [current, setCurrent] = useState<{ type: string; running: string }>({
    type: "",
    running: "",
  });
  const { courseId } = useParams();
  const user = useSelector((state: any) => state.auth.userData);
  const location = useLocation();
  const { loadModuleByGeneralUser, loadModuleByStudent, moduleDetails } =
    useModuleHook();

  const { getStudentCourseProgress, getCurrent } = helperFunction();

  useEffect(() => {
    if (
      moduleDetails &&
      user?.role == "student" &&
      location?.pathname?.startsWith("/my-course")
    ) {
      let info: {
        type: string;
        running: string;
        runningModule: string;
        module: ModuleDetails;
      } = getStudentCourseProgress(moduleDetails);
      // console.log("temp           =                   ", temp);
      info?.runningModule && setCurrentModule(info?.runningModule);
      info?.running && setSelectedContentId(info.running);
      info?.type && setSelectedContentType(info?.type);
      setStudentProgress(info?.module);
      console.log("info   ", info);
      // setPlayCourseCurrentContent();
    }
  }, [moduleDetails]);

  console.log("moduleDetails ------------ ", moduleDetails);
  // "/mycourse" thakle student er data dia module load korte hbe

  useEffect(() => {
    if (courseId && location?.pathname?.startsWith("/course-detail")) {
      // console.log(
      //   "/course-detail    ---------------------   loadModuleByGeneralUser"
      // );
      loadModuleByGeneralUser({ courseId: courseId });
    } else if (courseId && location?.pathname?.startsWith("/my-course")) {
      // console.log("@@@@@@@@@@@@@loadModuleByStudent@@@@@@@@@@@@@@@@@@");
      loadModuleByStudent({
        courseId: courseId,
        studentRef: user?.userRef?.studentRef,
      });
    } else if (courseId) {
      loadModuleByGeneralUser({
        courseId: courseId,
      });
    }
  }, [courseId, location, reloadContentStudent]);

  const [open, setOpen] = React.useState("0");
  const [viewContent, setViewContent] = React.useState(false);
  const [contentId, setContentId] = React.useState("");
  const [type, setType] = React.useState("");
  const [quizId, setQuizId] = React.useState("");
  const [videoId, setVideoId] = React.useState("");

  const handleOpen = (value: string) => setOpen(open === value ? "0" : value);

  const handleContentOpen = () => {
    setViewContent(!viewContent);
  };

  let selectedContent = (props: { id: string; type: string }) => {
    console.log("selected content id ", props?.id);
    if (location.pathname.startsWith("/course-detail")) {
      setViewContent(true);
      setContentId(props?.id);
    } else if (location.pathname.startsWith("/my-course")) {
      setSelectedContentId && setSelectedContentId(props?.id);
      setSelectedContentType && setSelectedContentType(props?.type);
    } else if (location.pathname.startsWith("/admin/dashboard")) {
      console.log("admin");
      setViewContent(true);
      setContentId(props?.id);
    }
  };

  const [student, setStudent] = useState(false);
  useEffect(() => {
    if (user?.role == "student" && location.pathname.startsWith("/my-course")) {
      setStudent(true);
    }
  }, [user]);

  return (
    <div className="h-96">
      {!location?.pathname?.startsWith("/my-course") && viewContent && (
        <ViewContent
          viewContent={viewContent}
          handleContentOpen={handleContentOpen}
          type={type}
          contentId={contentId}
          courseTeacherRef={courseTeacherRef}
        />
      )}

      {moduleDetails?.map((module: ModuleDetails) => (
        <Accordion
          className="py-0  module-container-custom "
          open={open == module?._id}
          key={module?._id}
        >
          <AccordionHeader
            onClick={() => handleOpen(module?._id)}
            className="py-3 font-semibold text-base"
          >
            <div className=" w-full flex justify-between items-center">
              <p>{module?.title}</p>
              <p>
                <IoIosArrowDropdown
                  className={`${open == module?._id && "rotate-180"}`}
                />
              </p>
            </div>
          </AccordionHeader>
          <AccordionBody className="py-0 ">
            {module?.contents?.map((content: any) => (
              <Typography
                as="h4"
                className="ms-4 py-2 flex items-center hover:text-blue-gray-700 text-gray-900 "
                onClick={() => {
                  selectedContent({ id: content?._id, type: "content" });
                }}
                key={content?._id}
              >
                <span>
                  {student && (
                    <>
                      {content?.isRunning ? (
                        <>
                          {" "}
                          <BsPauseCircleFill
                            size={14}
                            className="text-yellow-900 me-2"
                          />
                        </>
                      ) : (
                        <>
                          {content?.isCompleted ? (
                            <>
                              <FaCircleCheck
                                size={14}
                                className="text-green-900 me-2"
                              />
                            </>
                          ) : (
                            <>
                              <FaLock size={14} className="text-red-700 me-2" />
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </span>

                <span>
                  {" "}
                  {content?.type == "document" && <MdDocumentScanner />}
                </span>
                <span> {content?.type == "text" && <MdTextFormat />}</span>
                <span>
                  {" "}
                  {content?.type == "video" && <MdVideoCameraBack />}
                </span>

                <span className="ps-2 text-sm">{content?.title}</span>
                <span className="ms-2 text-yellow-900">
                  {" "}
                  {content?.isPremium && <MdWorkspacePremium />}{" "}
                </span>
              </Typography>
            ))}

            {module?.quizzes?.map((quiz: any) => (
              <Typography
                as="h4"
                className="ms-4 py-2 flex items-center hover:text-blue-gray-700 text-gray-900"
                onClick={() => {
                  selectedContent({ id: quiz?._id, type: "quiz" });
                }}
                key={quiz?._id}
              >
                <span>
                  {student && (
                    <>
                      {quiz?.isRunning ? (
                        <>
                          {" "}
                          <BsPauseCircleFill
                            size={14}
                            className="text-yellow-900 me-2"
                          />
                        </>
                      ) : (
                        <>
                          {quiz?.isCompleted ? (
                            <>
                              <FaCircleCheck
                                size={14}
                                className="text-green-900 me-2"
                              />
                            </>
                          ) : (
                            <>
                              <FaLock size={14} className="text-red-700 me-2" />
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </span>
                <span>
                  <MdQuiz />
                </span>
                <span className="ps-2 text-sm">{quiz?.title}</span>
                <span className="ms-2 text-yellow-900">
                  <MdWorkspacePremium />
                </span>
              </Typography>
            ))}

            {module?.assignments?.map((assignment: any) => (
              <Typography
                as="h4"
                className="ms-4 py-2  flex items-center hover:text-blue-gray-700 text-gray-900"
                onClick={() => {
                  selectedContent({ id: assignment?._id, type: "assignment" });
                }}
              >
                <span>
                  {student && (
                    <>
                      {assignment?.isRunning ? (
                        <>
                          {" "}
                          <BsPauseCircleFill
                            size={14}
                            className="text-yellow-900 me-2"
                          />
                        </>
                      ) : (
                        <>
                          {assignment?.isCompleted ? (
                            <>
                              <FaCircleCheck
                                size={14}
                                className="text-green-900 me-2"
                              />
                            </>
                          ) : (
                            <>
                              <FaLock size={14} className="text-red-700 me-2" />
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </span>
                <span>
                  <MdAssignment />
                </span>
                <span className="ps-2 text-sm">{assignment?.title}</span>
                <span className="ms-2 text-yellow-900">
                  <MdWorkspacePremium />
                </span>
              </Typography>
            ))}
          </AccordionBody>
        </Accordion>
      ))}
    </div>
  );
}
