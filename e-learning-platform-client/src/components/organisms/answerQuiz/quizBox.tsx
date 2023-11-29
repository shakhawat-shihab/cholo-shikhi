import React, { useEffect } from "react";
import { QuestionData } from "../../../types/quizAssessment.type";
import { Checkbox, Typography } from "@material-tailwind/react";
import useQuizAssessmentHook from "../../../hooks/quizHook/useQuizAssessmentHook";
import { useSelector } from "react-redux";

type Props = {
  question: QuestionData | undefined;
  clicked?: boolean;
};

interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
}

export default function QuizBox({ question, clicked }: Props) {
  const user = useSelector((state: any) => state.auth.userData);
  const [answer, setAnswer] = React.useState<number[]>([]);
  const { quizAssessmentMyAnswer, myAnswer, quizAssessmentQuestionAnswer } =
    useQuizAssessmentHook();
  console.log("question");

  const handleOptionSelect = (e: any) => {
    // console.log(e.target.value);
    // console.log(e.target.checked);
    console.log("answer === ", answer);
    let currentAns = answer;
    // check answer
    if (e.target.checked) {
      let index = answer.indexOf(e.target.value);
      console.log("index ", index);
      if (index == -1) {
        // this answer not exist exist add it
        console.log([...answer, parseInt(e.target.value)]);
        currentAns = [...answer, parseInt(e.target.value)];
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
        currentAns = answer;
        console.log("after splice ", answer);
        setAnswer([...answer]);
      }
    }

    if (question) {
      // console.log("answer to pushhhhhhhhhhhhhhhhhhhh -- ", currentAns);
      quizAssessmentQuestionAnswer({
        studentRef: user.userRef.studentRef,
        quizRef: question?.quizRef,
        crntQuestionRef: question?._id,
        answer: currentAns,
      });
    }
  };

  useEffect(() => {
    console.log("make answer empty");
    setAnswer([]);
  }, [clicked]);

  useEffect(() => {
    console.log("select previous answer ");
    if (question?.userAns) {
      setAnswer(question?.userAns);
    } else {
      setAnswer([]);
    }
  }, [question]);

  // calculate time
  const calculateTimeRemaining = (endTime: string | undefined) => {
    console.log(endTime);
    if (!endTime) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }
    const now: Date = new Date();
    const time: Date = new Date(endTime);
    const difference = time.getTime() - now.getTime();
    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }
    const seconds = Math.floor((difference / 1000) % 60);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const hours = Math.floor((difference / 1000 / 60 / 60) % 24);

    return { hours, minutes, seconds };
  };

  const [timeRemaining, setTimeRemaining] = React.useState<TimeRemaining>(
    calculateTimeRemaining(question?.endTime)
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(question?.endTime));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [question?.endTime]); // Empty dependency array ensures the effect runs only once when the component mounts

  const { hours, minutes, seconds } = timeRemaining;

  console.log(" question?.endTime", question?.endTime);

  return (
    <div className="w-full mx-auto bg-white p-8 rounded-md shadow-md">
      <div className="flex justify-end">
        <p>
          Time remain {hours}:{minutes}:{seconds}
        </p>
      </div>
      {question ? (
        <div className="w-full h-full">
          <h2 className="text-2xl font-bold mb-4">Quiz</h2>
          <p className="mb-6">{question?.question}</p>

          <div className="space-y-2">
            {question?.options?.map((x: any, index) => (
              <Typography
                as={"p"}
                key={`${question?._id}_${index}`}
                className="text-gray-700 mb-3 flex items-center"
              >
                <Checkbox
                  crossOrigin="ok"
                  onChange={(e: any) => handleOptionSelect(e)}
                  value={index}
                  //   defaultChecked={
                  //     // answer?.includes(index) ? true : false
                  //     myAnswer?.submittedAns?.includes(index) ? true : false
                  //   }
                  defaultChecked={
                    question?.userAns?.includes(index) ? true : false
                  }
                />
                {x}
                {console.log("re render")}
              </Typography>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <h2 className="text-red-600">Quiz Finished</h2>
        </div>
      )}
    </div>
  );
}
