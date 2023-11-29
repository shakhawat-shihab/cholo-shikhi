import { useEffect, useState } from "react";
import Loader from "../../../organisms/loader/loader";
import { Link, useParams } from "react-router-dom";
import authApi from "../../../../api/authApi";
import Heading1 from "../../../atoms/heading/heading1";
import useAuthHook from "../../../../hooks/auth/useAuthHook";

type Props = {};

export default function VerifyEmail({}: Props) {
  const { authId, token } = useParams();

  const { verifyEmail, success, response, isLoadingAuth } = useAuthHook();

  useEffect(() => {
    const verifyEmailFunction = async () => {
      if (authId && token) {
        await verifyEmail({ authId, token });
      }
    };
    verifyEmailFunction();
  }, [authId, token]);

  //   console.log("response ", response);

  return (
    <div>
      {isLoadingAuth && (
        <div>
          <Loader />
        </div>
      )}
      <div className="min-h-screen bg-gray-100 py-6 flex items-center justify-center sm:py-12">
        <div>
          {isLoadingAuth == false && (
            <div>
              {success ? (
                <Heading1 className="text-green-800">
                  {response} <br />
                  <Link
                    to="/login"
                    className="underline text-blue-500 hover:text-blue-800"
                  >
                    Login
                  </Link>
                </Heading1>
              ) : (
                <Heading1 className="text-red-500">{response}</Heading1>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
