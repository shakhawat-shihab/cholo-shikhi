import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  RiAtLine,
  RiEdit2Fill,
  RiLockPasswordLine,
  RiShieldUserLine,
} from "react-icons/ri";
import IconedInputBox from "../../../molecules/iconedInput/iconedInputBox";
import Span from "../../../atoms/paragraph/span";
import Paragraph from "../../../atoms/paragraph/paragraph";
import InputSubmit from "../../../atoms/input/inputSubmit";
import Loader from "../../../organisms/loader/loader";
import IconedInputSelect from "../../../molecules/iconedInput/iconedInputSelect";
import useAuthHook from "../../../../hooks/auth/useAuthHook";

type Props = {};

export default function Register({}: Props) {
  // const [isLoading, setIsLoading] = useState(false);
  // const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
    getValues,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      userName: "",
      email: "",
      role: "student",
      password: "",
      confirmPassword: "",
    },
  });

  const { signUp, isLoadingAuth, user } = useAuthHook();

  const handleSignUp = async (data: any) => {
    let userName = getValues("userName").toLowerCase().trim();
    let email = getValues("email").toLowerCase().trim();
    let role = getValues("role");
    let password = getValues("password");
    let confirmPassword = getValues("confirmPassword");

    await signUp({ userName, email, role, password, confirmPassword });
  };

  let options = [
    {
      title: "student",
    },
    {
      title: "teacher",
    },
  ];
  return (
    <div className="md:my-28">
      {isLoadingAuth && (
        <div>
          <Loader />
        </div>
      )}
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3  mx-auto lg:w-6/12 md:w-9/12 sm:w-11/12 w-11/12 max-w-screen-md">
          {/* blue layout */}
          <div className="absolute sm:inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          {/* white layout */}
          <div className="relative px-4 py-10 bg-white shadow-lg rounded-3xl sm:p-20  w-full ">
            <div className="">
              <div>
                <h1 className="text-2xl font-semibold text-center">
                  Registration Form
                </h1>
              </div>
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <form
                    onSubmit={handleSubmit(handleSignUp)}
                    autoComplete="off"
                  >
                    {/* userName */}
                    <div className="mb-8">
                      <Controller
                        name="userName"
                        control={control}
                        rules={{
                          required: "userName must be provided",
                          minLength: {
                            value: 3,
                            message: "Minimum length must be 3",
                          },
                          maxLength: {
                            value: 15,
                            message: "Maximum length must be 15",
                          },
                          pattern: {
                            value: /^[a-zA-Z]*$/,
                            message: "Only english letters are allowed ",
                          },
                        }}
                        render={({ field }) => (
                          <IconedInputBox
                            id="userName"
                            field={field}
                            autoComplete="off"
                            name="userName"
                            type="text"
                            className=" text-base peer placeholder-transparent h-10 w-full border-b-2 border-gray-300
                                text-gray-900 focus:outline-none focus:borer-rose-600"
                            placeholder="Enter User Name"
                            iconPosition="left"
                            labelText="User Name"
                          >
                            <RiEdit2Fill size={22} />
                          </IconedInputBox>
                        )}
                      />
                      <Span
                        className={`${
                          errors?.userName?.message ? "visible" : "invisible"
                        } text-red-600 `}
                      >
                        *{errors?.userName?.message}
                      </Span>
                    </div>
                    {/* email */}
                    <div className="mb-8">
                      <Controller
                        name="email"
                        control={control}
                        rules={{
                          required: "email must be provided",
                          pattern: {
                            value:
                              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                            message: "Invalid email",
                          },
                        }}
                        render={({ field }) => (
                          <IconedInputBox
                            id="email"
                            field={field}
                            autoComplete="off"
                            name="email"
                            type="text"
                            className=" text-base peer placeholder-transparent h-10 w-full border-b-2 border-gray-300
                                text-gray-900 focus:outline-none focus:borer-rose-600"
                            placeholder="Enter Email address"
                            iconPosition="left"
                            labelText="Email"
                          >
                            <RiAtLine size={22} />
                          </IconedInputBox>
                        )}
                      />
                      <Span
                        className={`${
                          errors?.email?.message ? "visible" : "invisible"
                        } text-red-600 `}
                      >
                        *{errors?.email?.message}
                      </Span>
                    </div>

                    {/* role */}
                    <div className="mb-8">
                      <Controller
                        name="role"
                        control={control}
                        rules={{
                          required: "Role must be provided",
                        }}
                        render={({ field }) => (
                          <IconedInputSelect
                            id="role"
                            field={field}
                            autoComplete="off"
                            name="role"
                            type="text"
                            className=" text-base peer placeholder-transparent h-10 w-full border-b-2 border-gray-300
                                text-gray-900 focus:outline-none focus:borer-rose-600 bg-inherit"
                            placeholder="Enter role"
                            iconPosition="left"
                            labelText="Role"
                            options={options}
                          >
                            <RiShieldUserLine size={22} />
                          </IconedInputSelect>
                        )}
                      />
                      <Span
                        className={`${
                          errors?.role?.message ? "visible" : "invisible"
                        } text-red-600 `}
                      >
                        *{errors?.role?.message}
                      </Span>
                    </div>

                    {/* password */}
                    <div className="mb-8">
                      <Controller
                        name="password"
                        control={control}
                        rules={{
                          required: "password must be provided",
                          minLength: {
                            value: 8,
                            message: "Minimum length must be 8",
                          },
                          pattern: {
                            value:
                              /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$/,
                            message:
                              "Password must contain at least 8 characters with 1 lower case, 1 upper case, 1 number, 1 symbol",
                          },
                        }}
                        render={({ field }) => (
                          <IconedInputBox
                            id="password"
                            field={field}
                            autoComplete="off"
                            name="password"
                            type="text"
                            className="text-base peer placeholder-transparent h-10 w-full border-b-2 border-gray-300
                                    text-gray-900 focus:outline-none focus:borer-rose-600"
                            placeholder="Enter password"
                            iconPosition="left"
                            isPassword={true}
                            passwordIconSize={20}
                            labelText="Password"
                          >
                            <RiLockPasswordLine size={22} />
                          </IconedInputBox>
                        )}
                      />
                      <Span
                        className={`${
                          errors?.password?.message ? "visible" : "invisible"
                        } text-red-600 break-words`}
                      >
                        *{errors?.password?.message}
                      </Span>
                    </div>
                    {/* confirm password */}
                    <div className="mb-8">
                      <Controller
                        name="confirmPassword"
                        control={control}
                        rules={{
                          required: "password must be provided",
                          minLength: {
                            value: 8,
                            message: "Minimum length must be 8",
                          },
                          pattern: {
                            value:
                              /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$/,
                            message:
                              "Password must contain at least 8 characters with 1 lower case, 1 upper case, 1 number, 1 symbol",
                          },
                          validate: (value) =>
                            value === watch("password") ||
                            "Confirm password should match with password",
                        }}
                        render={({ field }) => (
                          <IconedInputBox
                            id="confirmPassword"
                            field={field}
                            autoComplete="off"
                            name="confirmPassword"
                            type="text"
                            className="text-base peer placeholder-transparent h-10 w-full border-b-2 border-gray-300
                                    text-gray-900 focus:outline-none focus:borer-rose-600"
                            placeholder="Enter password again"
                            iconPosition="left"
                            isPassword={true}
                            passwordIconSize={20}
                            labelText="Confirm Password"
                          >
                            <RiLockPasswordLine size={22} />
                          </IconedInputBox>
                        )}
                      />
                      <Span
                        className={`${
                          errors?.confirmPassword?.message
                            ? "visible"
                            : "invisible"
                        } text-red-600 break-words`}
                      >
                        *{errors?.confirmPassword?.message}
                      </Span>
                    </div>

                    <div className="relative">
                      <InputSubmit
                        value="Sign Up"
                        className="bg-blue-500 hover:bg-blue-700 w-100 text-white rounded-md px-2 py-1 w-full"
                      />
                    </div>
                  </form>
                  <div className="mt-5 text-center">
                    <Paragraph className="mt-7">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="underline text-blue-500 hover:text-blue-800"
                      >
                        Log In
                      </Link>{" "}
                    </Paragraph>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
