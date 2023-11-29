import React from "react";
import useForumHook from "../../../hooks/forum/useForumHook";
import { useParams } from "react-router-dom";
import { Textarea, Typography } from "@material-tailwind/react";
import userImg from "../../../assets/images/user.png";
import Img from "../../atoms/image/img";
import helperFunction from "../../../utils/helper";
import ForumModal from "./forumModal";
import InputSubmit from "../../atoms/input/inputSubmit";
import { Controller, useForm } from "react-hook-form";
import TextBox from "../../atoms/input/TextBox";
import Span from "../../atoms/paragraph/span";
import { useSelector } from "react-redux";

type Props = {};

export default function Forum({}: Props) {
  const [reload, setReload] = React.useState(false);
  const [showForum, setShowForum] = React.useState(false);
  const [questionId, setQuestionId] = React.useState("");

  const { courseId } = useParams();
  const { loadForumByCourse, forum, isLoadingForum, askQuestion } =
    useForumHook();
  const user = useSelector((state: any) => state.auth.userData);
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
      question: "",
    },
  });

  React.useEffect(() => {
    if (courseId) {
      // console.log("@@refetching data@@@");
      loadForumByCourse(courseId);
    }
  }, [reload]);
  const { formatTimeDate } = helperFunction();

  const handleForumOpen = () => {
    setShowForum(!showForum);
  };

  const handleSubmitQuestion = async () => {
    let question = getValues("question");
    console.log("question ", question);
    await askQuestion({
      question: question,
      courseRef: courseId,
      userRef: user?.userRef?._id,
    });
    setValue("question", "");
    setReload(!reload);
  };

  //   console.log("forum        ------------------ ", forum);
  return (
    <div className="">
      {showForum && (
        <ForumModal
          showForum={showForum}
          handleForumOpen={handleForumOpen}
          questionId={questionId}
          setReload={setReload}
          reload={reload}
        />
      )}
      <div className="my-3">
        <form
          className=" flex flex-wrap gap-3 max-w-3xl justify-between "
          onSubmit={handleSubmit(handleSubmitQuestion)}
          autoComplete="off"
        >
          <div className=" w-full mx-2">
            {/* <Typography as={"p"} className="text-gray-700 mb-3">
                Select Assignment
              </Typography> */}
            <Controller
              name="question"
              control={control}
              rules={{
                required: "question must be provided",
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
                errors?.question?.message ? "visible" : "invisible"
              } text-red-600 `}
            >
              *{errors?.question?.message}
            </Span>
          </div>

          <div className="w-full text-center">
            {isLoadingForum ? (
              <InputSubmit
                value="Loading.."
                disabled={true}
                className=" px-4 py-2 bg-indigo-500 rounded-md font-semibold text-white text-basic disabled:bg-gray-500"
              />
            ) : (
              <InputSubmit
                value="Ask Now"
                className=" px-4 py-2 bg-indigo-500 rounded-md font-semibold text-white text-basic disabled:bg-gray-500"
              />
            )}
          </div>
        </form>
      </div>
      <div className="">
        {forum?.map((x: any) => (
          <div className="ms-3 border-s border-gray-900">
            <div className="border p-3">
              <div>
                <div className="flex items-center">
                  <Img
                    src={x?.userImage ? x?.userImage : userImg}
                    style={{ height: "30px", width: "30px" }}
                    className="rounded-full border me-3"
                  />
                  <div>
                    <p className="text-sm text-black capitalize">
                      {x?.userName}
                    </p>
                    <p className="text-xs">
                      {x?.createdAt && formatTimeDate(x?.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
              <Typography as={"h4"} className="my-4 ms-3 font-bold">
                {x?.question}
              </Typography>
              <div className="flex justify-en mb-3">
                <p
                  className="underline text-sm cursor-pointer"
                  onClick={() => {
                    setQuestionId(x?._id);
                    handleForumOpen();
                  }}
                >
                  Reply
                </p>
              </div>
              {/* <div> */}
              <div className="ms-4">
                {x?.answer?.length &&
                  x?.answer?.map((answer: any) => (
                    <div>
                      {Object.keys(answer).length ? (
                        <div className="ms-3 border-s border-gray-900">
                          <div className="flex items-center">
                            <Img
                              src={
                                answer?.userImage ? answer?.userImage : userImg
                              }
                              style={{ height: "30px", width: "30px" }}
                              className="rounded-full border me-3"
                            />
                            <div>
                              <p className="text-sm text-black capitalize">
                                {answer?.userName}
                              </p>
                              <p className="text-xs">
                                {answer?.replyTime &&
                                  formatTimeDate(answer?.replyTime)}
                              </p>
                            </div>
                          </div>
                          <Typography as={"p"} className="my-4 ms-3 text-sm">
                            {answer?.answer}
                          </Typography>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  ))}
              </div>
              {/* </div> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
