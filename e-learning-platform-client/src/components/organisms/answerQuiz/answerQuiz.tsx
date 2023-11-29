import React, { useState } from "react";
import { useSelector } from "react-redux";
import useQuizAssessmentHook from "../../../hooks/quizHook/useQuizAssessmentHook";
import QuizBox from "./quizBox";
import { Button } from "@material-tailwind/react";

type Props = {
  quizRef: string;
  setReloadAssessment: React.Dispatch<React.SetStateAction<boolean>>;
  reloadAssessment: boolean;
};

export default function AnswerQuiz({
  quizRef,
  reloadAssessment,
  setReloadAssessment,
}: Props) {
  const user = useSelector((state: any) => state.auth.userData);
  const { quizAssessmentChangeQuestion, question, quizAssessmentSubmit } =
    useQuizAssessmentHook();
  const [operation, setOperation] = useState("");
  const [clicked, setClicked] = useState(false);

  const submitQuiz = async () => {
    await quizAssessmentSubmit({
      studentRef: user.userRef.studentRef,
      quizRef: quizRef,
    });
    setReloadAssessment(!reloadAssessment);
  };

  React.useEffect(() => {
    quizAssessmentChangeQuestion({
      studentRef: user.userRef.studentRef,
      quizRef: quizRef,
    });
    if (operation && question) {
      quizAssessmentChangeQuestion({
        studentRef: user.userRef.studentRef,
        quizRef: quizRef,
        crntQuestionRef: question?._id,
        operation: operation,
      });
    }
  }, [quizRef, operation, clicked]);

  // console.log("loaded question === ", question);

  return (
    <div className="w-full h-full">
      <QuizBox question={question} clicked={clicked} />
      <div className="flex justify-center mt-4">
        <Button
          onClick={() => {
            setOperation("previous");
            setClicked(!clicked);
          }}
          disabled={question?.previousExist ? false : true}
        >
          Previous
        </Button>
        <Button
          onClick={() => {
            setOperation("next");
            setClicked(!clicked);
          }}
          className="ms-5"
          disabled={question?.nextExist ? false : true}
        >
          Next
        </Button>
      </div>
      <div className="mt-4">
        <Button
          onClick={() => {
            submitQuiz();
          }}
          className="ms-3"
        >
          Submit Quiz
        </Button>
      </div>
    </div>
  );
}
