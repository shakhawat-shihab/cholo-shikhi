import {
  Dialog,
  DialogBody,
  DialogHeader,
  Typography,
} from "@material-tailwind/react";
import React from "react";
import Button from "../../../../../atoms/button/button";
import InputBox from "../../../../../atoms/input/inputBox";
import Span from "../../../../../atoms/paragraph/span";
import { Controller, useForm } from "react-hook-form";
import InputSubmit from "../../../../../atoms/input/inputSubmit";
import useAssignmentAssessmentHook from "../../../../../../hooks/assignmentAssessmentHook/useAssignmentAssessmentHook";
import { useSelector } from "react-redux";
import { PendingAssignment } from "../../../../../../types/assignmentAssessment";

type Props = {
  viewContent?: boolean;
  handleContentOpen: () => void;
  currentAssignment: PendingAssignment | undefined;
};

export default function AssigMarkModal({
  viewContent,
  handleContentOpen,
  currentAssignment,
}: Props) {
  const user = useSelector((state: any) => state.auth.userData);
  const { assignMarks, isLoadingAssignmentAssessment } =
    useAssignmentAssessmentHook();
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
      assignmentMark: "",
    },
  });

  // marks assign korte hobe

  const handleAssignMarks = (data: any) => {
    // console.log("hereeeeeeeeeeee ", currentAssignment);
    let marks = getValues("assignmentMark");
    if (currentAssignment && currentAssignment?.studentId && marks)
      assignMarks({
        teacherRef: user?.userRef?.teacherRef,
        studentRef: currentAssignment?.studentId,
        assignmentRef: currentAssignment?._id,
        marks: marks,
      });
  };
  return (
    <div>
      <Dialog
        open={viewContent}
        handler={handleContentOpen}
        className="opacity-40 "
      >
        <DialogHeader>
          <Button onClick={handleContentOpen}>Close</Button>
        </DialogHeader>
        <DialogBody className="h-full">
          {/* <h2></h2> */}
          <form
            className=" flex flex-wrap gap-3 max-w-3xl justify-between "
            onSubmit={handleSubmit(handleAssignMarks)}
            autoComplete="off"
          >
            <div className="mb-4 w-full ">
              <Typography as={"p"} className="text-gray-700 mb-3">
                Select Assignment
              </Typography>
              <Controller
                name="assignmentMark"
                control={control}
                rules={{
                  required: "category must be provided",
                }}
                render={({ field }) => (
                  <InputBox
                    className="w-full text-center border border-gray-400 rounded ms-0 bg-inherit px-4 py-2 "
                    type="select"
                    field={field}
                  />
                )}
              />
              <Span
                className={`${
                  errors?.assignmentMark?.message ? "visible" : "invisible"
                } text-red-600 `}
              >
                *{errors?.assignmentMark?.message}
              </Span>
            </div>

            <div className="w-full text-center">
              {isLoadingAssignmentAssessment ? (
                <InputSubmit
                  value="Loading.."
                  disabled={true}
                  className=" px-4 py-2 bg-indigo-500 rounded-md font-semibold text-white text-lg disabled:bg-gray-500"
                />
              ) : (
                <InputSubmit
                  value="Submit Mark"
                  className=" px-4 py-2 bg-indigo-500 rounded-md font-semibold text-white text-lg disabled:bg-gray-500"
                />
              )}
            </div>
          </form>
        </DialogBody>
      </Dialog>
    </div>
  );
}
