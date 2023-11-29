import React, { ChangeEvent, useEffect, useState } from "react";
import CourseContent from "../../organisms/courseContent/courseContent";
import useContentHook from "../../../hooks/content/useContentHook";
import { useSelector } from "react-redux";
import ReactPlayer from "react-player";
import { Button, Typography } from "@material-tailwind/react";
import useQuizAssessmentHook from "../../../hooks/quizHook/useQuizAssessmentHook";
import AnswerQuiz from "../../organisms/answerQuiz/answerQuiz";
import useAssignmentHook from "../../../hooks/assignment/useAssignmentHook";
import useAssignmentAssessmentHook from "../../../hooks/assignmentAssessmentHook/useAssignmentAssessmentHook";
import AnswerAssignment from "../../organisms/answerAssignment/answerAssignment";
import { IoDocumentAttachOutline } from "react-icons/io5";
import IconedInputBox from "../../molecules/iconedInput/iconedInputBox";
import useQuizHook from "../../../hooks/quiz/useQuizHook";
import useModuleHook from "../../../hooks/module/useModuleHook";
import ReactQuill from "react-quill";
import useCourseHook from "../../../hooks/course/useCourseHook";

type Props = {};

export default function PlayCourse({}: Props) {
  const [reloadAssessment, setReloadAssessment] = React.useState(false);
  const [contentId, setContentId] = React.useState("");
  const [type, setType] = React.useState("");
  const user = useSelector((state: any) => state.auth.userData);

  const [reloadContentStudent, setReloadContentStudent] = useState(false);

  const setSelectedContentId = (contentId: string) => {
    // quizId assignmentId contentId
    console.log("setting new content id ", contentId);
    setContentId(contentId);
  };

  const setSelectedContentType = (type: string) => {
    // quiz assignment content
    console.log("setting new content type ", type);
    setType(type);
  };

  const { loadContentByIdStudent, content, completeContent } = useContentHook();

  const { completeQuiz } = useQuizHook();

  const {
    getMyAssessment,
    myAssessment,
    startQuizAssessment,
    isLoadingQuizAssessment,
  } = useQuizAssessmentHook();

  const {
    getMyAssignmentAssessment,
    myAssignmentAssessment,
    assignmentAssessmentSubmit,
    isLoadingAssignmentAssessment,
  } = useAssignmentAssessmentHook();

  const { getAssignmentById, assignment, completeAssignment } =
    useAssignmentHook();
  const { completeModule, isLoadingModule } = useModuleHook();

  React.useEffect(() => {
    // if (contentId) {
    if (user?.role == "student") {
      if (type == "content") {
        loadContentByIdStudent({
          studentRef: user?.userRef?.studentRef,
          contentId: contentId,
        });
      } else if (type == "quiz") {
        // console.log("quiz  loaddddddddddddddddddddddddddddddddddd ");
        // loadQuizByIdStudent({
        // studentRef: user?.userRef?.studentRef,
        // contentId: contentId,
        // });
        console.log("@@@@@@@@@@reload my quiz assessment @@@@@@@@@");
        getMyAssessment({
          studentRef: user?.userRef?.studentRef,
          quizRef: contentId,
        });
      } else if (type == "assignment") {
        getAssignmentById(contentId);
        getMyAssignmentAssessment({
          studentRef: user?.userRef?.studentRef,
          assignmentRef: contentId,
        });
      }
    }
    // }
  }, [contentId, reloadAssessment]);

  const startQuiz = async () => {
    console.log("Start QUiz");
    await startQuizAssessment({
      studentRef: user?.userRef?.studentRef,
      quizRef: contentId,
    });
    getMyAssessment({
      studentRef: user?.userRef?.studentRef,
      quizRef: contentId,
    });
  };
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      console.log(selectedFile);
    }
  };

  const submitAssignment = async () => {
    if (!selectedFile) {
      alert("Select a file first");
      return;
    }
    await assignmentAssessmentSubmit({
      studentRef: user?.userRef?.studentRef,
      assignmentRef: contentId,
      document: selectedFile,
    });
    setReloadAssessment(!reloadAssessment);
  };

  const [currentModule, setCurrentModule] = useState("");

  useEffect(() => {
    console.log("currentModule ****************** ", currentModule);
  }, [currentModule]);

  return (
    <div className="mt-16">
      <div className="container mx-auto h-auto">
        <div className="grid grid-cols-12 gap-5">
          {/* left side */}
          <div className="col-span-8 bgs-red-100 overflow-y-scroll">
            {type != "assignment" && type != "quiz" && type != "content" ? (
              <div className="h-full flex justify-center items-center">
                <Typography as={"h4"}>
                  No More content in this Module
                </Typography>
              </div>
            ) : (
              <div>
                {type == "content" && (
                  <div className=" h-full text-center flex justify-center items-center border">
                    {content?.type == "video" && (
                      <ReactPlayer
                        url={content?.videoContentDetails?.videoUrl}
                        controls={true}
                        config={{
                          youtube: {
                            playerVars: { showinfo: 1 },
                          },
                          facebook: {
                            appId: "12345",
                          },
                        }}
                        // width="100%"
                        height="100%"
                        className="p-1 "
                      />
                    )}

                    {content?.type == "document" && (
                      <object
                        data={content?.documentDetails?.fileUrl}
                        type="application/pdf"
                        width="100%"
                        height="100%"
                      >
                        <p>
                          Alternative text - include a link{" "}
                          <a href={content?.documentDetails?.fileUrl}>
                            to the PDF!
                          </a>
                        </p>
                      </object>
                    )}

                    {content?.type == "text" && (
                      <ReactQuill
                        theme="snow"
                        value={content?.textContentDetails?.text}
                        className="border-none"
                        modules={{ toolbar: false }}
                        readOnly
                      />
                    )}
                  </div>
                )}

                {type == "quiz" && (
                  <div className=" h-full text-center flex justify-center items-center border">
                    {myAssessment?.isRunning ? (
                      <AnswerQuiz
                        quizRef={contentId}
                        setReloadAssessment={setReloadAssessment}
                        reloadAssessment={reloadAssessment}
                      />
                    ) : (
                      <div>
                        {myAssessment?.isTried ? (
                          <div>
                            {myAssessment?.status == "passed" ? (
                              <div>
                                <p>Passed</p>
                                <p>
                                  Marks Obtained:{myAssessment?.marksObtained}
                                </p>
                                <p>
                                  Answer Correct:{" "}
                                  {myAssessment?.percentage?.toFixed(2)} %{" "}
                                </p>
                              </div>
                            ) : (
                              <div>
                                <p>
                                  Marks Obtained:{myAssessment?.marksObtained}
                                </p>

                                <p>
                                  Quiz Duration: {myAssessment?.duration}{" "}
                                  minutes
                                </p>
                                <p>
                                  Total Question: {myAssessment?.questionCount}
                                </p>
                                <p>
                                  Pass Marks:{" "}
                                  {myAssessment?.passMarkPercentage?.toFixed(2)}{" "}
                                  %
                                </p>
                                <div>
                                  <Button onClick={() => startQuiz()}>
                                    Try Again
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            <p>
                              Quiz Duration: {myAssessment?.duration} minutes
                            </p>
                            <p>Total Question: {myAssessment?.questionCount}</p>
                            <p>
                              Pass Marks: {myAssessment?.passMarkPercentage}
                            </p>
                            <div>
                              <Button onClick={() => startQuiz()}>
                                Start Quiz
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {type == "assignment" && (
                  <div className=" h-full text-center flex justify-center items-center border">
                    {/* <div></div> */}
                    {myAssignmentAssessment?.isTried == false ? (
                      <div>
                        <p className="mb-10">{assignment?.description}</p>
                        <IconedInputBox
                          id="resume"
                          autoComplete="off"
                          name="resume"
                          type="file"
                          className=" text-base peer placeholder-transparent h-10 w-full border-b-2 border-gray-300
                                text-gray-900 focus:outline-none focus:borer-rose-600 md:ps-16 ps-10"
                          placeholder="Enter your Resume"
                          iconPosition="left"
                          labelText="Resume"
                          onInputChange={handleFileChange}
                        >
                          {" "}
                          <IoDocumentAttachOutline size={22} />
                        </IconedInputBox>
                        <Button
                          className="my-5"
                          onClick={(e) => submitAssignment()}
                        >
                          Submit
                        </Button>
                      </div>
                    ) : (
                      <div>
                        {myAssignmentAssessment?.status == "pending" && (
                          <p>Pending</p>
                        )}
                        {myAssignmentAssessment?.status == "passed" && (
                          <p>Passed</p>
                        )}
                        {myAssignmentAssessment?.status == "failed" && (
                          <div>
                            {" "}
                            <p>Failed</p> <Button>Resubmit</Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          {/* right side */}
          <div className="col-span-4 bg-gray-200 border sm:px-2  md:px-4 py-4 overflow-y-scroll">
            <CourseContent
              setSelectedContentId={setSelectedContentId}
              setSelectedContentType={setSelectedContentType}
              reloadContentStudent={reloadContentStudent}
              setCurrentModule={setCurrentModule}
            />
          </div>
        </div>
        <div className="flex justify-center">
          {type == "content" && (
            <Button
              onClick={async () => {
                await completeContent({
                  studentRef: user?.userRef?.studentRef,
                  contentRef: contentId,
                });
                // console.log("wait.................. ");
                setReloadContentStudent(!reloadContentStudent);
              }}
            >
              Next
            </Button>
          )}

          {type == "quiz" && myAssessment?.status == "passed" && (
            <Button
              onClick={async () => {
                await completeQuiz({
                  studentRef: user?.userRef?.studentRef,
                  quizRef: contentId,
                });
                // console.log("wait.................. ");
                setReloadContentStudent(!reloadContentStudent);
              }}
            >
              Next
            </Button>
          )}

          {type == "assignment" &&
            myAssignmentAssessment &&
            myAssignmentAssessment?.isTried && (
              <Button
                onClick={async () => {
                  await completeAssignment({
                    studentRef: user?.userRef?.studentRef,
                    assignmentRef: contentId,
                  });
                  // console.log("wait.................. ");
                  setReloadContentStudent(!reloadContentStudent);
                }}
                disabled={isLoadingAssignmentAssessment ? true : false}
              >
                Next
              </Button>
            )}

          {type != "assignment" && type != "quiz" && type != "content" && (
            <Button
              onClick={async () => {
                await completeModule({
                  moduleRef: currentModule,
                  studentRef: user?.userRef?.studentRef,
                });
                setReloadContentStudent(!reloadContentStudent);
              }}
              disabled={isLoadingModule ? true : false}
            >
              Complete Module
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
