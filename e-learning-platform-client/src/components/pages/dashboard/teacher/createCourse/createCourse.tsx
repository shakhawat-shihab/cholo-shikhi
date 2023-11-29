import {
  Input,
  Option,
  Select,
  Spinner,
  Textarea,
  Typography,
  input,
} from "@material-tailwind/react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Span from "../../../../atoms/paragraph/span";
import InputSubmit from "../../../../atoms/input/inputSubmit";
import { SlPencil } from "react-icons/sl";
import { useState, useEffect, useRef } from "react";
import "./createCourse.scss";
import useCategoryHook from "../../../../../hooks/category/useCategoryHook";
import InputSelect from "../../../../atoms/input/inputSelect";
import { useSelector } from "react-redux";
import useCourseHook from "../../../../../hooks/course/useCourseHook";
import thumbnail from "../../../../../assets/images/thumbnail.png";
import { courseCreate } from "../../../../../utils/types";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import InputBox from "../../../../atoms/input/inputBox";
import TextBox from "../../../../atoms/input/TextBox";

type Props = {};

type FormValues = {
  learningOutcome: string;
  learningScope: string;
  title: string;
  category: string;
  description: string;
  language: string;
};

export default function CreateCourse({}: Props) {
  const [imgObj, setImgObj] = useState<File | undefined>(undefined);
  const [image, setImage] = useState<string | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<courseCreate>({
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      difficulty: "",
      language: "",
      category: "",
      learningOutcome: "",
      learningScope: "",
    },
  });

  const user = useSelector((state: any) => state?.auth?.userData);
  const { categories } = useCategoryHook();
  const { createCourse, isLoadingCourse, isSuccess } = useCourseHook();

  const handleFileChange = (e: any) => {
    const fileObject = e.target.files && e.target.files[0];
    if (!fileObject) {
      return;
    }
    // console.log("fileObject is", fileObject);
    setImgObj(fileObject);
    if (e.target.files && e.target.files.length > 0) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleCreateCourse = async (data: any) => {
    const obj: courseCreate = {
      title: getValues("title"),
      description: getValues("description"),
      difficulty: getValues("difficulty"),
      learningScope: getValues("learningScope"),
      learningOutcome: getValues("learningOutcome"),
      teacherRef: user?.userRef?.teacherRef,
      thumbnail: imgObj,
      category: getValues("category"),
    };

    // console.log("obj ------------- ", obj);

    if (imgObj && imgObj?.type) {
      await createCourse(obj);
      // console.log("isSuccess ", isSuccess);
      if (isSuccess) {
        setValue("title", "");
        setValue("description", "");
        // setValue("difficulty", "");
        setValue("learningScope", "");
        setValue("learningOutcome", "");
        setValue("language", "");
        setImgObj(undefined);
      }
    }
  };

  const handleClick = () => {
    inputRef.current && inputRef.current.click();
  };

  // console.log("isLoadingCourse ", isLoadingCourse);

  return (
    // <div>
    <div className=" h-full  flex justify-center items-center ">
      <div className=" bg-white  p-2 sm:p-8 md:p-10 shadow-lg rounded-md my-2">
        <h2 className="pb-8 text-3xl text-center "> Create Course </h2>
        <form
          className=" flex flex-wrap gap-3 max-w-3xl justify-between "
          onSubmit={handleSubmit(handleCreateCourse)}
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

          {/* language */}
          <div className="mb-8 w-full">
            <Typography as={"p"} className="text-gray-700 mb-3">
              Language
            </Typography>
            <Controller
              name="language"
              control={control}
              rules={{
                required: "language must be provided",
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
                errors?.language?.message ? "visible" : "invisible"
              } text-red-600 `}
            >
              *{errors?.language?.message}
            </Span>
          </div>

          {/* category */}
          <div className="mb-8 w-full ">
            <Typography as={"p"} className="text-gray-700 mb-3">
              Select Category
            </Typography>
            <Controller
              name="category"
              control={control}
              rules={{
                required: "category must be provided",
              }}
              render={({ field }) => (
                <InputSelect
                  className="w-full text-center border border-gray-400 rounded ms-0 bg-inherit px-4 py-2 "
                  type="select"
                  options={categories}
                  field={field}
                  defaultOption="Please select category"
                />
              )}
            />
            <Span
              className={`${
                errors?.category?.message ? "visible" : "invisible"
              } text-red-600 `}
            >
              *{errors?.category?.message}
            </Span>
          </div>

          {/* difficulty */}
          <div className="mb-8 w-full ">
            <Typography as={"p"} className="text-gray-700 mb-3">
              Select Difficulty
            </Typography>
            <Controller
              name="difficulty"
              control={control}
              rules={{
                required: "difficulty must be provided",
              }}
              render={({ field }) => (
                <InputSelect
                  className="w-full text-center border border-gray-400 rounded ms-0 bg-inherit px-4 py-2 "
                  type="select"
                  options={[
                    { title: "basic" },
                    { title: "intermedidate" },
                    { title: "hard" },
                  ]}
                  field={field}
                  defaultOption="Please select difficulty"
                />
              )}
            />
            <Span
              className={`${
                errors?.difficulty?.message ? "visible" : "invisible"
              } text-red-600 `}
            >
              *{errors?.difficulty?.message}
            </Span>
          </div>

          {/* learning outcome */}
          <div className="mb-8 w-full">
            <Typography as={"p"} className="text-gray-700 mb-3">
              Learning Outcome
            </Typography>

            <Controller
              name="learningOutcome"
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
                errors?.learningOutcome?.message ? "visible" : "invisible"
              } text-red-600 `}
            >
              *{errors?.learningOutcome?.message}
            </Span>
          </div>

          {/* learning scope */}
          <div className="mb-8 w-full">
            <Typography as={"p"} className="text-gray-700 mb-3">
              Learning Scope
            </Typography>
            <Controller
              name="learningScope"
              control={control}
              rules={{
                required: "learningScope must be provided",
              }}
              render={({ field }) => (
                <ReactQuill
                  theme="snow"
                  {...field}
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
                errors?.learningScope?.message ? "visible" : "invisible"
              } text-red-600 `}
            >
              *{errors?.learningScope?.message}
            </Span>
          </div>

          {/* image */}
          <div>
            <Typography as="h2" className="mb-3">
              {" "}
              Upload Thumbnail of Course{" "}
            </Typography>
            <div className="img-container ">
              {!imgObj?.name ? (
                <div
                  className="image-edit-btn opacity-100"
                  onClick={handleClick}
                >
                  <SlPencil size={22} />
                </div>
              ) : (
                <div
                  className="image-edit-btn opacity-70"
                  onClick={handleClick}
                >
                  <SlPencil size={22} />
                </div>
              )}

              <input
                style={{ display: "none" }}
                ref={inputRef}
                type="file"
                name="profilePicture"
                onChange={(e) => handleFileChange(e)}
              />
              <img
                src={imgObj?.name ? image : thumbnail}
                alt="course thumbnail"
                className="max-w-full max-h-full"
              />
            </div>
          </div>

          {/* submit */}
          <div className="w-full text-center">
            {isLoadingCourse ? (
              <InputSubmit
                value="Loading.."
                disabled={true}
                className=" px-4 py-2 bg-indigo-500 rounded-md font-semibold text-white text-lg disabled:bg-gray-500"
              />
            ) : (
              <InputSubmit
                value="create"
                className=" px-4 py-2 bg-indigo-500 rounded-md font-semibold text-white text-lg disabled:bg-gray-500"
              />
            )}
          </div>
        </form>
      </div>
    </div>
    // </div>
  );
}
