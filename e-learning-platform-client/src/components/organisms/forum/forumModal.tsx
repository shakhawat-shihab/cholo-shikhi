import { Dispatch } from "@reduxjs/toolkit";
import React from "react";
import Button from "../../atoms/button/button";
import {
  Dialog,
  DialogBody,
  DialogHeader,
  IconButton,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import InputBox from "../../atoms/input/inputBox";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import Span from "../../atoms/paragraph/span";
import TextBox from "../../atoms/input/TextBox";
import { IoCloseSharp } from "react-icons/io5";
import useForumHook from "../../../hooks/forum/useForumHook";
import { useParams } from "react-router-dom";
import InputSubmit from "../../atoms/input/inputSubmit";

type Props = {
  showForum: true;
  handleForumOpen: () => void;
  questionId: string;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  reload: boolean;
};

export default function ForumModal({
  showForum,
  handleForumOpen,
  questionId,
  setReload,
  reload,
}: Props) {
  const user = useSelector((state: any) => state.auth.userData);
  const { courseId } = useParams();
  const { isLoadingForum, replyToQuestion } = useForumHook();

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
      answer: "",
    },
  });

  const handleSubmitReply = async (data: any) => {
    let answer = getValues("answer");
    if (questionId && user?.userRef?._id)
      await replyToQuestion({
        answer: answer,
        questionRef: questionId,
        courseRef: courseId,
        userRef: user?.userRef?._id,
      });
    console.log("==== ", answer, user?.userRef?._id, questionId, courseId);
    setReload(!reload);
    handleForumOpen();
  };

  return (
    <div>
      <Dialog
        open={showForum}
        handler={handleForumOpen}
        className="opacity-40 "
      >
        <DialogHeader className="flex justify-end">
          <div className="">
            <IconButton onClick={handleForumOpen} className="p-0">
              <IoCloseSharp size={25} className="" />
            </IconButton>
          </div>
        </DialogHeader>
        <DialogBody className="h-full">
          <form
            className=" flex flex-wrap gap-3 max-w-3xl justify-between "
            onSubmit={handleSubmit(handleSubmitReply)}
            autoComplete="off"
          >
            <div className="mb-4 w-full ">
              {/* <Typography as={"p"} className="text-gray-700 mb-3">
                Select Assignment
              </Typography> */}
              <Controller
                name="answer"
                control={control}
                rules={{
                  required: "answer must be provided",
                }}
                render={({ field }) => (
                  <TextBox
                    type="text"
                    className="w-full text-center border border-gray-400 rounded ms-0 bg-inherit px-4 py-2 "
                    field={field}
                  />
                )}
              />
              <Span
                className={`${
                  errors?.answer?.message ? "visible" : "invisible"
                } text-red-600 `}
              >
                *{errors?.answer?.message}
              </Span>
            </div>

            <div className="w-full text-center">
              {isLoadingForum ? (
                <InputSubmit
                  value="Loading.."
                  disabled={true}
                  className=" px-4 py-2 bg-indigo-500 rounded-md font-semibold text-white text-lg disabled:bg-gray-500"
                />
              ) : (
                <InputSubmit
                  value="Reply"
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
