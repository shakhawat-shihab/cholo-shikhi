import { Button, Spinner } from "@material-tailwind/react";
import React, { useEffect } from "react";
import ViewQuestionForm from "./viewQuestionForm";
import useQuizHook from "../../../../../../hooks/quiz/useQuizHook";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import FullScreenMessage from "../../../../../organisms/fullScreenMessage/fullScreenMessage";
import { Question } from "../../../../../../types/quiz.type";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

type Props = {};

export default function CreateQuestion({}: Props) {
  const { quizId } = useParams();
  const [operation, setOperation] = React.useState("create");
  const [quizData, setQuizData] = React.useState<Question | undefined>(
    undefined
  );
  const [viewQuestion, setViewQuestion] = React.useState(false);
  const [reloadQuestions, setReloadQuestions] = React.useState(false);
  const user = useSelector((state: any) => state.auth.userData);
  const handleFormOpen = () => {
    setViewQuestion(!viewQuestion);
  };
  const { loadQuizByIdTeacher, quizDetials, isLoadingQuiz } = useQuizHook();

  useEffect(() => {
    // console.log("@@@@@@@@@@@@@ get quiz details @@@@@@@@@@@@@@@@@");
    if (quizId) {
      loadQuizByIdTeacher({
        teacherRef: user?.userRef?.teacherRef,
        quizRef: quizId,
      });
    }
  }, [reloadQuestions]);

  // console.log("quizDetials ", quizDetials);

  return (
    <div>
      {viewQuestion && (
        <ViewQuestionForm
          viewQuestion={viewQuestion}
          handleFormOpen={handleFormOpen}
          quizData={quizData}
          operation={operation}
          setReloadQuestions={setReloadQuestions}
          reloadQuestions={reloadQuestions}
        />
      )}
      <div className=" flex justify-center items-center  ">
        <div className=" bg-white w-full p-2 sm:p-8 md:p-10  shadow-lg rounded-md my-2">
          <div className="py-3">
            <h2 className="pb-8 text-3xl text-center "> Create Question </h2>
            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={() => {
                  setViewQuestion(!viewQuestion);
                  setOperation("create");
                }}
              >
                Create Question
              </Button>
            </div>

            <div className="flex  my-5 ">
              {isLoadingQuiz ? (
                <Spinner />
              ) : (
                <div className="w-full">
                  {quizDetials?.questions?.length ? (
                    <div className="w-full">
                      {/* {quizDetials?.questions.map((question: Question) => (
                        <div>{question?.question}</div>
                      ))} */}

                      {quizDetials.questions.map((question, index) => (
                        <div
                          key={question._id}
                          className="mb-8 bg-gray-400 rounded-lg w-full py-4 ps-4 pe-3"
                        >
                          <div className="flex justify-end">
                            <div className="flex">
                              <FaEdit
                                className="cursor-pointer"
                                size={22}
                                onClick={() => {
                                  setViewQuestion(!viewQuestion);
                                  setQuizData(question);
                                  setOperation("update");
                                }}
                              />
                              <FaTrashAlt
                                size={22}
                                className="ms-3 cursor-pointer"
                              />
                            </div>
                          </div>
                          {/* Question Text */}
                          <h2 className="text-lg font-semibold mb-4">
                            {index + 1}. {question.question}
                          </h2>

                          {/* Options */}
                          <ul className="list-disc pl-6">
                            {/* Loop through each option in the question */}
                            {question.options.map((option, optionIndex) => (
                              <li key={optionIndex}>
                                {/* Apply different styles for correct and incorrect options */}
                                {question.correctAns.includes(optionIndex) ? (
                                  <span className="text-green-500 font-semibold">
                                    {option}
                                  </span>
                                ) : (
                                  <span>{option}</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <FullScreenMessage message="No Question Found" />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
