import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import UpdateCourse from "../updateCourse/updateCourse";
import { Controller, useForm } from "react-hook-form";
import InputBox from "../../../../../atoms/input/inputBox";
import Span from "../../../../../atoms/paragraph/span";
import TextBox from "../../../../../atoms/input/TextBox";
import InputSelect from "../../../../../atoms/input/inputSelect";
import InputSubmit from "../../../../../atoms/input/inputSubmit";
import { Module, moduleCreate } from "../../../../../../types/module.type";
import { useSelector } from "react-redux";
import UpdateModule from "./updateModule";
import useModuleHook from "../../../../../../hooks/module/useModuleHook";

type Props = {};

export default function CreateModule({}: Props) {
  const { courseId } = useParams();
  const [moduleOptions, setModuleOptions] = useState<{
    title: string;
    _id: string;
  } | null>(null);

  const [activeTab, setActiveTab] = React.useState(1);
  const user = useSelector((state: any) => state?.auth?.userData);

  const { createModule, isLoadingModule, isSuccess } = useModuleHook();

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<moduleCreate>({
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      isPremium: "false",
    },
  });

  const handleCreateModule = async (data: any) => {
    if (courseId) {
      const obj: moduleCreate = {
        title: getValues("title"),
        description: getValues("description"),
        isPremium: getValues("isPremium"),
        // moduleRef: getValues("module"),
        teacherRef: user?.userRef?.teacherRef,
        courseRef: courseId,
      };
      //   console.log("obj ------------- ", obj);
      await createModule(obj);
      if (isSuccess) {
        setValue("title", "");
        setValue("description", "");
      }
    }
  };

  return (
    <div className=" flex justify-center items-center  ">
      <div className=" bg-white w-full  p-2 sm:p-8 md:p-10 shadow-lg rounded-md my-2">
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
                Create Module
              </Tab>
              <Tab
                key={2}
                value={2}
                onClick={() => setActiveTab(2)}
                className={activeTab === 2 ? "text-gray-900" : ""}
              >
                Update Module
              </Tab>
            </TabsHeader>
            <TabsBody>
              <TabPanel key={1} value={1}>
                <form
                  className=" flex flex-wrap gap-3 max-w-3xl justify-between "
                  onSubmit={handleSubmit(handleCreateModule)}
                  autoComplete="off"
                >
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

                  {/* isPremium */}
                  <div className="mb-8 w-full ">
                    <Typography as={"p"} className="text-gray-700 mb-3">
                      Select Category
                    </Typography>
                    <Controller
                      name="isPremium"
                      control={control}
                      rules={{
                        required: "type must be provided",
                      }}
                      render={({ field }) => (
                        <InputSelect
                          className="w-full text-center border border-gray-400 rounded ms-0 bg-inherit px-4 py-2 "
                          type="select"
                          options={[
                            { title: "Premium", _id: "true" },
                            { title: "Not Premium", _id: "false" },
                          ]}
                          field={field}
                          defaultOption="Please select module type"
                        />
                      )}
                    />
                    <Span
                      className={`${
                        errors?.isPremium?.message ? "visible" : "invisible"
                      } text-red-600 `}
                    >
                      *{errors?.isPremium?.message}
                    </Span>
                  </div>

                  {/* submit */}
                  <div className="w-full text-center">
                    {isLoadingModule ? (
                      <InputSubmit
                        value="Loading.."
                        disabled={true}
                        className=" px-4 py-2 bg-indigo-500 rounded-md font-semibold text-white text-lg disabled:bg-gray-500"
                      />
                    ) : (
                      <InputSubmit
                        value="Create Module"
                        className=" px-4 py-2 bg-indigo-500 rounded-md font-semibold text-white text-lg disabled:bg-gray-500"
                      />
                    )}
                  </div>
                </form>
              </TabPanel>
              <TabPanel key={2} value={2}>
                <UpdateModule />
              </TabPanel>
            </TabsBody>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
