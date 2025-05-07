import { Navigate } from "react-router";
import useOptionalUser from "../features/authentication/api/useOptionalUser";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const { data, status } = useOptionalUser();

  if (status === "pending") return <LoadingSpinner />;

  if (status === "success" && !data?.data?.user)
    return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
