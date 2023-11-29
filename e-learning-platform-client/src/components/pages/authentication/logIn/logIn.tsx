import { RiLockPasswordLine, RiAtLine } from "react-icons/ri";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import InputSubmit from "../../../atoms/input/inputSubmit";
import Span from "../../../atoms/paragraph/span";
import Paragraph from "../../../atoms/paragraph/paragraph";
import { useState } from "react";
import Loader from "../../../organisms/loader/loader";
import AuthApi from "../../../../api/authApi";
import { addUserData } from "../../../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import IconedInputBox from "../../../molecules/iconedInput/iconedInputBox";
import useAuthHook from "../../../../hooks/auth/useAuthHook";

type Props = {};

export default function LogIn({}: Props) {
  // const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { logIn, isLoadingAuth, user } = useAuthHook();

  const handleLogin = async (data: any) => {
    console.log(getValues("email"));
    console.log(getValues("password"));
    let email = getValues("email").toLowerCase().trim();
    let password = getValues("password");
    // try {
    //   const res = await AuthApi.logIn({ email, password });
    //   // console.log(res?.data);
    //   localStorage.setItem("token", res?.data?.data?.token);
    //   dispatch(addUserData(res?.data?.data));
    //   toast.success(res?.data?.message);
    //   navigate("/");
    // } catch (e: any) {
    //   // console.log(e);
    //   let message = "";
    //   if (e?.response?.data?.message) {
    //     console.log("Error: ", e?.response?.data?.message);
    //     message = e?.response?.data?.message;
    //   } else {
    //     message = "Failed to log in!";
    //   }
    //   toast.error(message);
    // } finally {
    //   setIsLoading(false);
    // }
    await logIn({ email, password });
  };

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
          <div className="absolute sm:inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl "></div>
          {/* white layout */}
          <div className="relative px-4 py-10 bg-white shadow-lg rounded-3xl sm:p-20  w-full ">
            <div className="">
              <div>
                <h1 className="text-2xl font-semibold text-center">
                  Login Form
                </h1>
              </div>
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <form onSubmit={handleSubmit(handleLogin)} autoComplete="off">
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
                    {/* password */}
                    <div className="mb-8">
                      <Controller
                        name="password"
                        control={control}
                        rules={{
                          required: "password must be provided",
                          // minLength: {
                          //   value: 8,
                          //   message: "Minimum length must be 8",
                          // },
                          // pattern: {
                          //   value:
                          //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$/,
                          //   message:
                          //     "Password must contain one special character, a capital letter, a digit ",
                          // },
                        }}
                        render={({ field }) => (
                          <IconedInputBox
                            id="password"
                            field={field}
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

                    <div className="relative">
                      <InputSubmit
                        value="Log in"
                        className="bg-blue-500 hover:bg-blue-700 w-100 text-white rounded-md px-2 py-1 w-full"
                      />
                    </div>
                  </form>
                  <div className="mt-5 text-center">
                    <Paragraph className="mt-7">
                      Don't have an account?{" "}
                      <Link
                        to="/register"
                        className="underline text-blue-500 hover:text-blue-800"
                      >
                        Register
                      </Link>{" "}
                    </Paragraph>

                    <Paragraph className="mt-1">
                      Forget Password?{" "}
                      <Link
                        to="/forget-password"
                        className="underline text-blue-500 hover:text-blue-800"
                      >
                        Reset Password
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
