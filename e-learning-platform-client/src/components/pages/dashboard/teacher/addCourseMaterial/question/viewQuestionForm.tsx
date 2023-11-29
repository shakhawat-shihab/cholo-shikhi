import {
  Button,
  Checkbox,
  Dialog,
  DialogBody,
  DialogHeader,
  Typography,
} from "@material-tailwind/react";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Span from "../../../../../atoms/paragraph/span";
import InputBox from "../../../../../atoms/input/inputBox";
import InputSubmit from "../../../../../atoms/input/inputSubmit";
import useQuestionHook from "../../../../../../hooks/question/useQuestionHook";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { QuestionCreate } from "../../../../../../types/question.type";
import { Question } from "../../../../../../types/quiz.type";

type Props = {
  viewQuestion: boolean;
  operation: string;
  handleFormOpen: () => void;
  quizData?: Question;
  setReloadQuestions: React.Dispatch<React.SetStateAction<boolean>>;
  reloadQuestions: boolean;
};

export default function ViewQuestionForm({
  viewQuestion = false,
  operation,
  handleFormOpen,
  quizData,
  setReloadQuestions,
  reloadQuestions,
}: Props) {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      question: "",
      teacherRef: "",
      quizRef: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
    },
  });

  const user = useSelector((state: any) => state.auth.userData);
  const { quizId } = useParams();
  const { isLoadingQuestion, createQuestion, updateQuestion } =
    useQuestionHook();
  const [answer, setAnswer] = useState<number[]>([]);

  const handleCreateQuestion = (data: any) => {
    if (!answer?.length) {
      alert("No answer is selected as answer");
      return;
    }
    // console.log("data  ==== ", data);

    let obj: QuestionCreate = {
      question: getValues("question").trim(),
      options: [],
      correctAns: answer,
      teacherRef: user?.userRef?.teacherRef,
      quizRef: quizId,
    };
    let arrOptions: string[] = [];
    getValues("option1")?.trim() && arrOptions.push(getValues("option1"));
    getValues("option2")?.trim() && arrOptions.push(getValues("option2"));
    getValues("option3")?.trim() && arrOptions.push(getValues("option3"));
    getValues("option4")?.trim() && arrOptions.push(getValues("option4"));
    obj.options = arrOptions;

    // console.log("obj  -   ---------- ", obj);

    setAnswer([]);
    if (operation == "create") {
      createQuestion(obj);
    } else if (operation == "update") {
      updateQuestion({ ...obj, _id: quizData?._id });
    }

    setReloadQuestions(!reloadQuestions);
    handleFormOpen();
  };

  const handleOptionSelect = (e: any) => {
    console.log(e.target.value);
    console.log(e.target.checked);
    console.log("answer === ", answer);
    // check answer
    if (e.target.checked) {
      let index = answer.indexOf(e.target.value);
      console.log("index ", index);
      if (index == -1) {
        // this answer not exist exist add it
        console.log([...answer, parseInt(e.target.value)]);
        setAnswer([...answer, parseInt(e.target.value)]);
      }
    }
    // uncheck answer
    else {
      let index = answer.indexOf(parseInt(e.target.value));
      console.log("index un ", index);
      if (index != -1) {
        // if answer exis, remove it
        answer.splice(index, 1);
        console.log("after splice ", answer);
        setAnswer([...answer]);
      }
    }
    // console.log("answer -- ", answer);
  };

  // if operation is update, then get previous value
  React.useEffect(() => {
    if (operation == "update") {
      quizData?.question && setValue("question", quizData?.question);
      quizData?.options?.[0] && setValue("option1", quizData?.options?.[0]);
      quizData?.options?.[1] && setValue("option2", quizData?.options?.[1]);
      quizData?.options?.[2] && setValue("option3", quizData?.options?.[2]);
      quizData?.options?.[3] && setValue("option4", quizData?.options?.[3]);
      quizData?.correctAns && setAnswer(quizData?.correctAns);
    }
  }, [operation, quizData]);

  return (
    <div>
      <Dialog
        open={viewQuestion}
        handler={handleFormOpen}
        className="opacity-40 min-h-sm"
      >
        <DialogHeader>
          <Button onClick={handleFormOpen}>Close</Button>
        </DialogHeader>
        <DialogBody className="h-[25rem] overflow-y-scroll">
          <div>
            <form
              className=" h-full gap-3 max-w-3xl justify-between "
              onSubmit={handleSubmit(handleCreateQuestion)}
              autoComplete="off"
            >
              {/* Question */}
              <div className="mb-4 w-full">
                <Typography as={"p"} className="text-gray-700 mb-3">
                  Question
                </Typography>
                <Controller
                  name="question"
                  control={control}
                  rules={{
                    required: "question must be provided",
                  }}
                  render={({ field }) => (
                    <InputBox
                      type="text"
                      field={field}
                      className="w-full border border-gray-400 py-2 px-2 text-gray-700 text-base"
                    />
                  )}
                />
                <Span
                  className={`${
                    errors?.question?.message ? "visible" : "invisible"
                  } text-red-600 `}
                >
                  *{errors?.question?.message}
                </Span>
              </div>

              {/* option 1 */}
              <div className="mb-4 w-full">
                <Typography
                  as={"p"}
                  className="text-gray-700 mb-3 flex items-center"
                >
                  Option 1
                  <Checkbox
                    crossOrigin={true}
                    onChange={(e: any) => handleOptionSelect(e)}
                    value={0}
                    defaultChecked={
                      operation == "update" && quizData?.correctAns?.includes(0)
                        ? true
                        : false
                    }
                  />
                </Typography>
                <Controller
                  name="option1"
                  control={control}
                  rules={{
                    required: "option1 must be provided",
                  }}
                  render={({ field }) => (
                    <InputBox
                      type="text"
                      field={field}
                      className="w-full border border-gray-400 py-2 px-2 text-gray-700 text-base"
                    />
                  )}
                />
                <Span
                  className={`${
                    errors?.option1?.message ? "visible" : "invisible"
                  } text-red-600 `}
                >
                  *{errors?.option1?.message}
                </Span>
              </div>

              {/* option 2 */}
              <div className="mb-4 w-full">
                <Typography as={"p"} className="text-gray-700 mb-3">
                  Option 2
                  <Checkbox
                    crossOrigin={true}
                    onChange={(e: any) => handleOptionSelect(e)}
                    value={1}
                    defaultChecked={
                      operation == "update" && quizData?.correctAns?.includes(1)
                        ? true
                        : false
                    }
                  />
                </Typography>
                <Controller
                  name="option2"
                  control={control}
                  rules={{
                    required: "option must be provided",
                  }}
                  render={({ field }) => (
                    <InputBox
                      type="text"
                      field={field}
                      className="w-full border border-gray-400 py-2 px-2 text-gray-700 text-base"
                    />
                  )}
                />
                <Span
                  className={`${
                    errors?.option2?.message ? "visible" : "invisible"
                  } text-red-600 `}
                >
                  *{errors?.option2?.message}
                </Span>
              </div>

              {/* option 3*/}
              <div className="mb-4 w-full">
                <Typography as={"p"} className="text-gray-700 mb-3">
                  Option 3
                  <Checkbox
                    crossOrigin={true}
                    onChange={(e: any) => handleOptionSelect(e)}
                    value={2}
                    defaultChecked={
                      operation == "update" && quizData?.correctAns?.includes(2)
                        ? true
                        : false
                    }
                  />
                </Typography>
                <Controller
                  name="option3"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <InputBox
                      type="text"
                      field={field}
                      className="w-full border border-gray-400 py-2 px-2 text-gray-700 text-base"
                    />
                  )}
                />
                <Span
                  className={`${
                    errors?.option3?.message ? "visible" : "invisible"
                  } text-red-600 `}
                >
                  *{errors?.option3?.message}
                </Span>
              </div>

              {/* option 4 */}
              <div className="mb-4 w-full">
                <Typography as={"p"} className="text-gray-700 mb-3">
                  Option 4
                  <Checkbox
                    crossOrigin={true}
                    onChange={(e: any) => handleOptionSelect(e)}
                    value={3}
                    defaultChecked={
                      operation == "update" && quizData?.correctAns?.includes(3)
                        ? true
                        : false
                    }
                  />
                </Typography>
                <Controller
                  name="option4"
                  control={control}
                  rules={{
                    required: "option 4 must be provided",
                  }}
                  render={({ field }) => (
                    <InputBox
                      type="text"
                      field={field}
                      className="w-full border border-gray-400 py-2 px-2 text-gray-700 text-base"
                    />
                  )}
                />
                <Span
                  className={`${
                    errors?.option2?.message ? "visible" : "invisible"
                  } text-red-600 `}
                >
                  *{errors?.option2?.message}
                </Span>
              </div>

              <div className="w-full flex justify-center">
                {isLoadingQuestion ? (
                  <InputSubmit
                    value="Loading.."
                    disabled={true}
                    className=" px-4 py-2 bg-indigo-500 rounded-md font-semibold text-white text-lg disabled:bg-gray-500"
                  />
                ) : (
                  <InputSubmit
                    value={`${operation == "update" ? "Update" : "Create"}`}
                    className=" px-4 py-2 bg-indigo-500 rounded-md font-semibold text-white text-lg disabled:bg-gray-500"
                  />
                )}
              </div>
            </form>
          </div>
        </DialogBody>
      </Dialog>
    </div>
  );
}
