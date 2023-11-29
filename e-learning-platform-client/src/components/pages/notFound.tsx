import Cookies from "js-cookie";
import Button from "../atoms/button/button";
import courseApi from "../../api/courseApi";
import FullScreenMessage from "../organisms/fullScreenMessage/fullScreenMessage";
type Props = {};

export default function NotFound({}: Props) {
  console.log("cookie ", Cookies.get("accessToken"));
  return (
    <div>
      <FullScreenMessage
        className="text-red-700 text-4xl font-bold"
        message="Page not found"
      />
    </div>
  );
}
