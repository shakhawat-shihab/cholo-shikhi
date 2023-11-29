import React, { useEffect, useState } from "react";
import useModuleHook from "../../../../../../hooks/module/useModuleHook";
import { useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import Span from "../../../../../atoms/paragraph/span";
import InputSubmit from "../../../../../atoms/input/inputSubmit";
import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography,
} from "@material-tailwind/react";
import InputSelect from "../../../../../atoms/input/inputSelect";
import { quizCreate } from "../../../../../../types/quiz.type";
import { useParams } from "react-router-dom";
import InputBox from "../../../../../atoms/input/inputBox";
import { Module } from "../../../../../../types/module.type";
import useQuizHook from "../../../../../../hooks/quiz/useQuizHook";
import UpdateQuiz from "./updateQuiz";

type Props = {};

export default function CreateQuiz({}: Props) {
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = React.useState(1);
  const user = useSelector((state: any) => state?.auth?.userData);
  const { isLoadingModule, loadModuleWithoutDetail, modules } = useModuleHook();
  const { isSuccess, isLoadingQuiz, createQuiz } = useQuizHook();
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm<quizCreate>({
    mode: "onChange",
    defaultValues: {
      title: "",
      moduleRef: "",
      teacherRef: "",
      courseRef: "",
      passMarkPercentage: 70,
      durationInMinute: 20,
    },
  });
  const [moduleOptions, setModuleOptions] = useState<{
    title: string;
    _id: string;
  } | null>(null);
  useEffect(() => {
    if (modules) {
      console.log("modules ", modules);
      let module = modules?.map((x: Module) => {
        return { title: x?.title, _id: x?._id };
      });
      setModuleOptions(module);
    }
  }, [modules]);

  useEffect(() => {
    courseId &&
      loadModuleWithoutDetail({
        courseId,
        teacherRef: user?.userRef?.teacherRef,
      });
  }, []);

  const handleCreateQuiz = async (data: any) => {
    if (courseId) {
      const obj: quizCreate = {
        title: getValues("title"),
        passMarkPercentage: getValues("passMarkPercentage"),
        durationInMinute: getValues("durationInMinute"),
        teacherRef: user?.userRef?.teacherRef,
        courseRef: courseId,
        moduleRef: getValues("moduleRef"),
      };

      console.log("obj ------------- ", obj);

      await createQuiz(obj);

      if (isSuccess) {
        setValue("title", "");
        setValue("passMarkPercentage", 70);
        setValue("durationInMinute", 20);
        setValue("moduleRef", "");
      }
    }
  };
  return (
    <div className=" flex justify-center items-center  ">
      <div className=" bg-white w-full p-2 sm:p-8 md:p-10  shadow-lg rounded-md my-2">
        <div className="py-3">
          <Tabs value={activeTab}>
            <TabsHeader
              className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
              indicatorProps={{
                className:
                  "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
              }}
            >
              <Tab
                key={1}
                value={1}
                onClick={() => setActiveTab(1)}
                className={activeTab === 1 ? "text-gray-900" : ""}
              >
                Create Quiz
              </Tab>
              <Tab
                key={2}
                value={2}
                onClick={() => setActiveTab(2)}
                className={activeTab === 2 ? "text-gray-900" : ""}
              >
                Update Quiz
              </Tab>
            </TabsHeader>
            <TabsBody>
              <TabPanel key={1} value={1}>
                <div className="flex justify-center my-5">
                  <form
                    className=" flex flex-wrap gap-3 max-w-3xl justify-between "
                    onSubmit={handleSubmit(handleCreateQuiz)}
                    autoComplete="off"
                  >
                    {/* moduleRef */}
                    <div className="mb-8 w-full">
                      <Typography as={"p"} className="text-gray-700 mb-3">
                        Module
                      </Typography>
                      <Controller
                        name="moduleRef"
                        control={control}
                        rules={{
                          required: "module must be provided",
                        }}
                        render={({ field }) => (
                          <InputSelect
                            className="w-full text-center border border-gray-400 rounded ms-0 bg-inherit px-4 py-2 "
                            type="select"
                            options={moduleOptions}
                            field={field}
                            defaultOption="Please select module type"
                          />
                        )}
                      />
                      <Span
                        className={`${
                          errors?.moduleRef?.message ? "visible" : "invisible"
                        } text-red-600 `}
                      >
                        *{errors?.moduleRef?.message}
                      </Span>
                    </div>

                    {/* title */}
                    <div className="mb-8 w-full">
                      <Typography as={"p"} className="text-gray-700 mb-3">
                        Title
                      </Typography>
                      <Controller
                        name="title"
                        control={control}
                        rules={{
                          required: "title must be provided",
                        }}
                        render={({ field }) => (
                          // <Input label="Title" {...field} crossOrigin="myValue" />
                          <InputBox
                            type="text"
                            field={field}
                            className="w-full border border-gray-400 py-2 px-2 text-gray-700 text-base"
                          />
                        )}
                      />
                      <Span
                        className={`${
                          errors?.title?.message ? "visible" : "invisible"
                        } text-red-600 `}
                      >
                        *{errors?.title?.message}
                      </Span>
                    </div>

                    {/* pass mark percentage */}
                    <div className="mb-8 w-full">
                      <Typography as={"p"} className="text-gray-700 mb-3">
                        Pass Mark Percentage
                      </Typography>
                      <Controller
                        name="passMarkPercentage"
                        control={control}
                        rules={{
                          required: "percentage must be provided",
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
                          errors?.passMarkPercentage?.message
                            ? "visible"
                            : "invisible"
                        } text-red-600 `}
                      >
                        *{errors?.passMarkPercentage?.message}
                      </Span>
                    </div>

                    {/* duration in minute*/}
                    <div className="mb-8 w-full">
                      <Typography as={"p"} className="text-gray-700 mb-3">
                        Duration
                      </Typography>
                      <Controller
                        name="durationInMinute"
                        control={control}
                        rules={{
                          required: "duration must be provided",
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
                          errors?.durationInMinute?.message
                            ? "visible"
                            : "invisible"
                        } text-red-600 `}
                      >
                        *{errors?.durationInMinute?.message}
                      </Span>
                    </div>

                    <div className="w-full flex justify-center">
                      {isLoadingModule ? (
                        <InputSubmit
                          value="Loading.."
                          disabled={true}
                          className=" px-4 py-2 bg-indigo-500 rounded-md font-semibold text-white text-lg disabled:bg-gray-500"
                        />
                      ) : (
                        <InputSubmit
                          value="Create Quiz"
                          className=" px-4 py-2 bg-indigo-500 rounded-md font-semibold text-white text-lg disabled:bg-gray-500"
                        />
                      )}
                    </div>
                  </form>
                </div>
              </TabPanel>
              <TabPanel key={2} value={2}>
                <UpdateQuiz />
              </TabPanel>
            </TabsBody>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
