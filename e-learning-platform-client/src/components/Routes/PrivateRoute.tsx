import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const { userData } = useSelector((state: any) => state.auth);
  return userData._id ? <Outlet /> : <Navigate to={"/login"} />;
};

export default PrivateRoute;
