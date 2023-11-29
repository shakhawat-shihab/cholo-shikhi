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
import UpdateAssignment from "./updateAssignment";
import TextBox from "../../../../../atoms/input/TextBox";
import { axiosInstanceToken } from "../../../../../../utils/axiosCreate";
import { toast } from "react-toastify";
import useAssignmentHook from "../../../../../../hooks/assignment/useAssignmentHook";
import { assignmentCreate } from "../../../../../../types/assignment.type";

type Props = {};

export default function CreateAssignment({}: Props) {
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = React.useState(1);
  const user = useSelector((state: any) => state?.auth?.userData);
  const { isLoadingModule, loadModuleWithoutDetail, modules } = useModuleHook();
  const [fileObj, setFileObj] = useState<File | undefined>(undefined);
  const [file, setFile] = useState<string | undefined>(undefined);
  const { createAssignment, isLoadingAssignment } = useAssignmentHook();

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    getValues,
    setValue,
    watch,
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      moduleRef: "",
      teacherRef: "",
      courseRef: "",
      passMarkPercentage: 50,
      total: 0,
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
      const obj: assignmentCreate = {
        title: getValues("title"),
        description: getValues("description"),
        teacherRef: user?.userRef?.teacherRef,
        courseRef: courseId,
        moduleRef: getValues("moduleRef"),
        total: getValues("total"),
        passMarkPercentage: getValues("passMarkPercentage"),
      };

      await createAssignment(obj);

      reset({ title: "", description: "", passMarkPercentage: 0, total: 0 });
    }
  };

  const handleFileChange = (e: any) => {
    const fileObject = e.target.files && e.target.files[0];
    if (!fileObject) {
      return;
    }
    // console.log("fileObject is", fileObject);
    setFileObj(fileObject);
    if (e.target.files && e.target.files.length > 0) {
      setFile(URL.createObjectURL(e.target.files[0]));
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
                Create Assignment
              </Tab>
              <Tab
                key={2}
                value={2}
                onClick={() => setActiveTab(2)}
                className={activeTab === 2 ? "text-gray-900" : ""}
              >
                Update Assignment
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

                    {/* description */}
                    <div className="mb-8 w-full">
                      <Typography as={"p"} className="text-gray-700 mb-3">
                        Description
                      </Typography>
                      <Controller
                        name="description"
                        control={control}
                        rules={{
                          required: "description must be provided",
                        }}
                        render={({ field }) => (
                          <TextBox
                            type="text"
                            field={field}
                            className="w-full border border-gray-400 py-2 px-2 text-gray-700 text-base"
                          />
                        )}
                      />
                      <Span
                        className={`${
                          errors?.description?.message ? "visible" : "invisible"
                        } text-red-600 `}
                      >
                        *{errors?.description?.message}
                      </Span>
                    </div>

                    {/* pass mark */}
                    <div className="mb-8 w-full">
                      <Typography as={"p"} className="text-gray-700 mb-3">
                        Passmarks Percentage
                      </Typography>
                      <Controller
                        name="passMarkPercentage"
                        control={control}
                        rules={{
                          required: "Passmark Percetage must be provided",
                        }}
                        render={({ field }) => (
                          <TextBox
                            type="number"
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

                    {/* total */}
                    <div className="mb-8 w-full">
                      <Typography as={"p"} className="text-gray-700 mb-3">
                        Total Marks
                      </Typography>
                      <Controller
                        name="total"
                        control={control}
                        rules={{
                          required: "Total marks must be provided",
                        }}
                        render={({ field }) => (
                          <TextBox
                            type="number"
                            field={field}
                            className="w-full border border-gray-400 py-2 px-2 text-gray-700 text-base"
                          />
                        )}
                      />
                      <Span
                        className={`${
                          errors?.total?.message ? "visible" : "invisible"
                        } text-red-600 `}
                      >
                        *{errors?.total?.message}
                      </Span>
                    </div>

                    {/* file */}
                    <div className="mb-8 w-full">
                      <input
                        type="file"
                        name="profilePicture"
                        onChange={(e) => handleFileChange(e)}
                      />
                    </div>

                    <div className="w-full flex justify-center">
                      {isLoadingAssignment ? (
                        <InputSubmit
                          value="Loading.."
                          disabled={true}
                          className=" px-4 py-2 bg-indigo-500 rounded-md font-semibold text-white text-lg disabled:bg-gray-500"
                        />
                      ) : (
                        <InputSubmit
                          value="Create Assignment"
                          className=" px-4 py-2 bg-indigo-500 rounded-md font-semibold text-white text-lg disabled:bg-gray-500"
                        />
                      )}
                    </div>
                  </form>
                </div>
              </TabPanel>
              <TabPanel key={2} value={2}>
                <UpdateAssignment />
              </TabPanel>
            </TabsBody>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
