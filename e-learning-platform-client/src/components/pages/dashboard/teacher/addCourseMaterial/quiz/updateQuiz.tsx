import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useQuizHook from "../../../../../../hooks/quiz/useQuizHook";
import { Card, Typography } from "@material-tailwind/react";
import { Quiz } from "../../../../../../types/quiz.type";

type Props = {};

export default function UpdateQuiz({}: Props) {
  const user = useSelector((state: any) => state.auth.userData);
  const { courseId } = useParams();

  const { loadAllQuizzes, quizzes } = useQuizHook();

  useEffect(() => {
    courseId &&
      loadAllQuizzes({
        courseRef: courseId,
        teacherRef: user?.userRef?.teacherRef,
      });
  }, [courseId]);

  console.log("quizzes -- ", quizzes);

  let tableHead = [
    "Title",
    "Questions",
    "Duration",
    "Edit",
    "Delete",
    "Add Question",
  ];
  return (
    <div>
      <div className="">
        <Card className="h-full w-full overflow-scroll">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {tableHead.map((head) => (
                  <th
                    key={head}
                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {quizzes?.map((val: Quiz, index: number) => {
                const isLast = index === quizzes?.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={val?.title}>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {val?.title}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {val?.questionsRef?.length}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {val?.durationInMinute}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        Edit
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        as="a"
                        href="#"
                        variant="small"
                        color="blue-gray"
                        className="font-medium"
                      >
                        Delete
                      </Typography>
                    </td>

                    <td className={classes}>
                      <Link
                        to={`/teacher/dashboard/manage-question/${val?._id}`}
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-medium"
                        >
                          Add Question
                        </Typography>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
