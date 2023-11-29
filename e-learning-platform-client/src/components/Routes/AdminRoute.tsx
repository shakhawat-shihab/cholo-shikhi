import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = () => {
  const { userData } = useSelector((state: any) => state.auth);
  return userData.role == "admin" ? <Outlet /> : <Navigate to={"/login"} />;
};

export default AdminRoute;
