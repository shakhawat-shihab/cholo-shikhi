import React, {
  useState,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { courseCreate } from "../../../../../../utils/types";
import { Typography } from "@material-tailwind/react";
import InputBox from "../../../../../atoms/input/inputBox";
import Span from "../../../../../atoms/paragraph/span";
import TextBox from "../../../../../atoms/input/TextBox";
import InputSelect from "../../../../../atoms/input/inputSelect";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { SlPencil } from "react-icons/sl";
import InputSubmit from "../../../../../atoms/input/inputSubmit";
import thumbnail from "../../../../../../assets/images/thumbnail.png";
import { useSelector } from "react-redux";
import useCategoryHook from "../../../../../../hooks/category/useCategoryHook";
import useCourseHook from "../../../../../../hooks/course/useCourseHook";

type Props = {
  setVal: Dispatch<SetStateAction<number>>;
};

export default function UpdateCourse({ setVal }: Props) {
  const { courseId } = useParams();
  const [imgObj, setImgObj] = useState<File | undefined>(undefined);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [loadedImg, setLoadedImage] = useState<string | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  const user = useSelector((state: any) => state?.auth?.userData);
  const { categories } = useCategoryHook();
  const {
    isLoadingCourse,
    isSuccess,
    getCourseById,
    courseDetails,
    updateCourseById,
  } = useCourseHook();

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

  const handleUpdateCourse = async (data: any) => {
    const obj: courseCreate = {
      title: getValues("title"),
      description: getValues("description"),
      difficulty: getValues("difficulty"),
      language: getValues("language"),
      learningScope: getValues("learningScope"),
      learningOutcome: getValues("learningOutcome"),
      teacherRef: user?.userRef?.teacherRef,
      // thumbnail: imgObj,
      category: getValues("category"),
    };

    if (imgObj) obj.thumbnail = imgObj;

    // console.log("obj ------------- ", obj);
    if (courseId) await updateCourseById({ courseId: courseId, data: obj });
    console.log("isSuccess ", isSuccess);
    if (isSuccess) {
      setVal(1);
    }
  };

  const handleFileChange = (e: any) => {
    setLoadedImage("");
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

  const handleClick = () => {
    inputRef.current && inputRef.current.click();
  };

  useEffect(() => {
    const loadCourseFunction = async () => {
      if (courseId) {
        await getCourseById({ courseId });
      }
    };
    loadCourseFunction();
  }, [courseId]);

  useEffect(() => {
    if (courseDetails) {
      console.log("courseDetails ", courseDetails);
      setValue("title", courseDetails?.title);
      setValue("description", courseDetails?.description);
      setValue("language", courseDetails?.language);
      setValue("learningScope", courseDetails?.learningScope);
      setValue("learningOutcome", courseDetails?.learningOutcome);
      setValue("category", courseDetails?.categoryRef?._id);
      courseDetails?.thumbnail && setLoadedImage(courseDetails?.thumbnail);
    }
  }, [courseDetails]);

  return (
    <div>
      {/* UpdateCourse: {courseId} */}
      <form
        className=" flex flex-wrap gap-3 max-w-3xl justify-between "
        onSubmit={handleSubmit(handleUpdateCourse)}
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
              <InputBox
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
              <div className="image-edit-btn opacity-100" onClick={handleClick}>
                <SlPencil size={22} />
              </div>
            ) : (
              <div className="image-edit-btn opacity-70" onClick={handleClick}>
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
              // src={imgObj?.name ? image : thumbnail}
              src={loadedImg ? loadedImg : imgObj?.name ? image : thumbnail}
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
              value="Update"
              className=" px-4 py-2 bg-indigo-500 rounded-md font-semibold text-white text-lg disabled:bg-gray-500"
            />
          )}
        </div>
      </form>
    </div>
  );
}
