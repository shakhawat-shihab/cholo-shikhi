import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const StudentRoute = () => {
  const { userData } = useSelector((state: any) => state.auth);
  return userData.role == "student" ? <Outlet /> : <Navigate to={"/login"} />;
};

export default StudentRoute;
