import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthApi from "../../../../api/authApi";
import Loader from "../../../organisms/loader/loader";
import { Controller, useForm } from "react-hook-form";
import InputSubmit from "../../../atoms/input/inputSubmit";
import Paragraph from "../../../atoms/paragraph/paragraph";
import IconedInputBoxBox from "../../../molecules/iconedInput/iconedInputBox";
import { RiLockPasswordLine } from "react-icons/ri";
import Span from "../../../atoms/paragraph/span";
import Heading1 from "../../../atoms/heading/heading1";
import { toast } from "react-toastify";
import useAuthHook from "../../../../hooks/auth/useAuthHook";

type Props = {};

export default function ChangePassword({}: Props) {
  const navigate = useNavigate();
  const { token = "", authId = "" } = useParams();
  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { checkPasswordResetToken, isLoadingAuth, resetPassword } =
    useAuthHook();

  const handleChangePassword = async () => {
    // setIsLoading(true);
    let password = getValues("password");
    let confirmPassword = getValues("confirmPassword");
    // try {
    //   const res = await AuthApi.resetPassword({
    //     password,
    //     confirmPassword,
    //     token,
    //     authId,
    //   });
    //   // console.log(res?.data);
    //   toast.error(res?.data?.data?.message);
    //   navigate("/login");
    // } catch (e: any) {
    //   let message = "";
    //   if (e?.response?.data?.message) {
    //     message = e?.response?.data?.message;
    //   } else {
    //     message = "Can't change password";
    //   }
    //   toast.error(message);
    // } finally {
    //   setIsLoading(false);
    // }
    resetPassword({ password, confirmPassword, token, authId });
  };

  useEffect(() => {
    const checkToken = async () => {
      if (token && authId) checkPasswordResetToken({ token, authId });
    };
    checkToken();
  }, [token, authId]);

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
                <Heading1 className=" text-center">Change Password</Heading1>
              </div>
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <form
                    onSubmit={handleSubmit(handleChangePassword)}
                    autoComplete="off"
                  >
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
                          <IconedInputBoxBox
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
                          </IconedInputBoxBox>
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
                          <IconedInputBoxBox
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
                          </IconedInputBoxBox>
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
                        value="Update Password"
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
                        Login
                      </Link>{" "}
                    </Paragraph>

                    <Paragraph className="mt-1">
                      Don't have an account?{" "}
                      <Link
                        to="/register"
                        className="underline text-blue-500 hover:text-blue-800"
                      >
                        Register
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
