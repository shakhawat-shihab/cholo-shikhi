import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography,
} from "@material-tailwind/react";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import InputBox from "../../../../../atoms/input/inputBox";
import Span from "../../../../../atoms/paragraph/span";
import InputSelect from "../../../../../atoms/input/inputSelect";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useModuleHook from "../../../../../../hooks/module/useModuleHook";
import { contentCreate } from "../../../../../../types/content.type";
import TextBox from "../../../../../atoms/input/TextBox";
import InputSubmit from "../../../../../atoms/input/inputSubmit";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { SlPencil } from "react-icons/sl";
import thumbnail from "../../../../../../assets/images/thumbnail.png";
import ReactPlayer from "react-player";
import { Module } from "../../../../../../types/module.type";
import useContentHook from "../../../../../../hooks/content/useContentHook";
import WebCamComponent from "./webCamComponent";

type Props = {};

export default function CreateContent({}: Props) {
  const [imgObj, setImgObj] = useState<File | undefined>(undefined);
  const [image, setImage] = useState<string | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = React.useState(1);
  const user = useSelector((state: any) => state?.auth?.userData);
  const { isLoadingModule, loadModuleWithoutDetail, modules } = useModuleHook();
  const { createContent, isSuccess } = useContentHook();

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm<contentCreate>({
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      isPremium: "false",
      type: "text",
      teacherRef: "",
      courseRef: "",
      moduleRef: "",
      text: "",
    },
  });

  const handleFileChange = (e: any) => {
    const fileObject = e.target.files && e.target.files[0];
    if (!fileObject) {
      return;
    }
    console.log("fileObject is", fileObject);
    setImgObj(fileObject);
    if (e.target.files && e.target.files.length > 0) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const [moduleOptions, setModuleOptions] = useState<{
    title: string;
    _id: string;
  } | null>(null);

  const handleClick = () => {
    inputRef.current && inputRef.current.click();
  };

  const handleCreateContent = async (data: any) => {
    if (courseId) {
      const obj: contentCreate = {
        title: getValues("title"),
        description: getValues("description"),
        isPremium: getValues("isPremium"),
        type: getValues("type"),
        teacherRef: user?.userRef?.teacherRef,
        courseRef: courseId,
        moduleRef: getValues("moduleRef"),
        text: getValues("text"),
      };

      if (getValues("type") != "text") {
        obj.content = imgObj;
      }

      console.log("obj ------------- ", obj);

      await createContent(obj);
      // if (isSuccess) {
      //   setValue("title", "");
      //   setValue("description", "");
      //   setValue("moduleRef", "");
      //   setValue("text", "");
      // }
    }
  };

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

  useEffect(() => {
    setImage("");
  }, [watch("type")]);

  const handleVideoFile = (file: any) => {
    const videoPreviewUrl = URL.createObjectURL(file);
    setImage(videoPreviewUrl);
    setImgObj(file);
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
                Create Content
              </Tab>
              <Tab
                key={2}
                value={2}
                onClick={() => setActiveTab(2)}
                className={activeTab === 2 ? "text-gray-900" : ""}
              >
                Update Content
              </Tab>
            </TabsHeader>
            <TabsBody>
              <TabPanel key={1} value={1}>
                <form
                  className=" flex flex-wrap gap-3 max-w-3xl justify-between "
                  onSubmit={handleSubmit(handleCreateContent)}
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

                  {/* isPremium */}
                  <div className="mb-8 w-full ">
                    <Typography as={"p"} className="text-gray-700 mb-3">
                      Select Content Premium
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
                          //   defaultOption="Please select module type"
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

                  {/* type */}
                  <div className="mb-8 w-full ">
                    <Typography as={"p"} className="text-gray-700 mb-3">
                      Select type
                    </Typography>
                    <Controller
                      name="type"
                      control={control}
                      rules={{
                        required: "type must be provided",
                      }}
                      render={({ field }) => (
                        <InputSelect
                          className="w-full text-center border border-gray-400 rounded ms-0 bg-inherit px-4 py-2 "
                          type="select"
                          options={[
                            { title: "text" },
                            { title: "video" },
                            { title: "document" },
                            { title: "recordVideo" },
                          ]}
                          field={field}
                          //   handleOnChange={() => selectChange}
                        />
                      )}
                    />
                    <Span
                      className={`${
                        errors?.type?.message ? "visible" : "invisible"
                      } text-red-600 `}
                    >
                      *{errors?.type?.message}
                    </Span>
                  </div>

                  {watch("type") == "text" && (
                    <div className="mb-8 w-full">
                      <Typography as={"p"} className="text-gray-700 mb-3">
                        Text
                      </Typography>

                      <Controller
                        name="text"
                        control={control}
                        rules={{
                          required: "learningOutcome must be provided",
                        }}
                        render={({ field }) => (
                          <ReactQuill
                            theme="snow"
                            {...field}
                            value={field?.value}
                            onChange={(value) => {
                              field.onChange(value);
                            }}
                            className="w-100"
                            style={{ height: "170px" }}
                          />
                        )}
                      />
                      <Span
                        className={`${
                          errors?.text?.message ? "visible" : "invisible"
                        } text-red-600 `}
                      >
                        *{errors?.text?.message}
                      </Span>
                    </div>
                  )}

                  {(watch("type") == "document" ||
                    watch("type") == "video" ||
                    watch("type") == "recordVideo") && (
                    <div className="w-full min-h-screen">
                      <Typography as="h2" className="mb-3">
                        {" "}
                        Upload content of the course{" "}
                      </Typography>
                      <div className="w-2/3 mx-auto h-5/6 border-2 border-dashed border-gray-600 flex justify-center items-center">
                        {watch("type") == "video" ? (
                          <ReactPlayer
                            url={imgObj?.name && image}
                            controls={true}
                            config={{
                              youtube: {
                                playerVars: { showinfo: 1 },
                              },
                              facebook: {
                                appId: "12345",
                              },
                            }}
                            width="100%"
                            height="100%"
                            className="p-1"
                          />
                        ) : (
                          <object
                            data={image}
                            type="application/pdf"
                            width="100%"
                            height="100%"
                          >
                            <p>
                              Alternative text - include a link{" "}
                              <a href={image}>to the PDF!</a>
                            </p>
                          </object>
                        )}
                      </div>
                      <input
                        ref={inputRef}
                        type="file"
                        name="profilePicture"
                        onChange={(e) => handleFileChange(e)}
                      />
                    </div>
                  )}

                  {/* submit */}
                  <div
                    className={`w-full text-center 
                    ${watch("type") == "document" && "mt-44090"}
                     `}
                  >
                    {isLoadingModule ? (
                      <InputSubmit
                        value="Loading.."
                        disabled={true}
                        className=" px-4 py-2 bg-indigo-500 rounded-md font-semibold text-white text-lg disabled:bg-gray-500"
                      />
                    ) : (
                      <InputSubmit
                        value="Create Content"
                        className=" px-4 py-2 bg-indigo-500 rounded-md font-semibold text-white text-lg disabled:bg-gray-500"
                      />
                    )}
                  </div>
                  {/* <h1> {watch("type")} </h1> */}
                </form>

                {watch("type") == "recordVideo" && (
                  <div className="mb-8 w-full">
                    <WebCamComponent handleVideoFile={handleVideoFile} />
                  </div>
                )}
                {/* <ReactPlayer
                  url={imgObj?.name && image}
                  controls={true}
                  config={{
                    youtube: {
                      playerVars: { showinfo: 1 },
                    },
                    facebook: {
                      appId: "12345",
                    },
                  }}
                  width="100%"
                  height="100%"
                  className="p-1"
                /> */}
              </TabPanel>
              <TabPanel key={2} value={2}>
                {/* <UpdateModule /> */}
              </TabPanel>
            </TabsBody>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
