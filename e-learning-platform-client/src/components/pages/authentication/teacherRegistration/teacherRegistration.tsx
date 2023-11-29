import React, { useEffect, useState, ChangeEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import IconedInputBox from "../../../molecules/iconedInput/iconedInputBox";
import {
  RiEdit2Fill,
  RiFacebookBoxLine,
  RiGraduationCapFill,
  RiTwitterLine,
} from "react-icons/ri";
import { IoDocumentAttachOutline } from "react-icons/io5";
import Span from "../../../atoms/paragraph/span";
import InputSubmit from "../../../atoms/input/inputSubmit";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaPhoneAlt } from "react-icons/fa";
import useTeacherHook from "../../../../hooks/teacher/useTeacherHook";
import useAuthHook from "../../../../hooks/auth/useAuthHook";

type Props = {};

export default function TeacherRegistration({}: Props) {
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
    getValues,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      facebookUrl: "",
      twitterUrl: "",
      education: "",
    },
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      // Assuming you only want to handle the first selected file
      const file = files[0];
      setSelectedFile(file);
      console.log(selectedFile);
      // You can also perform additional actions with the selected file here
      // For example, you might want to upload the file to a server.
    }
  };

  const user = useSelector((state: any) => state?.auth?.userData);
  useEffect(() => {
    if (user?.role != "pending") {
      navigate("/");
    }
  }, [user]);

  const { isLoadingTeacher, createTeacherRequest } = useTeacherHook();
  const { checkUser } = useAuthHook();

  const handleSignUp = async (data: any) => {
    let firstName = getValues("firstName").toLowerCase().trim();
    let lastName = getValues("lastName").toLowerCase().trim();
    let phone = getValues("phone").toLowerCase().trim();
    let facebookUrl = getValues("facebookUrl").toLowerCase().trim();
    let twitterUrl = getValues("twitterUrl").toLowerCase().trim();
    let education = getValues("education").trim();

    // const formData = new FormData();
    // console.log("data ", data);
    if (selectedFile?.type) {
      await createTeacherRequest({
        userId: user?.userRef?._id,
        firstName,
        lastName,
        phone,
        facebookUrl,
        twitterUrl,
        education,
        resume: selectedFile,
      });

      await checkUser(user?.token);
      // console.log("isSuccess ", isSuccess);
    }
  };

  return (
    <div className="md:my-28">
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3  mx-auto lg:w-6/12 md:w-9/12 sm:w-11/12 w-11/12 max-w-screen-md">
          {/* blue layout */}
          <div className="absolute sm:inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          {/* white layout */}
          <div className="relative px-4 py-10 bg-white shadow-lg rounded-3xl sm:p-20  w-full ">
            <div className="">
              <div>
                <h1 className="text-2xl font-semibold text-center">
                  Teacher Registration Form
                </h1>
              </div>
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <form
                    onSubmit={handleSubmit(handleSignUp)}
                    autoComplete="off"
                  >
                    {/* firstName */}
                    <div className="mb-8">
                      <Controller
                        name="firstName"
                        control={control}
                        rules={{
                          required: "firstName must be provided",
                          maxLength: {
                            value: 25,
                            message: "Maximum length must be 15",
                          },
                        }}
                        render={({ field }) => (
                          <IconedInputBox
                            id="firstName"
                            field={field}
                            autoComplete="off"
                            name="firstName"
                            type="text"
                            className=" text-base peer placeholder-transparent h-10 w-full border-b-2 border-gray-300
                                text-gray-900 focus:outline-none focus:borer-rose-600"
                            placeholder="Enter First Name"
                            iconPosition="left"
                            labelText="First Name"
                          >
                            <RiEdit2Fill size={22} />
                          </IconedInputBox>
                        )}
                      />
                      <Span
                        className={`${
                          errors?.firstName?.message ? "visible" : "invisible"
                        } text-red-600 `}
                      >
                        *{errors?.firstName?.message}
                      </Span>
                    </div>

                    {/* lastName */}
                    <div className="mb-8">
                      <Controller
                        name="lastName"
                        control={control}
                        rules={{
                          required: "lastName must be provided",
                          maxLength: {
                            value: 25,
                            message: "Maximum length must be 25",
                          },
                        }}
                        render={({ field }) => (
                          <IconedInputBox
                            id="lastName"
                            field={field}
                            autoComplete="off"
                            name="lastName"
                            type="text"
                            className=" text-base peer placeholder-transparent h-10 w-full border-b-2 border-gray-300
                                text-gray-900 focus:outline-none focus:borer-rose-600"
                            placeholder="Enter Last Name"
                            iconPosition="left"
                            labelText="Last Name"
                          >
                            <RiEdit2Fill size={22} />
                          </IconedInputBox>
                        )}
                      />
                      <Span
                        className={`${
                          errors?.lastName?.message ? "visible" : "invisible"
                        } text-red-600 `}
                      >
                        *{errors?.lastName?.message}
                      </Span>
                    </div>

                    {/* phone */}
                    <div className="mb-8">
                      <Controller
                        name="phone"
                        control={control}
                        rules={{
                          required: "phone must be provided",
                          pattern: {
                            value: /(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/,
                            message: "Invalid phone number",
                          },
                        }}
                        render={({ field }) => (
                          <IconedInputBox
                            id="phone"
                            field={field}
                            autoComplete="off"
                            name="phone"
                            type="text"
                            className=" text-base peer placeholder-transparent h-10 w-full border-b-2 border-gray-300
                                text-gray-900 focus:outline-none focus:borer-rose-600"
                            placeholder="Enter Phone number"
                            iconPosition="left"
                            labelText="Phone"
                          >
                            <FaPhoneAlt size={22} />
                          </IconedInputBox>
                        )}
                      />
                      <Span
                        className={`${
                          errors?.phone?.message ? "visible" : "invisible"
                        } text-red-600 `}
                      >
                        *{errors?.phone?.message}
                      </Span>
                    </div>

                    {/* education */}
                    <div className="mb-8">
                      <Controller
                        name="education"
                        control={control}
                        rules={{
                          required: "education must be provided",
                          maxLength: {
                            value: 25,
                            message: "Maximum length must be 25",
                          },
                        }}
                        render={({ field }) => (
                          <IconedInputBox
                            id="education"
                            field={field}
                            autoComplete="off"
                            name="education"
                            type="text"
                            className=" text-base peer placeholder-transparent h-10 w-full border-b-2 border-gray-300
                                text-gray-900 focus:outline-none focus:borer-rose-600"
                            placeholder="Enter Highest degree"
                            iconPosition="left"
                            labelText="Latest Education Degree"
                          >
                            <RiGraduationCapFill size={22} />
                          </IconedInputBox>
                        )}
                      />
                      <Span
                        className={`${
                          errors?.education?.message ? "visible" : "invisible"
                        } text-red-600 `}
                      >
                        *{errors?.education?.message}
                      </Span>
                    </div>

                    {/* facebookUrl */}
                    <div className="mb-8">
                      <Controller
                        name="facebookUrl"
                        control={control}
                        rules={{
                          // required: "facebookUrl must be provided",
                          maxLength: {
                            value: 70,
                            message: "Maximum length must be 70",
                          },
                        }}
                        render={({ field }) => (
                          <IconedInputBox
                            id="facebookUrl"
                            field={field}
                            autoComplete="off"
                            name="facebookUrl"
                            type="text"
                            className=" text-base peer placeholder-transparent h-10 w-full border-b-2 border-gray-300
                                text-gray-900 focus:outline-none focus:borer-rose-600"
                            placeholder="Enter Facebook url"
                            iconPosition="left"
                            labelText="Facebook Url"
                          >
                            <RiFacebookBoxLine size={22} />
                          </IconedInputBox>
                        )}
                      />
                      <Span
                        className={`${
                          errors?.facebookUrl?.message ? "visible" : "invisible"
                        } text-red-600 `}
                      >
                        *{errors?.facebookUrl?.message}
                      </Span>
                    </div>

                    {/* twitterUrl */}
                    <div className="mb-8">
                      <Controller
                        name="twitterUrl"
                        control={control}
                        rules={{
                          // required: "twitterUrl must be provided",
                          maxLength: {
                            value: 70,
                            message: "Maximum length must be 70",
                          },
                        }}
                        render={({ field }) => (
                          <IconedInputBox
                            id="twitterUrl"
                            field={field}
                            autoComplete="off"
                            name="twitterUrl"
                            type="text"
                            className=" text-base peer placeholder-transparent h-10 w-full border-b-2 border-gray-300
                                text-gray-900 focus:outline-none focus:borer-rose-600"
                            placeholder="Enter Facebook url"
                            iconPosition="left"
                            labelText="Twitter Url"
                          >
                            <RiTwitterLine size={22} />
                          </IconedInputBox>
                        )}
                      />
                      <Span
                        className={`${
                          errors?.twitterUrl?.message ? "visible" : "invisible"
                        } text-red-600 `}
                      >
                        *{errors?.twitterUrl?.message}
                      </Span>
                    </div>

                    {/* resume */}
                    <div className="mb-8">
                      <IconedInputBox
                        id="resume"
                        autoComplete="off"
                        name="resume"
                        type="file"
                        className=" text-base peer placeholder-transparent h-10 w-full border-b-2 border-gray-300
                                text-gray-900 focus:outline-none focus:borer-rose-600 md:ps-16 ps-10"
                        placeholder="Enter your Resume"
                        iconPosition="left"
                        labelText="Resume"
                        onInputChange={handleFileChange}
                      >
                        <IoDocumentAttachOutline size={22} />
                      </IconedInputBox>
                    </div>

                    <div className="text-center">
                      {isLoadingTeacher ? (
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
