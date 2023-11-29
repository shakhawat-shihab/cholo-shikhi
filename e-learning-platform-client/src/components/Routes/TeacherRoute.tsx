import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const TeacherRoute = () => {
  const { userData } = useSelector((state: any) => state.auth);
  console.log("userData ", userData);
  return userData.role == "teacher" ? <Outlet /> : <Navigate to={"/login"} />;
};

export default TeacherRoute;
