import React from "react";
import useAssignmentAssessmentHook from "../../../../../../hooks/assignmentAssessmentHook/useAssignmentAssessmentHook";
import useAssignmentHook from "../../../../../../hooks/assignment/useAssignmentHook";
import IconedInputSelect from "../../../../../molecules/iconedInput/iconedInputSelect";
import { RiShieldUserLine } from "react-icons/ri";
import { useParams } from "react-router-dom";
import InputSubmit from "../../../../../atoms/input/inputSubmit";
import { Controller, useForm } from "react-hook-form";
import { Typography } from "@material-tailwind/react";
import InputSelect from "../../../../../atoms/input/inputSelect";
import Span from "../../../../../atoms/paragraph/span";
import { useSelector } from "react-redux";
import Img from "../../../../../atoms/image/img";
import { PendingAssignment } from "../../../../../../types/assignmentAssessment";
import helperFunction from "../../../../../../utils/helper";
import userImg from "../../../../../../assets/images/user.png";
import AssigMarkModal from "./assigMarkModal";

type Props = {};

export default function AssignMarks({}: Props) {
  const user = useSelector((state: any) => state?.auth?.userData);
  const { getAllAssignmentByCourseId, assignmentBasic, isLoadingAssignment } =
    useAssignmentHook();
  const { getAssessmentByTeacher, pendingAssignment } =
    useAssignmentAssessmentHook();
  const { courseId } = useParams();

  //   console.log("assignmentBasic----", assignmentBasic);

  React.useEffect(() => {
    if (courseId) getAllAssignmentByCourseId(courseId);
  }, [courseId]);

  React.useEffect(() => {
    if (assignmentBasic) {
    }
  }, [assignmentBasic]);

  const handleSetCourse = async (data: any) => {
    const assignmentRef = getValues("assignmentRef");
    if (assignmentRef) {
      await getAssessmentByTeacher({
        teacherRef: user?.userRef?.teacherRef,
        assignmentRef: assignmentRef,
      });
    }
  };
  const [viewContent, setViewContent] = React.useState(false);

  const handleContentOpen = () => {
    setViewContent(!viewContent);
  };

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    getValues,
    setValue,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      assignmentRef: "",
    },
  });

  const { formatTimeDate } = helperFunction();

  const [currentAssignment, setCurrentAssignment] = React.useState<
    PendingAssignment | undefined
  >(undefined);

  return (
    <div className=" h-full  flex ">
      <AssigMarkModal
        handleContentOpen={handleContentOpen}
        viewContent={viewContent}
        currentAssignment={currentAssignment}
      />
      <div className=" bg-white w-full p-2 sm:p-8 md:p-10 shadow-lg rounded-md my-2">
        <h2 className="pb-8 text-3xl text-center "> Assign Mark </h2>
        <form
          className=" flex flex-wrap gap-3 max-w-3xl justify-between "
          onSubmit={handleSubmit(handleSetCourse)}
          autoComplete="off"
        >
          <div className="mb-4 w-full ">
            <Typography as={"p"} className="text-gray-700 mb-3">
              Select Assignment
            </Typography>
            <Controller
              name="assignmentRef"
              control={control}
              rules={{
                required: "category must be provided",
              }}
              render={({ field }) => (
                <InputSelect
                  className="w-full text-center border border-gray-400 rounded ms-0 bg-inherit px-4 py-2 "
                  type="select"
                  options={assignmentBasic}
                  field={field}
                  defaultOption="Please select category"
                />
              )}
            />
            <Span
              className={`${
                errors?.assignmentRef?.message ? "visible" : "invisible"
              } text-red-600 `}
            >
              *{errors?.assignmentRef?.message}
            </Span>
          </div>

          <div className="w-full text-center">
            {isLoadingAssignment ? (
              <InputSubmit
                value="Loading.."
                disabled={true}
                className=" px-4 py-2 bg-indigo-500 rounded-md font-semibold text-white text-lg disabled:bg-gray-500"
              />
            ) : (
              <InputSubmit
                value="Find Assignments"
                className=" px-4 py-2 bg-indigo-500 rounded-md font-semibold text-white text-lg disabled:bg-gray-500"
              />
            )}
          </div>
        </form>
        <div className="mt-8">
          {pendingAssignment?.map((x: PendingAssignment) => (
            <div
              key={x?._id}
              className="shadow-xl mt-4 rounded border border-black px-2 py-4 my-3"
            >
              <div className="flex items-center justify-between p-2">
                <div className="flex justify-between items-center">
                  <div>
                    <Img
                      src={x?.studentImage ? x?.studentImage : userImg}
                      style={{ height: "50px", width: "50px" }}
                    />
                    <div className="ms-4">
                      <p className="capitalize  fw-bold text-xl">
                        {x.studentUserName}
                      </p>
                      <p className="text-xs">{formatTimeDate(x.endTime)}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
                    <a
                      href={x.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  </button>
                  <button
                    className="bg-gray-900 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded ms-3"
                    onClick={() => {
                      handleContentOpen();
                      setCurrentAssignment(x);
                    }}
                  >
                    Give Mark
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
